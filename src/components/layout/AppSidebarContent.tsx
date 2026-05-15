/**
 * AppSidebarContent — mobile-only sidebar (always expanded, no collapse toggle).
 * Uses the exact same nav data as AppSidebar.tsx so desktop and mobile stay in sync.
 */
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { LogOut, Search } from "lucide-react";
import SidebarNavigation from "./SidebarNavigation";
import { usePendingApprovalsCount } from "@/hooks/usePendingApprovalsCount";

interface Props {
  onNavigate?: () => void;
}

export default function AppSidebarContent({ onNavigate }: Props) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const pendingApprovals = usePendingApprovalsCount();

  const handleNav = (path: string) => {
    navigate(path);
    onNavigate?.();
  };

  const handleLogout = () => {
    signOut();
    navigate("/login");
    onNavigate?.();
  };

  return (
    <div className="flex h-full flex-col bg-sidebar/95 backdrop-blur-2xl">
      {/* Logo */}
      <div className="flex h-16 shrink-0 items-center gap-2.5 border-b border-sidebar-border/70 px-5">
        <div className="grid h-9 w-9 place-items-center rounded-full bg-primary text-white shadow-[0_18px_36px_-28px_rgba(0,113,227,0.9)]">
          <span className="text-sm font-semibold">T</span>
        </div>
        <span className="font-['SF_Pro_Display','SF_Pro_Icons','Helvetica_Neue',Helvetica,Arial,sans-serif] text-lg font-semibold tracking-[-0.02em] text-sidebar-foreground">
          Totum OS
        </span>
      </div>

      {/* ⌘K Search */}
      <div className="px-3 pt-3 pb-1 shrink-0">
        <button
          onClick={() =>
            window.dispatchEvent(
              new KeyboardEvent("keydown", { key: "k", metaKey: true, bubbles: true })
            )
          }
          className="flex w-full items-center gap-2 rounded-full border border-sidebar-border/80 bg-sidebar-accent/50 px-3 py-2 text-sidebar-foreground/45 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground"
        >
          <Search className="w-3.5 h-3.5 shrink-0" />
          <span className="text-[12px] flex-1 text-left">Buscar no Totum OS...</span>
          <kbd className="rounded-full border border-sidebar-border px-2 py-0.5 text-[10px] opacity-40">⌘K</kbd>
        </button>
      </div>

      {/* Navigation */}
      <SidebarNavigation pendingApprovals={pendingApprovals} onNavigate={handleNav} />

      {/* Footer */}
      <div className="shrink-0 border-t border-sidebar-border/70 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-primary/20 bg-primary/10 text-sm font-semibold uppercase text-primary">
            {user?.email?.[0] || "U"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[12px] font-medium text-sidebar-foreground truncate">
              {user?.email?.split("@")[0] || "User"}
            </p>
            <p className="text-[10px] text-sidebar-foreground/35 truncate">{user?.email || ""}</p>
          </div>
          <button
            onClick={handleLogout}
            className="p-1.5 hover:bg-sidebar-accent text-sidebar-foreground/40 hover:text-sidebar-foreground transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
