import { describe, expect, it, vi } from "vitest";
import {
  buildKnowledgeSyncPreview,
  detectSkillCandidate,
  summarizeKnowledgeSyncHealth,
  normalizeGoogleDriveFolderId,
} from "./alexandriaKnowledgeSync";

vi.mock("@/integrations/supabase/client", () => ({
  supabase: {},
}));

describe("alexandriaKnowledgeSync", () => {
  it("detecta skill por caminho e estrutura", () => {
    expect(
      detectSkillCandidate({
        name: "SKILL.md",
        sourcePath: "vault/skills/skill_router/SKILL.md",
        content: "# Skill Router",
      }).isSkillCandidate
    ).toBe(true);

    expect(
      detectSkillCandidate({
        name: "roteador.md",
        content: "skill_id: skill_router\n## Entradas\n## Saídas",
      }).isSkillCandidate
    ).toBe(true);
  });

  it("gera preview de sync focado em skills verdes", () => {
    const preview = buildKnowledgeSyncPreview("logseq_local", [
      {
        name: "skills/router/SKILL.md",
        content: "# Skill Router\n## Entradas\n## Saídas",
      },
      {
        name: "journal.md",
        content: "diário pessoal com rotina e contexto íntimo",
      },
    ]);

    expect(preview.skillCandidates).toHaveLength(1);
    expect(preview.importableSkills).toHaveLength(1);
    expect(preview.blockedFiles.length).toBeGreaterThanOrEqual(0);
    expect(preview.health.status).toBe("ready");
  });

  it("mantem duplicatas fora da importacao automatica", () => {
    const preview = buildKnowledgeSyncPreview("google_drive", [
      {
        name: "SKILL.md",
        sourcePath: "skills/router/SKILL.md",
        externalId: "drive-file-1",
        content: "# Router\nskill_id: router",
      },
      {
        name: "SKILL copy.md",
        sourcePath: "skills/router-copy/SKILL.md",
        externalId: "drive-file-1",
        content: "# Router\nskill_id: router",
      },
    ]);

    expect(preview.skillCandidates).toHaveLength(2);
    expect(preview.importableSkills).toHaveLength(1);
    expect(preview.duplicateFiles).toHaveLength(1);
    expect(preview.reviewFiles).toHaveLength(1);
    expect(preview.health.status).toBe("needs_review");
  });

  it("resume uma rodada vazia para monitoramento", () => {
    const health = summarizeKnowledgeSyncHealth({
      files: [],
      skillCandidates: [],
      importableSkills: [],
      reviewFiles: [],
      blockedFiles: [],
      duplicateFiles: [],
    });

    expect(health.status).toBe("empty");
    expect(health.score).toBe(0);
    expect(health.warnings[0]).toMatch(/Nenhum arquivo/);
  });

  it("normaliza links e ids de pasta do Google Drive", () => {
    expect(normalizeGoogleDriveFolderId("https://drive.google.com/drive/folders/abc123?usp=sharing")).toBe("abc123");
    expect(normalizeGoogleDriveFolderId("https://drive.google.com/open?id=xyz789")).toBe("xyz789");
    expect(normalizeGoogleDriveFolderId("plain-folder-id")).toBe("plain-folder-id");
  });
});
