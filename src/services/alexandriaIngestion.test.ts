import { afterEach, describe, expect, it, vi } from "vitest";
import { chunkMarkdown, fetchGithubMarkdownFiles } from "./alexandriaIngestion";

vi.mock("@/integrations/supabase/client", () => ({
  supabase: {},
}));

describe("alexandriaIngestion", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("quebra markdown por secoes e preserva titulos para catalogacao", () => {
    const chunks = chunkMarkdown(
      "# Guia\nIntroducao operacional.\n\n## Quando usar\nUse para catalogar conhecimento.\n\n## Saida\nArtefato revisavel.",
      "guia.md"
    );

    expect(chunks).toEqual([
      { heading: "Guia", content: "Introducao operacional." },
      { heading: "Quando usar", content: "Use para catalogar conhecimento." },
      { heading: "Saida", content: "Artefato revisavel." },
    ]);
  });

  it("usa o branch que respondeu quando o GitHub precisa cair de main para master", async () => {
    const fetchMock = vi.fn(async (url: string) => {
      if (url.includes("/git/trees/main?")) {
        return new Response("not found", { status: 404 });
      }

      if (url.includes("/git/trees/master?")) {
        return Response.json({
          tree: [
            { type: "blob", path: "docs/guia.md" },
            { type: "blob", path: "src/app.ts" },
          ],
        });
      }

      if (url === "https://raw.githubusercontent.com/totum/alexandria/master/docs/guia.md") {
        return new Response("# Guia\nConteudo", { status: 200 });
      }

      return new Response("unexpected", { status: 500 });
    });
    vi.stubGlobal("fetch", fetchMock);

    const files = await fetchGithubMarkdownFiles("https://github.com/totum/alexandria");

    expect(files).toEqual([
      {
        branch: "master",
        content: "# Guia\nConteudo",
        name: "guia.md",
        path: "totum/alexandria/docs/guia.md",
      },
    ]);
    expect(fetchMock).toHaveBeenCalledWith(
      "https://raw.githubusercontent.com/totum/alexandria/master/docs/guia.md"
    );
  });
});
