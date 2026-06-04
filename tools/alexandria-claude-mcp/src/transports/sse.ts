import express, { type Request, type Response } from "express";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import type { Server } from "@modelcontextprotocol/sdk/server/index.js";

import type { Config } from "../config.js";
import type { Logger } from "../logger.js";
import { extractBearer, verifyBearer } from "../auth/keycloak.js";

const READ_SCOPES = ["alexandria:read"];

/**
 * Transporte SSE com Express + Bearer middleware via Keycloak introspection.
 *
 * Rotas:
 *   GET  /sse        — abre a stream SSE (long-lived)
 *   POST /messages   — endpoint POST que o cliente usa pra enviar payloads
 *   GET  /healthz    — health check público (sem auth)
 *
 * D-017: bind explícito em 127.0.0.1; exposição externa via tunnel
 * `auth.grupototum.com` (responsabilidade do Deploy & Infra).
 */
export async function startSse(params: {
  server: Server;
  config: Config;
  logger: Logger;
}): Promise<void> {
  const { server, config, logger } = params;
  const app = express();
  app.use(express.json({ limit: "1mb" }));

  // Mantemos as transports SSE ativas indexadas pelo sessionId pra parear
  // o POST /messages com a stream correta.
  const sessions = new Map<string, SSEServerTransport>();

  app.get("/healthz", (_req: Request, res: Response) => {
    res.status(200).json({ status: "ok", service: "alexandria-mcp", version: "0.2.0" });
  });

  app.get("/sse", async (req: Request, res: Response) => {
    const verdict = await verifyBearer({
      bearer: extractBearer(req.header("authorization")),
      requiredScopes: READ_SCOPES,
      config,
      logger,
    });
    if (!verdict.ok) {
      res.status(401).json({ error: "unauthorized", reason: verdict.reason });
      return;
    }

    const transport = new SSEServerTransport("/messages", res);
    sessions.set(transport.sessionId, transport);

    res.on("close", () => {
      sessions.delete(transport.sessionId);
      logger.info({ sessionId: transport.sessionId }, "SSE session closed");
    });

    await server.connect(transport);
    logger.info(
      { sessionId: transport.sessionId, bypassed: verdict.bypassed, clientId: verdict.clientId },
      "SSE session attached",
    );
  });

  app.post("/messages", async (req: Request, res: Response) => {
    const verdict = await verifyBearer({
      bearer: extractBearer(req.header("authorization")),
      requiredScopes: READ_SCOPES,
      config,
      logger,
    });
    if (!verdict.ok) {
      res.status(401).json({ error: "unauthorized", reason: verdict.reason });
      return;
    }

    const sessionId =
      (typeof req.query.sessionId === "string" ? req.query.sessionId : undefined) ?? "";
    const transport = sessions.get(sessionId);
    if (!transport) {
      res.status(404).json({ error: "session not found", sessionId });
      return;
    }
    await transport.handlePostMessage(req, res, req.body);
  });

  await new Promise<void>((resolve) => {
    app.listen(config.sse.port, config.sse.host, () => {
      logger.info(
        { host: config.sse.host, port: config.sse.port },
        "alexandria-mcp pronto via SSE",
      );
      resolve();
    });
  });
}
