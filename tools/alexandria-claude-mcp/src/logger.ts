import pino from "pino";

/**
 * Logger central. Sempre escreve em stderr — stdout é reservado para
 * o transporte JSON-RPC do MCP em modo Stdio.
 */
export function createLogger(level: pino.Level): pino.Logger {
  return pino(
    {
      level,
      base: { service: "alexandria-mcp" },
      timestamp: pino.stdTimeFunctions.isoTime,
    },
    pino.destination(2), // 2 = stderr fd
  );
}

export type Logger = pino.Logger;
