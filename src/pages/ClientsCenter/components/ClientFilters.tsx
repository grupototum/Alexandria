import { motion } from "framer-motion";
import { Search, LayoutGrid, List, Columns3, Download, Mail } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Toolbar } from "@/components/ui/patterns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { anim } from "./ClientUtilities";
import type { ViewMode } from "../hooks";

interface ClientFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusChange: (value: string) => void;
  industryFilter: string;
  onIndustryChange: (value: string) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  industries: string[];
  selectedCount: number;
  onExport?: () => void;
  onMessage?: () => void;
}

export function ClientFilters({
  search,
  onSearchChange,
  statusFilter,
  onStatusChange,
  industryFilter,
  onIndustryChange,
  viewMode,
  onViewModeChange,
  industries,
  selectedCount,
  onExport,
  onMessage,
}: ClientFiltersProps) {
  return (
    <>
      <motion.div {...anim(1)}>
        <Toolbar>
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Buscar por nome, CNPJ ou responsável..."
                className="pl-9 input-n8n h-9 text-[13px]"
              />
            </div>
            <div className="flex gap-2 flex-wrap items-center">
              <Select value={statusFilter} onValueChange={onStatusChange}>
                <SelectTrigger className="input-n8n h-9 w-32 text-[12px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#1b1728] border-[#1f192a] text-foreground rounded-lg">
                  <SelectItem value="all" className="hover:bg-[#272333] focus:bg-[#272333]">Todos</SelectItem>
                  <SelectItem value="active" className="hover:bg-[#272333] focus:bg-[#272333]">Ativos</SelectItem>
                  <SelectItem value="pending" className="hover:bg-[#272333] focus:bg-[#272333]">Pendentes</SelectItem>
                  <SelectItem value="inactive" className="hover:bg-[#272333] focus:bg-[#272333]">Inativos</SelectItem>
                </SelectContent>
              </Select>
              <Select value={industryFilter} onValueChange={onIndustryChange}>
                <SelectTrigger className="input-n8n h-9 w-36 text-[12px]">
                  <SelectValue placeholder="Ramo" />
                </SelectTrigger>
                <SelectContent className="bg-[#1b1728] border-[#1f192a] text-foreground rounded-lg">
                  <SelectItem value="all" className="hover:bg-[#272333] focus:bg-[#272333]">Todos os Ramos</SelectItem>
                  {industries.map((i) => (
                    <SelectItem key={i} value={i} className="hover:bg-[#272333] focus:bg-[#272333]">
                      {i}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex border border-[#1f192a] overflow-hidden rounded-lg">
                {(
                  [
                    ["list", List],
                    ["grid", LayoutGrid],
                    ["kanban", Columns3],
                  ] as [ViewMode, typeof List][]
                ).map(([mode, Icon]) => (
                  <button
                    key={mode}
                    onClick={() => onViewModeChange(mode)}
                    className={`p-2 transition-colors ${
                      viewMode === mode
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground bg-[#1b1728]"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </button>
                ))}
              </div>
            </div>
        </Toolbar>
      </motion.div>

      {/* Batch actions */}
      {selectedCount > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3"
        >
          <span className="text-[12px] text-muted-foreground">
            {selectedCount} selecionado(s)
          </span>
          {onExport && (
            <Button
              variant="secondary"
              size="sm"
              className="text-[12px]"
              onClick={onExport}
            >
              <Download className="w-3 h-3 mr-1" /> Exportar
            </Button>
          )}
          {onMessage && (
            <Button
              variant="secondary"
              size="sm"
              className="text-[12px]"
              onClick={onMessage}
            >
              <Mail className="w-3 h-3 mr-1" /> Mensagem
            </Button>
          )}
        </motion.div>
      )}
    </>
  );
}
