import { loadConfig } from "./config.js";
import { createLogger } from "./logger.js";
import { buildServer } from "./server.js";
import { startStdio } from "./transports/stdio.js";
import { startSse } from "./transports/sse.js";

async function main(): Promise<void> {
  const config = loadConfig();
  const logger = createLogger(config.logLevel);

  logger.info(
    {
      transport: config.transport,
      repoRoot: config.repoRoot,
      keycloakBypass: config.keycloak.bypass,
    },
    "alexandria-mcp boot",
  );

  const server = buildServer({ config, logger });

  if (config.transport === "sse") {
    await startSse({ server, config, logger });
  } else {
    await startStdio(server, logger);
  }
}

main().catch((err) => {
  // Logger pode não ter sido inicializado se loadConfig falhar.
  // eslint-disable-next-line no-console
  console.error("[alexandria-mcp] boot failed:", err);
  process.exit(1);
});
