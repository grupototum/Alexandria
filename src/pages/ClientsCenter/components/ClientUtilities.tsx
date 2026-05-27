import { User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Eye, Pencil, Trash2 } from "lucide-react";
import type { Client } from "../hooks";

/**
 * Time ago helper
 */
export function timeAgo(dateStr: string | null): string {
  if (!dateStr) return "—";
  const diff = Date.now() - new Date(dateStr).getTime();
  const h = Math.floor(diff / 3600000);
  if (h < 1) return "agora";
  if (h < 24) return `${h}h atrás`;
  const d = Math.floor(h / 24);
  return `${d}d atrás`;
}

/**
 * Status badge styling
 */
export const STATUS_BADGE: Record<string, string> = {
  active: "bg-primary text-primary-foreground",
  pending: "bg-[#272333] text-foreground",
  inactive: "bg-[#1b1728] text-muted-foreground",
};

/**
 * Industry color styling
 */
export const INDUSTRY_COLORS: Record<string, string> = {
  Tecnologia: "bg-[#1b1728] text-foreground",
  Saúde: "bg-[#1b1728] text-foreground",
  Educação: "bg-[#1b1728] text-foreground",
  "E-commerce": "bg-[#1b1728] text-foreground",
  Serviços: "bg-[#1b1728] text-foreground",
};

/**
 * Animation helper
 */
export const anim = (i: number) => ({
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { delay: i * 0.04, duration: 0.3 },
});

/**
 * Info row component for detail view
 */
export function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <Icon className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
      <div className="flex-1">
        <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
          {label}
        </p>
        <p className="text-[13px] text-foreground font-medium">{value}</p>
      </div>
    </div>
  );
}

/**
 * Client actions dropdown menu
 */
export function ClientActions({
  client,
  onDelete,
  onStatusChange,
  onView,
}: {
  client: Client;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: string) => void;
  onView: () => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-[#272333]"
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-[#1b1728] border-[#1f192a] text-foreground rounded-lg">
        <DropdownMenuItem onClick={onView} className="gap-2 hover:bg-[#272333] focus:bg-[#272333]">
          <Eye className="h-3.5 w-3.5" />
          Visualizar
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            const newStatus =
              client.status === "active"
                ? "inactive"
                : client.status === "inactive"
                  ? "pending"
                  : "active";
            onStatusChange(client.id, newStatus);
          }}
          className="gap-2 hover:bg-[#272333] focus:bg-[#272333]"
        >
          <Pencil className="h-3.5 w-3.5" />
          Alterar Status
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => onDelete(client.id)}
          className="gap-2 text-destructive hover:bg-[#272333] focus:bg-[#272333]"
        >
          <Trash2 className="h-3.5 w-3.5" />
          Remover
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
