/** Script público oficial do Kortex Lead Tracker (páginas com formulário). */
export const LEAD_TRACKER_SRC =
	'https://bff.kortex.app.br/api/v1/public/lead-tracker.js';

/** Project key do Lead Tracker para páginas com formulário de contato. */
export const LEAD_TRACKER_PROJECT_KEY = 'f82b922f-91a1-4586-8447-b4944ecfd694';

/** Tamanho máximo permitido para campos de texto do formulário de lead. */
export const LEAD_FIELD_MAX_LENGTH = 120;

/** Limites do seletor de hóspedes. */
export const MAX_ADULTS = 7;
export const MAX_CHILDREN = 4;

/**
 * Webhook servidor→servidor (WhatsApp click / fallback).
 * Formulários de contato NÃO usam este endpoint — só o Kortex lead-tracker.js.
 */
export function getLeadWebhookUrl(): string | undefined {
	return process.env.LEAD_WEBHOOK_URL ?? import.meta.env.LEAD_WEBHOOK_URL;
}

/** Segredo opcional enviado ao webhook WhatsApp como Bearer token. */
export function getLeadWebhookSecret(): string | undefined {
	return process.env.LEAD_WEBHOOK_SECRET ?? import.meta.env.LEAD_WEBHOOK_SECRET;
}
