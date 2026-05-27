import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User } from "lucide-react";
import { STEPS } from "./NewClientUtilities";
import type { FormData } from "../hooks";

interface NewClientPreviewProps {
  form: FormData;
  step: number;
}

export function NewClientPreview({ form, step }: NewClientPreviewProps) {
  return (
    <div className="sticky top-24">
      <Card className="border-white/10 bg-[#0a0a0a]">
        <CardHeader className="pb-3">
          <CardTitle className="text-[14px] text-[#fafafa]">Preview do Cliente</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div
            className="w-16 h-16 rounded-[4px] mx-auto flex items-center justify-center border-2 border-dashed border-white/20"
            style={{ backgroundColor: (form.primary_color ?? "#171717") + "20" }}
          >
            {form.company_name ? (
              <span
                className="text-[28px] font-sans font-bold"
                style={{ color: form.primary_color ?? "#fafafa" }}
              >
                {form.company_name.charAt(0).toUpperCase()}
              </span>
            ) : (
              <User className="w-6 h-6 text-[#737373]" />
            )}
          </div>

          <div className="text-center">
            <p className="font-sans font-semibold text-[#fafafa] text-[14px]">
              {form.company_name || "Nome da Empresa"}
            </p>
            {form.industry && (
              <Badge
                variant="outline"
                className="text-[10px] mt-1 bg-[#171717] text-[#fafafa] border-white/10"
              >
                {form.industry}
              </Badge>
            )}
          </div>

          <div className="text-center">
            <Badge
              variant="outline"
              className="text-[10px] bg-[#171717] text-[#a3a3a3] border-white/5"
            >
              Criando...
            </Badge>
          </div>

          <div className="space-y-2 text-[12px]">
            {form.contact_name && (
              <div className="flex justify-between">
                <span className="text-[#a3a3a3]">Responsável</span>
                <span className="text-[#fafafa]">{form.contact_name}</span>
              </div>
            )}
            {form.email && (
              <div className="flex justify-between">
                <span className="text-[#a3a3a3]">Email</span>
                <span className="text-[#fafafa] truncate ml-2">
                  {form.email}
                </span>
              </div>
            )}
            {form.company_size && (
              <div className="flex justify-between">
                <span className="text-[#a3a3a3]">Porte</span>
                <span className="text-[#fafafa]">{form.company_size}</span>
              </div>
            )}
            {form.brand_tone && (
              <div className="flex justify-between">
                <span className="text-[#a3a3a3]">Tom</span>
                <span className="text-[#fafafa]">{form.brand_tone}</span>
              </div>
            )}
            {form.crm_used && (
              <div className="flex justify-between">
                <span className="text-[#a3a3a3]">CRM</span>
                <span className="text-[#fafafa]">{form.crm_used}</span>
              </div>
            )}
          </div>

          {(form.primary_color || form.secondary_color) && (
            <div className="flex gap-2 justify-center">
              <div
                className="w-8 h-8 rounded-[4px] border border-white/10"
                style={{ backgroundColor: form.primary_color }}
                title="Primária"
              />
              <div
                className="w-8 h-8 rounded-[4px] border border-white/10"
                style={{ backgroundColor: form.secondary_color }}
                title="Secundária"
              />
            </div>
          )}

          <div className="pt-2 border-t border-white/10">
            <p className="text-[10px] text-[#737373] text-center">
              Etapa {step + 1} de 5
            </p>
            <div className="flex gap-1 mt-1">
              {STEPS.map((_, i) => (
                <div
                  key={i}
                  className={`flex-1 h-1 rounded-full transition-colors ${
                    i <= step ? "bg-[#ffffff]" : "bg-[#262626]"
                  }`}
                />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
