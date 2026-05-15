import {
  navigationSections,
  getAllNavPaths,
  getSectionForPath,
  isPathInSection,
  getCommandPaletteEntries,
} from "./navigation";

describe("navigation config", () => {
  it("has Totum OS workspaces", () => {
    expect(navigationSections).toHaveLength(5);
  });

  it("has correct workspace labels", () => {
    const labels = navigationSections.map((s) => s.label);
    expect(labels).toEqual(["Início", "IA", "Alexandria", "Operação", "Sistema"]);
  });

  it("has correct workspace ids", () => {
    const ids = navigationSections.map((s) => s.id);
    expect(ids).toEqual(["inicio", "ia", "alexandria", "operacao", "sistema"]);
  });

  it("Início has 2 items", () => {
    const inicio = navigationSections.find((s) => s.id === "inicio");
    expect(inicio?.items).toHaveLength(2);
  });

  it("IA has 3 navigation groups", () => {
    const ia = navigationSections.find((s) => s.id === "ia");
    expect(ia?.groups).toHaveLength(3);
  });

  it("Agentes group has 7 sub-items", () => {
    const ia = navigationSections.find((s) => s.id === "ia");
    const agentes = ia?.groups?.find((group) => group.id === "ia-agentes");
    expect(agentes?.subItems).toHaveLength(7);
  });

  it("Alexandria has a biblioteca group with 8 sub-items", () => {
    const alexandria = navigationSections.find((s) => s.id === "alexandria");
    const biblioteca = alexandria?.groups?.find((group) => group.id === "alexandria-biblioteca");
    expect(biblioteca?.subItems).toHaveLength(8);
  });

  it("Operação has 2 groups", () => {
    const operacao = navigationSections.find((s) => s.id === "operacao");
    expect(operacao?.groups).toHaveLength(2);
  });

  it("Sistema includes approvals badge in administração", () => {
    const sistema = navigationSections.find((s) => s.id === "sistema");
    const approvals = sistema?.groups
      ?.flatMap((group) => group.subItems)
      .find((item) => item.path === "/admin/approvals");
    expect(approvals?.badge).toBe("approvals");
  });

  it("getAllNavPaths returns all paths", () => {
    const paths = getAllNavPaths();
    expect(paths).toContain("/ai-command-center");
    expect(paths).toContain("/agents");
    expect(paths).toContain("/ai-command-center?agent=radar");
    expect(paths).toContain("/hermione");
    expect(paths).toContain("/alexandria/bridges");
    expect(paths).toContain("/tasks");
    expect(paths).toContain("/docs");
    expect(paths.length).toBeGreaterThan(20);
  });

  it("getSectionForPath returns correct section", () => {
    expect(getSectionForPath("/dashboard")).toBe("inicio");
    expect(getSectionForPath("/ai-command-center?agent=radar")).toBe("ia");
    expect(getSectionForPath("/hermione")).toBe("alexandria");
    expect(getSectionForPath("/tasks")).toBe("operacao");
    expect(getSectionForPath("/docs")).toBe("sistema");
  });

  it("isPathInSection works correctly", () => {
    expect(isPathInSection("/dashboard", "inicio")).toBe(true);
    expect(isPathInSection("/dashboard", "ia")).toBe(false);
    expect(isPathInSection("/hermione", "alexandria")).toBe(true);
  });

  // ── CommandPalette integration ───────────────────────────────────────────
  describe("getCommandPaletteEntries", () => {
    it("returns entries for all top-level items", () => {
      const entries = getCommandPaletteEntries();
      expect(entries.find((e) => e.path === "/ai-command-center")).toBeDefined();
      expect(entries.find((e) => e.path === "/tasks")).toBeDefined();
      expect(entries.find((e) => e.path === "/docs")).toBeDefined();
    });

    it("includes expandable parents and subitems", () => {
      const entries = getCommandPaletteEntries();
      expect(entries.find((e) => e.path === "/agents")).toBeDefined();
      expect(entries.find((e) => e.path === "/ai-command-center?agent=radar")).toBeDefined();
      expect(entries.find((e) => e.path === "/hermione")).toBeDefined();
      expect(entries.find((e) => e.path === "/alexandria/pops")).toBeDefined();
    });

    it("groups entries by pillar label", () => {
      const entries = getCommandPaletteEntries();
      const hub = entries.find((e) => e.path === "/dashboard");
      const radar = entries.find((e) => e.path === "/ai-command-center?agent=radar");
      const hermione = entries.find((e) => e.path === "/hermione");
      expect(hub?.group).toBe("Início");
      expect(radar?.group).toBe("IA");
      expect(hermione?.group).toBe("Alexandria");
    });

    it("has unique ids", () => {
      const entries = getCommandPaletteEntries();
      const ids = entries.map((e) => e.id);
      expect(new Set(ids).size).toBe(ids.length);
    });

    it("provides an icon for every entry", () => {
      const entries = getCommandPaletteEntries();
      entries.forEach((e) => expect(e.icon).toBeDefined());
    });
  });
});
