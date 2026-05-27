import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { motion } from "framer-motion";
import { User } from "lucide-react";
import {
  ClientActions,
  STATUS_BADGE,
  INDUSTRY_COLORS,
  anim,
  timeAgo,
} from "./ClientUtilities";
import type { Client } from "../hooks";

interface ClientListViewProps {
  clients: Client[];
  selected: Set<string>;
  onToggleSelect: (id: string) => void;
  onToggleAll: () => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: string) => void;
  onDetail: (client: Client) => void;
}

export function ClientListView({
  clients,
  selected,
  onToggleSelect,
  onToggleAll,
  onDelete,
  onStatusChange,
  onDetail,
}: ClientListViewProps) {
  return (
    <motion.div {...anim(2)}>
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                <th className="p-3 text-left w-8">
                  <Checkbox
                    checked={selected.size === clients.length && clients.length > 0}
                    onCheckedChange={onToggleAll}
                  />
                </th>
                <th className="p-3 text-left text-[10px] text-[#a3a3a3] uppercase font-medium">
                  Empresa
                </th>
                <th className="p-3 text-left text-[10px] text-[#a3a3a3] uppercase font-medium hidden md:table-cell">
                  Responsável
                </th>
                <th className="p-3 text-left text-[10px] text-[#a3a3a3] uppercase font-medium hidden lg:table-cell">
                  Ramo
                </th>
                <th className="p-3 text-left text-[10px] text-[#a3a3a3] uppercase font-medium">
                  Status
                </th>
                <th className="p-3 text-left text-[10px] text-[#a3a3a3] uppercase font-medium hidden lg:table-cell">
                  Cadastro
                </th>
                <th className="p-3 w-10"></th>
              </tr>
            </thead>
            <tbody>
              {clients.map((c) => (
                <tr
                  key={c.id}
                  className="border-b border-white/5 hover:bg-[#262626] transition-colors cursor-pointer"
                  onClick={() => onDetail(c)}
                >
                  <td className="p-3" onClick={(e) => e.stopPropagation()}>
                    <Checkbox
                      checked={selected.has(c.id)}
                      onCheckedChange={() => onToggleSelect(c.id)}
                    />
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-9 h-9 rounded-[4px] flex items-center justify-center text-[12px] font-bold shrink-0 border border-white/10"
                        style={{
                          backgroundColor: (c.primary_color ?? "#737373") + "20",
                          color: c.primary_color ?? "#fafafa",
                        }}
                      >
                        {c.company_name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-[#fafafa] text-[13px]">
                          {c.company_name}
                        </p>
                        <p className="text-[11px] text-[#a3a3a3]">
                          {c.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="p-3 hidden md:table-cell">
                    <div className="flex items-center gap-2">
                      <User className="w-3 h-3 text-[#737373]" />
                      <span className="text-[#fafafa] text-[12px]">
                        {c.contact_name ?? "—"}
                      </span>
                    </div>
                  </td>
                  <td className="p-3 hidden lg:table-cell">
                    {c.industry && (
                      <Badge
                        variant="outline"
                        className={`text-[10px] border-white/10 ${
                          INDUSTRY_COLORS[c.industry] ??
                          "bg-[#171717] text-[#a3a3a3]"
                        }`}
                      >
                        {c.industry}
                      </Badge>
                    )}
                  </td>
                  <td className="p-3">
                    <Badge
                      variant="outline"
                      className={`text-[10px] capitalize border-white/10 ${STATUS_BADGE[c.status]}`}
                    >
                      {c.status === "active"
                        ? "Ativo"
                        : c.status === "pending"
                          ? "Pendente"
                          : "Inativo"}
                    </Badge>
                  </td>
                  <td className="p-3 hidden lg:table-cell text-[12px] text-[#a3a3a3]">
                    {timeAgo(c.created_at)}
                  </td>
                  <td className="p-3" onClick={(e) => e.stopPropagation()}>
                    <ClientActions
                      client={c}
                      onDelete={onDelete}
                      onStatusChange={onStatusChange}
                      onView={() => onDetail(c)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </motion.div>
  );
}
