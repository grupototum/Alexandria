/**
 * Telegram notification utilities
 * Uses VITE_TELEGRAM_BOT_TOKEN + VITE_TELEGRAM_ADMIN_CHAT_ID env vars
 */
import {
  isTelegramConfigured,
  sendTelegramMessage as sendTelegramPayload,
} from "@/services/telegramService";

const ADMIN_CHAT_ID = import.meta.env.VITE_TELEGRAM_ADMIN_CHAT_ID || '';

/** Sends a raw Markdown message to the admin chat */
export async function sendTelegramMessage(text: string): Promise<boolean> {
  if (!isTelegramConfigured() || !ADMIN_CHAT_ID) {
    console.warn('[Telegram] VITE_TELEGRAM_BOT_TOKEN ou VITE_TELEGRAM_ADMIN_CHAT_ID não configurados.');
    return false;
  }

  return sendTelegramPayload({
    chat_id: ADMIN_CHAT_ID,
    text,
    parse_mode: 'Markdown',
  });
}

/** Notifies the admin that a new user is pending approval */
export async function notifyNewUserPending(
  email: string,
  name?: string,
  provider: string = 'email'
): Promise<boolean> {
  const providerLabel = provider === 'google' ? 'Google OAuth' : 'Email/Senha';
  const text =
    `🔔 *Novo cadastro aguardando aprovação*\n\n` +
    `👤 Nome: ${name || '_Não informado_'}\n` +
    `📧 Email: ${email}\n` +
    `🔑 Método: ${providerLabel}\n` +
    `🕐 Data: ${new Date().toLocaleString('pt-BR')}\n\n` +
    `👉 Aprovar em: https://apps.grupototum.com/admin/approvals`;
  return sendTelegramMessage(text);
}
