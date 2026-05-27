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
      <Card className="cursor-pointer group" onClick={() => onDetail(client)}>
        <CardContent className="p-5">
          <div className="flex items-start justify-between mb-3">
            <div
              className="w-12 h-12 border border-white/10 flex items-center justify-center text-lg font-bold"
              style={{
                backgroundColor: (client.primary_color ?? "#737373") + "20",
                color: client.primary_color ?? "#fafafa",
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
          <h3 className="font-medium text-[#fafafa] mb-1">{client.company_name}</h3>
          <p className="text-[12px] text-[#a3a3a3] mb-3">{client.cnpj ?? "—"}</p>

          <div className="space-y-2 mb-4">
            {client.contact_name && (
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-[#262626] border border-white/10 flex items-center justify-center">
                  <span className="text-[10px] font-bold text-[#fafafa]">
                    {client.contact_name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="text-[10px] text-[#a3a3a3]">
                  {client.contact_name}
                </span>
              </div>
            )}
            {client.email && (
              <div className="flex items-center gap-2 text-[10px] text-[#737373]">
                <Mail className="w-3.5 h-3.5" />
                <span className="truncate">{client.email}</span>
              </div>
            )}
            {client.phone && (
              <div className="flex items-center gap-2 text-[10px] text-[#737373]">
                <Phone className="w-3.5 h-3.5" />
                <span>{client.phone}</span>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-white/5">
            <div className="flex gap-2">
              <Badge
                variant="outline"
                className={`text-[10px] capitalize border-white/10 ${STATUS_BADGE[client.status]}`}
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
                  className={`text-[10px] border-white/10 ${INDUSTRY_COLORS[client.industry] ?? "bg-[#171717] text-[#a3a3a3]"}`}
                >
                  {client.industry}
                </Badge>
              )}
            </div>
            <span className="text-[10px] text-[#a3a3a3]">
              {timeAgo(client.created_at)}
            </span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
