/**
 * Navigation Config — Single Source of Truth
 * Used by AppSidebar (desktop) and AppSidebarContent (mobile).
 * Organized into Totum OS semantic workspaces.
 */

import {
  type LucideIcon,
  Bot,
  KanbanSquare,
  GitBranch,
  CheckSquare,
  Building2,
  Contact,
  UserPlus,
  BookMarked,
  Cpu,
  Terminal,
  Settings,
  LayoutTemplate,
  UserCog,
  Network,
  ShieldCheck,
  Brain,
  FileText,
  BookOpen,
  Lightbulb,
  Cloud,
  Library,
  Home,
  MessageSquareText,
  WandSparkles,
  Sparkles,
  Workflow,
  Link2,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface NavItem {
  label: string;
  path: string;
  icon: LucideIcon;
  badge?: "approvals" | null;
}

export interface NavSubItem {
  label: string;
  path: string;
  icon?: LucideIcon;
  emoji?: string | null;
  badge?: "approvals" | null;
}

export interface NavSection {
  id: string;
  label: string;
  items: NavItem[];
  groups?: NavGroup[];
}

export interface NavGroup {
  id: string;
  label: string;
  path: string;
  icon: LucideIcon;
  subItems: NavSubItem[];
}

// ─── Totum OS Workspaces ─────────────────────────────────────────────────────

export const navigationSections: NavSection[] = [
  {
    id: "inicio",
    label: "Início",
    items: [
      { label: "Visão Geral", icon: Home, path: "/dashboard" },
      { label: "Escritório", icon: Building2, path: "/office" },
    ],
  },

  {
    id: "ia",
    label: "IA",
    items: [],
    groups: [
      {
        id: "ia-command",
        label: "Command Center",
        path: "/ai-command-center",
        icon: MessageSquareText,
        subItems: [
          { label: "Conversa IA", path: "/ai-command-center", icon: MessageSquareText },
          { label: "Geradores", path: "/ai-command-center?tab=generators", icon: WandSparkles },
        ],
      },
      {
        id: "ia-agentes",
        label: "Agentes",
        path: "/agents",
        icon: Bot,
        subItems: [
          { label: "Painel de Agentes", path: "/agents", icon: Bot },
          { label: "Radar", path: "/ai-command-center?agent=radar", emoji: "🔍" },
          { label: "Gestor", path: "/ai-command-center?agent=gestor", emoji: "📊" },
          { label: "Social", path: "/ai-command-center?agent=social", emoji: "📱" },
          { label: "Atendente", path: "/ai-command-center?agent=atendente", emoji: "🎧" },
          { label: "SDR", path: "/ai-command-center?agent=sdr", emoji: "🤝" },
          { label: "Kimi", path: "/ai-command-center?agent=kimi", emoji: "🤖" },
        ],
      },
      {
        id: "ia-ferramentas",
        label: "Ferramentas IA",
        path: "/alexandria/openclaw",
        icon: Workflow,
        subItems: [
          { label: "OpenClaw", path: "/alexandria/openclaw", icon: Cloud },
          { label: "Suna Agent", path: "/suna", icon: Cpu },
          { label: "Claude Code", path: "/claude-code", icon: Terminal },
          { label: "Cráudio Codete", path: "/craudio-codete", icon: Cpu },
        ],
      },
    ],
  },

  {
    id: "alexandria",
    label: "Alexandria",
    items: [],
    groups: [
      {
        id: "alexandria-biblioteca",
        label: "Biblioteca",
        path: "/alexandria",
        icon: BookOpen,
        subItems: [
          { label: "Central Alexandria", path: "/alexandria", icon: Library },
          { label: "Hermione", path: "/hermione", icon: Brain },
          { label: "Portal POPs", path: "/alexandria/pops", icon: FileText },
          { label: "Contexto", path: "/alexandria/context", icon: BookOpen },
          { label: "Skills", path: "/alexandria/skills", icon: Lightbulb },
          { label: "Conexões", path: "/alexandria/bridges", icon: Link2 },
          { label: "Tutorial", path: "/alexandria/tutorial", icon: Sparkles },
          { label: "Exportadores IA", path: "/alexandria?tab=exports", icon: GitBranch },
        ],
      },
    ],
  },

  {
    id: "operacao",
    label: "Operação",
    items: [],
    groups: [
      {
        id: "operacao-fluxo",
        label: "Fluxo de Trabalho",
        path: "/tasks",
        icon: KanbanSquare,
        subItems: [
          { label: "Tarefas", path: "/tasks", icon: KanbanSquare },
          { label: "Conteúdo", path: "/content", icon: GitBranch },
          { label: "Plano de Ação", path: "/action-plan", icon: CheckSquare },
        ],
      },
      {
        id: "operacao-clientes",
        label: "Clientes",
        path: "/clients",
        icon: Contact,
        subItems: [
          { label: "Clientes", path: "/clients", icon: Contact },
          { label: "Novo Cliente", path: "/new-client", icon: UserPlus },
        ],
      },
    ],
  },

  {
    id: "sistema",
    label: "Sistema",
    items: [],
    groups: [
      {
        id: "sistema-admin",
        label: "Administração",
        path: "/settings",
        icon: Settings,
        subItems: [
          { label: "Configurações", path: "/settings", icon: Settings },
          { label: "Aprovações", path: "/admin/approvals", icon: ShieldCheck, badge: "approvals" },
          { label: "Operadores", path: "/operadores", icon: UserCog },
        ],
      },
      {
        id: "sistema-infra",
        label: "Infraestrutura",
        path: "/deployment",
        icon: ShieldCheck,
        subItems: [
          { label: "Deploy", path: "/deployment", icon: ShieldCheck },
          { label: "Hosting", path: "/hosting", icon: Network },
          { label: "Mapa do Sistema", path: "/diagrama-sistemas", icon: LayoutTemplate },
          { label: "Documentação", path: "/docs", icon: BookMarked },
        ],
      },
    ],
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Flatten all navigation paths for use in things like CommandPalette,
 * route guards, or breadcrumbs.
 */
export function getAllNavPaths(): string[] {
  const paths: string[] = [];
  for (const section of navigationSections) {
    for (const item of section.items) {
      paths.push(item.path);
    }
    for (const group of section.groups || []) {
      paths.push(group.path);
      for (const sub of group.subItems) {
        paths.push(sub.path);
      }
    }
  }
  return paths;
}

/**
 * Check if a path belongs to a given section id.
 */
export function isPathInSection(path: string, sectionId: string): boolean {
  const section = navigationSections.find((s) => s.id === sectionId);
  if (!section) return false;

  if (section.items.some((i) => i.path === path)) return true;
  for (const group of section.groups || []) {
    if (group.path === path) return true;
    if (group.subItems.some((item) => item.path === path)) return true;
  }
  return false;
}

/**
 * Get section id for a given path (for active section highlighting).
 */
export function getSectionForPath(path: string): string | null {
  for (const section of navigationSections) {
    if (isPathInSection(path, section.id)) return section.id;
  }
  return null;
}

// ─── Command Palette integration ─────────────────────────────────────────────

export interface CommandPaletteEntry {
  id: string;
  label: string;
  group: string;
  path: string;
  icon: LucideIcon;
}

/**
 * Build CommandPalette entries directly from navigationSections so the palette
 * always stays in sync with the sidebar. Sub-items without a `icon` prop fall
 * back to the parent section's icon.
 */
export function getCommandPaletteEntries(): CommandPaletteEntry[] {
  const entries: CommandPaletteEntry[] = [];

  for (const section of navigationSections) {
    for (const item of section.items) {
      entries.push({
        id: `nav-${item.path}`,
        label: item.label,
        group: section.label,
        path: item.path,
        icon: item.icon,
      });
    }

    for (const group of section.groups || []) {
      entries.push({
        id: `nav-${group.path}`,
        label: group.label,
        group: section.label,
        path: group.path,
        icon: group.icon,
      });
      for (const sub of group.subItems) {
        if (sub.path === group.path) continue;
        entries.push({
          id: `nav-${sub.path}`,
          label: sub.label,
          group: section.label,
          path: sub.path,
          icon: sub.icon || group.icon,
        });
      }
    }
  }

  return entries;
}
