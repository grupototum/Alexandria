import type * as React from "react";
import type { LucideIcon } from "lucide-react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface PageHeaderProps extends React.HTMLAttributes<HTMLElement> {
  eyebrow?: string;
  title: string;
  description?: string;
  icon?: LucideIcon;
  actions?: React.ReactNode;
}

export function PageHeader({
  eyebrow,
  title,
  description,
  icon: Icon,
  actions,
  className,
  ...props
}: PageHeaderProps) {
  return (
    <header
      className={cn(
        "relative overflow-hidden px-2 py-4 sm:px-4 sm:py-6",
        className
      )}
      {...props}
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 items-start gap-4">
          {Icon && (
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-[4px] border border-white/10 bg-[#171717] text-[#fafafa]">
              <Icon className="h-5 w-5" />
            </div>
          )}
          <div className="min-w-0">
            {eyebrow && (
              <p className="mb-2 text-[11px] font-medium tracking-[0.04em] uppercase text-[#a3a3a3]">
                {eyebrow}
              </p>
            )}
            <h1 className="max-w-4xl text-[48px] font-medium leading-[1.1] tracking-[-0.03em] text-[#fafafa] sm:text-[64px]">
              {title}
            </h1>
            {description && (
              <p className="mt-3 max-w-3xl text-[18px] font-normal leading-[1.5] tracking-[-0.005em] text-[#a3a3a3]">
                {description}
              </p>
            )}
          </div>
        </div>
        {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
      </div>
    </header>
  );
}

export function SectionHeader({
  title,
  action,
  className,
}: {
  title: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mb-4 flex items-center justify-between gap-3", className)}>
      <h2 className="text-[20px] font-medium leading-[1.3] tracking-[-0.01em] text-[#fafafa]">
        {title}
      </h2>
      {action}
    </div>
  );
}

export function MetricCard({
  label,
  value,
  description,
  icon: Icon,
  tone = "primary",
}: {
  label: string;
  value: React.ReactNode;
  description?: string;
  icon?: LucideIcon;
  tone?: "primary" | "emerald" | "amber" | "sky" | "violet";
}) {
  // Em Krea, as cores de data-viz (tones) são estritas e apenas o foreground muda, 
  // não pintamos o background do card
  const toneColor = {
    primary: "text-[#ffffff]",
    emerald: "text-emerald-400",
    amber: "text-amber-400",
    sky: "text-blue-400",
    violet: "text-violet-400",
  }[tone];

  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-5">
        {Icon && (
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-[4px] border border-white/10 bg-[#171717]">
            <Icon className={cn("h-5 w-5", toneColor)} />
          </div>
        )}
        <div className="min-w-0">
          <p className="text-[12px] tracking-[-0.01em] text-[#a3a3a3]">
            {label}
          </p>
          <p className="mt-1 text-3xl font-medium tracking-[-0.03em] text-[#fafafa]">{value}</p>
          {description && <p className="mt-1 truncate text-[13px] text-[#737373]">{description}</p>}
        </div>
      </CardContent>
    </Card>
  );
}

export function DataPanel({
  title,
  children,
  className,
}: {
  title?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Card className={className}>
      <CardContent className="p-5">
        {title && <SectionHeader title={title} />}
        {children}
      </CardContent>
    </Card>
  );
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
}: {
  icon?: LucideIcon;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <Card className="border border-white/5 bg-transparent">
      <CardContent className="flex flex-col items-center justify-center px-6 py-12 text-center">
        {Icon && (
          <div className="mb-4 grid h-14 w-14 place-items-center rounded-[4px] border border-white/10 bg-[#171717] text-[#a3a3a3]">
            <Icon className="h-6 w-6" />
          </div>
        )}
        <p className="text-[16px] font-medium text-[#fafafa]">{title}</p>
        {description && <p className="mt-2 max-w-md text-[14px] text-[#a3a3a3]">{description}</p>}
        {actionLabel && onAction && (
          <Button className="mt-5" onClick={onAction}>
            {actionLabel}
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

export function Toolbar({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-[14px] border border-white/10 bg-[#171717] p-3 shadow-[0_4px_12px_rgba(0,0,0,0.1)] sm:flex-row sm:items-center sm:justify-between",
        className
      )}
      {...props}
    />
  );
}
