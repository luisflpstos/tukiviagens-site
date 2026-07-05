/** Tamanho máximo permitido para campos de texto do formulário de lead. */
export const LEAD_FIELD_MAX_LENGTH = 120;

/** Limites do seletor de hóspedes. */
export const MAX_ADULTS = 7;
export const MAX_CHILDREN = 4;

/**
 * Endpoint externo que recebe os leads (somente servidor).
 * Configure `LEAD_WEBHOOK_URL` no painel da Vercel ou em `.env`.
 */
export function getLeadWebhookUrl(): string | undefined {
	return import.meta.env.LEAD_WEBHOOK_URL;
}

/** Segredo opcional enviado ao webhook como Bearer token. */
export function getLeadWebhookSecret(): string | undefined {
	return import.meta.env.LEAD_WEBHOOK_SECRET;
}
