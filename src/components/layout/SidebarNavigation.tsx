import type { ReactNode } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useLocation } from "react-router-dom";
import { navigationSections, type NavItem, type NavSubItem } from "@/config/navigation";
import { cn } from "@/lib/utils";

const CountBadge = ({ count, max = 9, className }: { count: number; max?: number; className?: string }) => {
  const displayCount = count > max ? `${max}+` : count;
  return (
    <div
      className={cn(
        "inline-flex items-center justify-center rounded-full bg-[#fafafa] text-[#0a0a0a] font-bold",
        className
      )}
    >
      {displayCount}
    </div>
  );
};
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
      <p className="mb-2 px-3 text-[11px] font-medium tracking-[0.04em] uppercase text-[#737373]">
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
            "relative flex w-full items-center gap-3 rounded-[8px] border border-transparent transition-all duration-200",
            collapsed ? "justify-center px-2 py-2" : "px-3 py-2",
            active
              ? "bg-gradient-to-b from-[#a06ff6] to-[#6b21ef] text-[#ffffff]"
              : "text-[#9ca3af] hover:bg-white/10 hover:text-[#ffffff]",
          )}
        >
          {active && !collapsed ? (
            <div className="absolute left-0 top-1/2 h-4 w-[2px] -translate-y-1/2 rounded-r-full bg-[#ffffff]" />
          ) : null}
          <div className="relative shrink-0">
            <item.icon className={cn("h-[18px] w-[18px]", active ? "text-[#fafafa]" : "text-[#a3a3a3]")} />
            {renderBadge(item.badge, true)}
          </div>
          {!collapsed ? (
            <>
              <span className="flex-1 truncate text-[14px] font-medium tracking-[-0.005em]">{item.label}</span>
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
              "flex w-full items-center justify-center rounded-[8px] border border-transparent px-2 py-2 transition-all duration-200",
              active
                ? "bg-gradient-to-b from-[#a06ff6] to-[#6b21ef] text-[#ffffff]"
                : "text-[#9ca3af] hover:bg-white/10 hover:text-[#ffffff]",
            )}
          >
            <Icon className="h-[18px] w-[18px]" />
          </button>
        ) : (
          <>
            <div className="flex items-center gap-1">
              <button
                onClick={() => toggleSection(groupId)}
                className="shrink-0 p-1 text-[#737373] transition-colors hover:text-[#fafafa]"
                aria-label={expanded ? `Recolher ${label}` : `Expandir ${label}`}
              >
                {expanded ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
              </button>
              <button
                onClick={() => onNavigate(path)}
                className={cn(
                  "relative flex flex-1 items-center gap-2.5 rounded-[8px] border border-transparent px-3 py-2 transition-all duration-200",
                  active
                    ? "bg-gradient-to-b from-[#a06ff6] to-[#6b21ef] text-[#ffffff]"
                    : "text-[#9ca3af] hover:bg-white/10 hover:text-[#ffffff]",
                )}
              >
                <Icon className={cn("h-[18px] w-[18px] shrink-0", active ? "text-[#fafafa]" : "text-[#a3a3a3]")} />
                <span className="truncate text-[14px] font-medium tracking-[-0.005em]">{label}</span>
              </button>
            </div>

            {expanded ? (
              <ul className="ml-5 mt-1 space-y-1 border-l border-white/10 pl-4">
                {subItems.map((subItem) => {
                  const subActive = isActive(subItem.path);

                  return (
                    <li key={subItem.path}>
                      <button
                        onClick={() => onNavigate(subItem.path)}
                        className={cn(
                          "flex w-full items-center gap-2 rounded-[8px] px-3 py-1.5 text-[14px] transition-all duration-200",
                          subActive
                            ? "bg-gradient-to-b from-[#a06ff6] to-[#6b21ef] text-[#ffffff]"
                            : "text-[#9ca3af] hover:bg-white/10 hover:text-[#ffffff]",
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
