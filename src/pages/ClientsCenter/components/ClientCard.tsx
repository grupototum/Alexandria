import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import {
  Mail,
  ChevronRight,
  Phone,
  Globe,
} from "lucide-react";
import { ClientActions, STATUS_BADGE, INDUSTRY_COLORS, anim, timeAgo } from "./ClientUtilities";
import type { Client } from "../hooks";

interface ClientCardProps {
  client: Client;
  index: number;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: string) => void;
  onDetail: (client: Client) => void;
}

export function ClientCard({
  client,
  index,
  onDelete,
  onStatusChange,
  onDetail,
}: ClientCardProps) {
  return (
    <motion.div key={client.id} layout {...anim(index + 2)} exit={{ opacity: 0, scale: 0.95 }}>
      <Card className="card-n8n cursor-pointer group" onClick={() => onDetail(client)}>
        <CardContent className="p-5">
          <div className="flex items-start justify-between mb-3">
            <div
              className="w-12 h-12 border border-[#1f192a] rounded-xl flex items-center justify-center text-lg font-bold"
              style={{
                backgroundColor: (client.primary_color ?? "#737373") + "20",
                color: client.primary_color ?? "var(--foreground)",
              }}
            >
              {client.company_name.charAt(0)}
            </div>
            <div onClick={(e) => e.stopPropagation()}>
              <ClientActions
                client={client}
                onDelete={onDelete}
                onStatusChange={onStatusChange}
                onView={() => onDetail(client)}
              />
            </div>
          </div>
          <h3 className="font-medium text-foreground mb-1">{client.company_name}</h3>
          <p className="text-[12px] text-muted-foreground mb-3">{client.cnpj ?? "—"}</p>

          <div className="space-y-2 mb-4">
            {client.contact_name && (
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-[#1b1728] border border-[#1f192a] rounded flex items-center justify-center">
                  <span className="text-[10px] font-bold text-foreground">
                    {client.contact_name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="text-[10px] text-muted-foreground">
                  {client.contact_name}
                </span>
              </div>
            )}
            {client.email && (
              <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                <Mail className="w-3.5 h-3.5" />
                <span className="truncate">{client.email}</span>
              </div>
            )}
            {client.phone && (
              <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                <Phone className="w-3.5 h-3.5" />
                <span>{client.phone}</span>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-[#1f192a]">
            <div className="flex gap-2">
              <Badge
                variant="outline"
                className={`text-[10px] capitalize border-[#1f192a] ${STATUS_BADGE[client.status]}`}
              >
                {client.status === "active"
                  ? "Ativo"
                  : client.status === "pending"
                    ? "Pendente"
                    : "Inativo"}
              </Badge>
              {client.industry && (
                <Badge
                  variant="outline"
                  className={`text-[10px] border-[#1f192a] ${INDUSTRY_COLORS[client.industry] ?? "bg-[#1b1728] text-muted-foreground"}`}
                >
                  {client.industry}
                </Badge>
              )}
            </div>
            <span className="text-[10px] text-muted-foreground">
              {timeAgo(client.created_at)}
            </span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
