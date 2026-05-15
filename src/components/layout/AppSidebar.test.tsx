import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import AppSidebar from "./AppSidebar";
import { ThemeProvider } from "@/contexts/ThemeContext";

// Mock AuthContext
import { vi } from "vitest";

vi.mock("@/contexts/AuthContext", () => ({
  useAuth: () => ({
    user: { email: "test@totum.com" },
    signOut: vi.fn(),
  }),
}));

// Mock supabase
vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    from: vi.fn().mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      count: vi.fn().mockReturnThis(),
      then: vi.fn().mockResolvedValue({ count: 0 }),
    }),
  },
}));

describe("AppSidebar", () => {
  it("renders Totum OS workspace labels", () => {
    render(
      <ThemeProvider>
        <MemoryRouter>
          <AppSidebar />
        </MemoryRouter>
      </ThemeProvider>
    );

    expect(screen.getByText("Início")).toBeInTheDocument();
    expect(screen.getByText("IA")).toBeInTheDocument();
    expect(screen.getAllByText("Alexandria").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("Operação")).toBeInTheDocument();
    expect(screen.getByText("Sistema")).toBeInTheDocument();
  });

  it("renders key navigation items", () => {
    render(
      <ThemeProvider>
        <MemoryRouter>
          <AppSidebar />
        </MemoryRouter>
      </ThemeProvider>
    );

    expect(screen.getByText("Command Center")).toBeInTheDocument();
    expect(screen.getByText("Visão Geral")).toBeInTheDocument();
    expect(screen.getByText("Fluxo de Trabalho")).toBeInTheDocument();
    expect(screen.getByText("Infraestrutura")).toBeInTheDocument();
    expect(screen.getByText("Biblioteca")).toBeInTheDocument();
  });

  it("renders accordion groups with key sub-items", () => {
    render(
      <ThemeProvider>
        <MemoryRouter>
          <AppSidebar />
        </MemoryRouter>
      </ThemeProvider>
    );

    expect(screen.getByText("Conversa IA")).toBeInTheDocument();
    expect(screen.getByText("Painel de Agentes")).toBeInTheDocument();
    expect(screen.getByText("Radar")).toBeInTheDocument();
    expect(screen.getByText("Central Alexandria")).toBeInTheDocument();
  });

  it("renders user email initial in footer", () => {
    render(
      <ThemeProvider>
        <MemoryRouter>
          <AppSidebar />
        </MemoryRouter>
      </ThemeProvider>
    );

    expect(screen.getByText("test")).toBeInTheDocument();
  });
});
