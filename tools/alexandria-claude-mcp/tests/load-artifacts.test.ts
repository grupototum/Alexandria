import { describe, it, expect, beforeEach } from "vitest";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  loadPromptOrDna,
  loadExecutionMatrix,
  loadHealthMetrics,
  clearArtifactCache,
} from "../src/data/load-artifacts.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..", "..", "..");

describe("load-artifacts — loadPromptOrDna", () => {
  it("retorna null quando não há prompt nem DNA para o par task/agent", async () => {
    const res = await loadPromptOrDna(
      REPO_ROOT,
      "__task_inexistente_m140__",
      "__agent_inexistente_m140__",
    );
    expect(res).toBeNull();
  });

  it("retorna null com repoRoot inválido (diretórios ausentes)", async () => {
    const res = await loadPromptOrDna("/tmp/__nao_existe_m140__", "x", "y");
    expect(res).toBeNull();
  });
});

describe("load-artifacts — loaders + cache", () => {
  beforeEach(() => {
    clearArtifactCache();
  });

  it("loadExecutionMatrix carrega e valida (workflows backup sem SLA não quebram — M118)", async () => {
    const matrix = await loadExecutionMatrix(REPO_ROOT);
    expect(matrix.execution_matrix).toBeDefined();
    // Os backups (18/19/20) existem sem total_duration_s/retry_policy/sla_target.
    expect(Object.keys(matrix.execution_matrix).length).toBeGreaterThan(0);
  });

  it("loadHealthMetrics carrega o JSON de health", async () => {
    const health = await loadHealthMetrics(REPO_ROOT);
    expect(health.health_metrics).toBeDefined();
  });

  it("memoiza (2ª chamada retorna a mesma referência até clearArtifactCache)", async () => {
    const a = await loadHealthMetrics(REPO_ROOT);
    const b = await loadHealthMetrics(REPO_ROOT);
    expect(a).toBe(b); // mesma referência (cache)
    clearArtifactCache();
    const c = await loadHealthMetrics(REPO_ROOT);
    expect(c).not.toBe(a); // recarregado após clear
  });
});
