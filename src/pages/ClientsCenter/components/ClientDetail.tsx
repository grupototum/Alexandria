import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Building2, Mail, Phone, Globe, User, DollarSign } from "lucide-react";
import { InfoRow } from "./ClientUtilities";
import type { Client } from "../hooks";

interface ClientDetailProps {
  client: Client | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit?: (client: Client) => void;
}

export function ClientDetail({
  client,
  open,
  onOpenChange,
  onEdit,
}: ClientDetailProps) {
  if (!client) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start gap-4 mb-4">
            <div
              className="w-16 h-16 rounded-[4px] border border-white/10 flex items-center justify-center text-2xl font-bold shrink-0"
              style={{
                backgroundColor: (client.primary_color ?? "#f76926") + "20",
                color: client.primary_color ?? "#f76926",
              }}
            >
              {client.company_name.charAt(0)}
            </div>
            <div className="flex-1">
              <DialogTitle className="text-[20px] font-medium text-[#fafafa]">
                {client.company_name}
              </DialogTitle>
              <p className="text-[13px] text-[#a3a3a3] mt-1">
                {client.cnpj ?? "CNPJ não informado"}
              </p>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Contact Info */}
          <div className="space-y-3">
            <h3 className="text-[14px] font-medium text-[#fafafa]">
              Informações de Contato
            </h3>
            <div className="space-y-2">
              {client.contact_name && (
                <InfoRow
                  icon={User}
                  label="Responsável"
                  value={client.contact_name}
                />
              )}
              {client.email && (
                <InfoRow icon={Mail} label="Email" value={client.email} />
              )}
              {client.phone && (
                <InfoRow icon={Phone} label="Telefone" value={client.phone} />
              )}
              {client.website && (
                <InfoRow icon={Globe} label="Website" value={client.website} />
              )}
            </div>
          </div>

          {/* Business Info */}
          <div className="space-y-3">
            <h3 className="text-[14px] font-medium text-[#fafafa]">
              Informações da Empresa
            </h3>
            <div className="space-y-2">
              {client.industry && (
                <InfoRow
                  icon={Building2}
                  label="Ramo"
                  value={client.industry}
                />
              )}
              {client.company_size && (
                <InfoRow
                  icon={User}
                  label="Tamanho"
                  value={client.company_size}
                />
              )}
              {client.monthly_revenue && (
                <InfoRow
                  icon={DollarSign}
                  label="Faturamento Mensal"
                  value={client.monthly_revenue}
                />
              )}
            </div>
          </div>

          {/* Description */}
          {client.business_description && (
            <div className="space-y-2">
              <h3 className="text-[14px] font-medium text-[#fafafa]">
                Descrição
              </h3>
              <p className="text-[13px] text-[#a3a3a3] leading-relaxed">
                {client.business_description}
              </p>
            </div>
          )}

          {/* Additional Info */}
          <div className="space-y-3">
            <h3 className="text-[14px] font-medium text-[#fafafa]">
              Configurações
            </h3>
            <div className="space-y-2">
              {client.brand_tone && (
                <div className="text-[12px]">
                  <p className="text-[#737373] font-medium">Tom de Voz</p>
                  <p className="text-[#fafafa]">{client.brand_tone}</p>
                </div>
              )}
              {client.crm_used && (
                <div className="text-[12px]">
                  <p className="text-[#737373] font-medium">CRM Utilizado</p>
                  <p className="text-[#fafafa]">{client.crm_used}</p>
                </div>
              )}
              {client.sla_response && (
                <div className="text-[12px]">
                  <p className="text-[#737373] font-medium">SLA de Resposta</p>
                  <p className="text-[#fafafa]">{client.sla_response}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <DialogFooter className="mt-6">
          {onEdit && (
            <Button
              onClick={() => onEdit(client)}
              className="bg-[#ffffff] text-[#0a0a0a] hover:bg-[#e5e5e5]"
            >
              Editar Cliente
            </Button>
          )}
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
