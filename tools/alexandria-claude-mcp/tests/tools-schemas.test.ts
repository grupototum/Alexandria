import { describe, it, expect } from "vitest";
import {
  ExecuteAgenticTaskInputSchema,
  EXECUTE_AGENTIC_TASK_JSON_SCHEMA,
} from "../src/tools/execute-agentic-task.js";
import {
  LogAgentMetricsInputSchema,
  LOG_AGENT_METRICS_JSON_SCHEMA,
} from "../src/tools/log-agent-metrics.js";

describe("TOOL execute_agentic_task — schema", () => {
  it("aceita input válido", () => {
    const ok = ExecuteAgenticTaskInputSchema.safeParse({
      division: "DIV-001",
      task_name: "workflow_1_lead_intake",
      context_query: "Lead de cliente odontológico SP",
    });
    expect(ok.success).toBe(true);
  });

  it("rejeita campos faltando", () => {
    const fail = ExecuteAgenticTaskInputSchema.safeParse({
      division: "DIV-001",
      task_name: "",
      context_query: "x",
    });
    expect(fail.success).toBe(false);
  });

  it("JSON Schema exportado bate com required + properties", () => {
    expect(EXECUTE_AGENTIC_TASK_JSON_SCHEMA.required).toEqual([
      "division",
      "task_name",
      "context_query",
    ]);
    expect(Object.keys(EXECUTE_AGENTIC_TASK_JSON_SCHEMA.properties)).toEqual([
      "division",
      "task_name",
      "context_query",
    ]);
    expect(EXECUTE_AGENTIC_TASK_JSON_SCHEMA.additionalProperties).toBe(false);
  });
});

describe("TOOL log_agent_metrics — schema", () => {
  it("aceita input válido", () => {
    const ok = LogAgentMetricsInputSchema.safeParse({
      agent: "ARTEMIS",
      latency_ms: 2400,
      tokens_in: 800,
      tokens_out: 1200,
      success: true,
    });
    expect(ok.success).toBe(true);
  });

  it("aceita campos opcionais workflow_id e error_message", () => {
    const ok = LogAgentMetricsInputSchema.safeParse({
      agent: "LOKI",
      latency_ms: 4500,
      tokens_in: 1000,
      tokens_out: 1500,
      success: false,
      workflow_id: "WF-001",
      error_message: "timeout interno",
    });
    expect(ok.success).toBe(true);
  });

  it("rejeita latency_ms negativo", () => {
    const fail = LogAgentMetricsInputSchema.safeParse({
      agent: "ARTEMIS",
      latency_ms: -1,
      tokens_in: 0,
      tokens_out: 0,
      success: true,
    });
    expect(fail.success).toBe(false);
  });

  it("rejeita tipo errado em success", () => {
    const fail = LogAgentMetricsInputSchema.safeParse({
      agent: "ARTEMIS",
      latency_ms: 100,
      tokens_in: 0,
      tokens_out: 0,
      success: "yes",
    });
    expect(fail.success).toBe(false);
  });

  it("JSON Schema exportado declara os 5 obrigatórios", () => {
    expect(LOG_AGENT_METRICS_JSON_SCHEMA.required).toEqual([
      "agent",
      "latency_ms",
      "tokens_in",
      "tokens_out",
      "success",
    ]);
    expect(LOG_AGENT_METRICS_JSON_SCHEMA.additionalProperties).toBe(false);
  });
});
