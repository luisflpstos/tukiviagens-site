/**
 * Lead Tracker same-origin (fork em /public/kortex-lead-tracker.js).
 * Usa proxy `/api/kortex` — o script upstream faz sendBeacon com credentials:include
 * contra o BFF que responde Access-Control-Allow-Origin: *.
 */
export const LEAD_TRACKER_SRC = '/kortex-lead-tracker.js';

/** Project key do Lead Tracker para páginas com formulário de contato. */
export const LEAD_TRACKER_PROJECT_KEY = 'f82b922f-91a1-4586-8447-b4944ecfd694';

/**
 * Base same-origin usada em `data-api-base` do lead-tracker.js.
 * O script faz sendBeacon (credentials:include); o BFF responde ACAO:* — CORS bloqueia.
 */
export const LEAD_TRACKER_API_BASE = '/api/kortex';

/** Base upstream do BFF Kortex (somente servidor / proxy). */
export const LEAD_TRACKER_UPSTREAM_API_BASE = 'https://bff.kortex.app.br/api/v1';

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
	return process.env.LEAD_WEBHOOK_URL ?? import.meta.env.LEAD_WEBHOOK_URL;
}

/** Segredo opcional enviado ao webhook como Bearer token. */
export function getLeadWebhookSecret(): string | undefined {
	return process.env.LEAD_WEBHOOK_SECRET ?? import.meta.env.LEAD_WEBHOOK_SECRET;
}
