import type { ReactNode } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useLocation } from "react-router-dom";
import { CountBadge } from "@/components/ui/badge";
import { navigationSections, type NavItem, type NavSubItem } from "@/config/navigation";
import { cn } from "@/lib/utils";
import { useSidebarStore } from "@/stores/sidebarStore";

interface SidebarNavigationProps {
  collapsed?: boolean;
  pendingApprovals?: number;
  onNavigate: (path: string) => void;
}

function matchesPath(currentPath: string, currentSearch: string, targetPath: string) {
  const url = new URL(targetPath, "https://totum.local");
  if (url.pathname !== currentPath) return false;
  return !url.search || url.search === currentSearch;
}

function hasActiveSubPath(currentPath: string, currentSearch: string, targetPath: string) {
  const url = new URL(targetPath, "https://totum.local");
  return url.pathname === currentPath && (!url.search || url.search === currentSearch);
}

export default function SidebarNavigation({
  collapsed = false,
  pendingApprovals = 0,
  onNavigate,
}: SidebarNavigationProps) {
  const location = useLocation();
  const expandedSections = useSidebarStore((state) => state.expandedSections);
  const toggleSection = useSidebarStore((state) => state.toggleSection);

  const isActive = (path: string) => matchesPath(location.pathname, location.search, path);

  const isGroupActive = (groupPath: string, subItems: NavSubItem[]) =>
    hasActiveSubPath(location.pathname, location.search, groupPath) ||
    subItems.some((subItem) => isActive(subItem.path));

  const renderBadge = (badge: NavItem["badge"] | NavSubItem["badge"], compact = false) => {
    const count = badge === "approvals" ? pendingApprovals : 0;
    if (!count) return null;

    return compact ? (
      <CountBadge count={count} max={9} className="absolute -top-1.5 -right-1.5 min-w-[14px] h-[14px] px-0.5 text-[9px]" />
    ) : (
      <CountBadge count={count} max={9} className="ml-auto h-[18px] min-w-[18px] px-1 text-[10px]" />
    );
  };

  const SectionLabel = ({ children }: { children: ReactNode }) =>
    !collapsed ? (
      <p className="mb-2 px-3 text-[12px] tracking-[-0.01em] text-sidebar-foreground/45">
        {children}
      </p>
    ) : null;

  const NavItemButton = ({ item }: { item: NavItem }) => {
    const active = isActive(item.path);

    return (
      <li>
        <button
          onClick={() => onNavigate(item.path)}
          className={cn(
            "relative flex w-full items-center gap-3 rounded-2xl border border-transparent transition-all duration-200",
            collapsed ? "justify-center px-2 py-2.5" : "px-3 py-2.5",
            active
              ? "border-primary/20 bg-primary/10 text-primary shadow-[0_12px_24px_-22px_rgba(0,113,227,0.9)]"
              : "text-sidebar-foreground/65 hover:border-sidebar-border hover:bg-sidebar-accent/60 hover:text-sidebar-foreground",
          )}
        >
          {active && !collapsed ? (
            <div className="absolute left-2 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-primary" />
          ) : null}
          <div className="relative shrink-0">
            <item.icon className={cn("h-[18px] w-[18px]", active && "text-primary")} />
            {renderBadge(item.badge, true)}
          </div>
          {!collapsed ? (
            <>
              <span className="flex-1 truncate text-[13px] font-medium tracking-wide">{item.label}</span>
              {renderBadge(item.badge)}
            </>
          ) : null}
        </button>
      </li>
    );
  };

  const NavGroup = ({
    groupId,
    label,
    icon: Icon,
    path,
    subItems,
  }: {
    groupId: string;
    label: string;
    icon: NavItem["icon"];
    path: string;
    subItems: NavSubItem[];
  }) => {
    const active = isGroupActive(path, subItems);
    const expanded = expandedSections[groupId] ?? active;

    return (
      <li>
        {collapsed ? (
          <button
            onClick={() => onNavigate(path)}
            className={cn(
              "flex w-full items-center justify-center rounded-2xl border border-transparent px-2 py-2.5 transition-all duration-200",
              active
                ? "border-primary/20 bg-primary/10 text-primary"
                : "text-sidebar-foreground/60 hover:border-sidebar-border hover:bg-sidebar-accent/60 hover:text-sidebar-foreground",
            )}
          >
            <Icon className="h-[18px] w-[18px]" />
          </button>
        ) : (
          <>
            <div className="flex items-center gap-1">
              <button
                onClick={() => toggleSection(groupId)}
                className="shrink-0 p-1 text-sidebar-foreground/35 transition-colors hover:text-sidebar-foreground"
                aria-label={expanded ? `Recolher ${label}` : `Expandir ${label}`}
              >
                {expanded ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
              </button>
              <button
                onClick={() => onNavigate(path)}
                className={cn(
                  "relative flex flex-1 items-center gap-2.5 rounded-2xl border border-transparent px-3 py-2.5 transition-all duration-200",
                  active
                    ? "border-primary/20 bg-primary/10 text-primary"
                    : "text-sidebar-foreground/60 hover:border-sidebar-border hover:bg-sidebar-accent/60 hover:text-sidebar-foreground",
                )}
              >
                <Icon className={cn("h-[18px] w-[18px] shrink-0", active && "text-primary")} />
                <span className="truncate text-[13px] font-medium tracking-wide">{label}</span>
              </button>
            </div>

            {expanded ? (
              <ul className="ml-5 mt-1 space-y-1 border-l border-sidebar-border/50 pl-4">
                {subItems.map((subItem) => {
                  const subActive = isActive(subItem.path);

                  return (
                    <li key={subItem.path}>
                      <button
                        onClick={() => onNavigate(subItem.path)}
                        className={cn(
                          "flex w-full items-center gap-2 rounded-xl px-3 py-2 text-[12px] transition-all duration-200",
                          subActive
                            ? "bg-primary/10 text-primary"
                            : "text-sidebar-foreground/50 hover:bg-sidebar-accent/40 hover:text-sidebar-foreground",
                        )}
                      >
                        {subItem.emoji ? (
                          <span className="shrink-0 text-[13px] leading-none">{subItem.emoji}</span>
                        ) : subItem.icon ? (
                          <subItem.icon className="h-3.5 w-3.5 shrink-0" />
                        ) : null}
                        <span className="truncate">{subItem.label}</span>
                        {renderBadge(subItem.badge)}
                      </button>
                    </li>
                  );
                })}
              </ul>
            ) : null}
          </>
        )}
      </li>
    );
  };

  return (
    <nav aria-label="Navegação principal" className={cn("flex-1 overflow-y-auto px-3 py-4", collapsed ? "space-y-5" : "space-y-6")}>
      {navigationSections.map((section) => (
        <div key={section.id}>
          <SectionLabel>{section.label}</SectionLabel>
          <ul className="space-y-1">
            {section.items.map((item) => (
              <NavItemButton key={item.path} item={item} />
            ))}
            {(section.groups || []).map((group) => (
              <NavGroup
                key={group.id}
                groupId={group.id}
                label={group.label}
                icon={group.icon}
                path={group.path}
                subItems={group.subItems}
              />
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );
}
