import { supabase } from "@/integrations/supabase/client";
import { notifyNewUserPending } from "@/lib/telegram";

export type ApprovalStatus = "pending" | "approved" | "rejected" | null;

export interface ApprovalRecord {
  id?: string;
  user_id: string;
  email: string | null;
  name: string | null;
  status: Exclude<ApprovalStatus, null>;
  provider: string | null;
  created_at?: string | null;
  approved_at?: string | null;
  approved_by?: string | null;
  rejection_reason?: string | null;
}

export interface ApprovalGuardError extends Error {
  approvalStatus?: Exclude<ApprovalStatus, null>;
  userEmail?: string;
}

type ApprovalQueryResult<T> = {
  data: T | null;
  error: { message?: string } | null;
};

function getApprovalTable() {
  return (supabase as unknown as {
    from: (table: string) => {
      select: (columns: string) => {
        eq: (column: string, value: string) => {
          maybeSingle: () => Promise<ApprovalQueryResult<ApprovalRecord>>;
        };
      };
      insert: (
        values: Partial<ApprovalRecord> | Array<Partial<ApprovalRecord>>,
      ) => Promise<ApprovalQueryResult<ApprovalRecord>>;
      update: (values: Partial<ApprovalRecord>) => {
        eq: (column: string, value: string) => Promise<ApprovalQueryResult<ApprovalRecord>>;
      };
    };
  }).from("user_approvals");
}

export async function fetchApprovalRecord(userId: string): Promise<ApprovalRecord | null> {
  const { data, error } = await getApprovalTable()
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    throw new Error(error.message || "Falha ao consultar aprovação do usuário.");
  }

  return data;
}

export async function fetchApprovalStatus(userId: string): Promise<ApprovalStatus> {
  const record = await fetchApprovalRecord(userId);
  return record?.status ?? null;
}

export async function createPendingApprovalRecord(params: {
  userId: string;
  email: string | null;
  name?: string | null;
  provider: string;
}): Promise<void> {
  const { error } = await getApprovalTable().insert({
    user_id: params.userId,
    email: params.email,
    name: params.name ?? null,
    status: "pending",
    provider: params.provider,
  });

  if (error) {
    throw new Error(error.message || "Falha ao criar registro de aprovação pendente.");
  }
}

export async function notifyPendingApproval(params: {
  email: string | null;
  name?: string | null;
  provider: string;
}): Promise<void> {
  if (!params.email) return;

  try {
    await notifyNewUserPending(params.email, params.name ?? undefined, params.provider);
  } catch (error) {
    console.warn("[AuthApproval] Falha ao notificar novo usuário pendente:", error);
  }
}

export function buildApprovalGuardError(
  status: Exclude<ApprovalStatus, null>,
  email?: string,
): ApprovalGuardError {
  const message =
    status === "pending"
      ? "Seu cadastro ainda está aguardando aprovação do administrador. Você será notificado quando o acesso for liberado."
      : "Seu cadastro foi rejeitado. Entre em contato com o administrador para mais informações.";

  const error = new Error(message) as ApprovalGuardError;
  error.approvalStatus = status;
  error.userEmail = email;
  return error;
}
