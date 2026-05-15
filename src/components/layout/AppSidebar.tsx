import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { LogOut, ChevronLeft, Menu, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useSidebarStore } from "@/stores/sidebarStore";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import SidebarNavigation from "./SidebarNavigation";
import { usePendingApprovalsCount } from "@/hooks/usePendingApprovalsCount";

export default function AppSidebar() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const collapsed = useSidebarStore((s) => s.collapsed);
  const toggleCollapsed = useSidebarStore((s) => s.toggleCollapsed);
  const [isNavigating, setIsNavigating] = useState(false);
  const pendingApprovals = usePendingApprovalsCount();

  const openCommandPalette = () =>
    window.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true, bubbles: true }));

  const handleNav = (path: string) => {
    if (isNavigating) return;
    setIsNavigating(true);
    navigate(path);
    setTimeout(() => setIsNavigating(false), 300);
  };

  const handleLogout = () => { signOut(); navigate("/login"); };

  // ── render ───────────────────────────────────────────────────────────────────

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 flex h-full flex-col border-r border-sidebar-border/80 bg-sidebar/90 backdrop-blur-2xl transition-all duration-300 ease-in-out",
        collapsed ? "w-[72px]" : "w-[260px]"
      )}
    >
      {/* Logo */}
      <div className="flex h-16 shrink-0 items-center justify-between border-b border-sidebar-border/70 px-5">
        {!collapsed && (
          <div className="flex items-center gap-2.5">
            <div className="grid h-9 w-9 place-items-center rounded-full bg-primary text-white shadow-[0_18px_36px_-28px_rgba(0,113,227,0.9)]">
              <span className="text-sm font-semibold">T</span>
            </div>
            <span className="font-['SF_Pro_Display','SF_Pro_Icons','Helvetica_Neue',Helvetica,Arial,sans-serif] text-lg font-semibold tracking-[-0.02em] text-sidebar-foreground">
              Totum OS
            </span>
          </div>
        )}
        <button
          onClick={toggleCollapsed}
          aria-label={collapsed ? "Expandir menu" : "Recolher menu"}
          className="p-1.5 hover:bg-sidebar-accent transition-colors text-sidebar-foreground/50 hover:text-sidebar-foreground"
        >
          {collapsed ? <Menu className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* ⌘K Search */}
      <div className={cn("px-3 pt-3 pb-1 shrink-0", collapsed && "px-2")}>
        <button
          onClick={openCommandPalette}
          className={cn(
            "flex w-full items-center gap-2 rounded-full border border-sidebar-border/80 bg-sidebar-accent/50 text-sidebar-foreground/45 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground",
            collapsed ? "justify-center p-2" : "px-3 py-2"
          )}
        >
          <Search className="w-3.5 h-3.5 shrink-0" />
          {!collapsed && (
            <>
              <span className="text-[12px] flex-1 text-left">Buscar no Totum OS...</span>
              <kbd className="hidden sm:flex items-center gap-0.5 rounded-full border border-sidebar-border px-2 py-0.5 text-[10px] opacity-40">
                ⌘K
              </kbd>
            </>
          )}
        </button>
      </div>

      {/* Navigation */}
      <SidebarNavigation collapsed={collapsed} pendingApprovals={pendingApprovals} onNavigate={handleNav} />

      {/* Footer / User */}
      <div className="shrink-0 space-y-3 border-t border-sidebar-border/70 p-3">
        {collapsed ? (
          <div className="flex flex-col items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full border border-primary/20 bg-primary/10 text-xs font-semibold uppercase text-primary">
              {user?.email?.[0] || "U"}
            </div>
            <ThemeToggle compact />
            <button
              onClick={handleLogout}
              className="p-1.5 hover:bg-sidebar-accent text-sidebar-foreground/50 hover:text-sidebar-foreground transition-colors"
              title="Sair"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-primary/20 bg-primary/10 text-sm font-semibold uppercase text-primary">
                {user?.email?.[0] || "U"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-medium text-sidebar-foreground truncate">
                  {user?.email?.split("@")[0] || "User"}
                </p>
                <p className="text-[11px] text-sidebar-foreground/50 truncate">
                  {user?.email || ""}
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="p-1.5 hover:bg-sidebar-accent text-sidebar-foreground/50 hover:text-sidebar-foreground transition-colors"
                title="Sair"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
            <ThemeToggle className="w-full justify-center" />
          </>
        )}
      </div>
    </aside>
  );
}
