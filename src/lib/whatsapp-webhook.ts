import { z } from 'zod';
import type { WhatsAppClickPayload } from './whatsapp';
import { getLeadWebhookUrl } from './lead-config';

const field = z.string().max(512);
const pageUrl = z.string().max(2048);

/** Schema do payload de clique WhatsApp enviado pelo browser ao proxy. */
export const whatsappClickPayloadSchema = z
	.object({
		event: z.literal('whatsapp_click'),
		source: field,
		h1: field,
		utm_source: field,
		utm_medium: field,
		utm_campaign: field,
		utm_content: field,
		utm_term: field,
		gclid: field,
		gbraid: field,
		wbraid: field,
		fbclid: field,
		page_url: pageUrl,
		page_title: field,
		referrer: pageUrl,
		horario_local: field,
		timestamp_iso: field,
		user_agent: z.string().max(1024),
		product: field.optional(),
		campaign: field.optional(),
		button_label: field.optional(),
	})
	.strict();

export type WhatsAppWebhookEnv = {
	whatsappWebhookUrl?: string;
	publicWhatsappWebhookUrl?: string;
	leadWebhookUrl?: string;
};

/**
 * Resolve a URL do webhook de WhatsApp (somente servidor).
 * Ordem: WHATSAPP_WEBHOOK_URL → PUBLIC_WHATSAPP_WEBHOOK_URL → LEAD_WEBHOOK_URL.
 */
export function resolveWhatsAppWebhookUrl(env: WhatsAppWebhookEnv): string | undefined {
	return (
		env.whatsappWebhookUrl?.trim() ||
		env.publicWhatsappWebhookUrl?.trim() ||
		env.leadWebhookUrl?.trim() ||
		undefined
	);
}

/** Lê a URL do webhook a partir das variáveis de ambiente do servidor. */
export function getWhatsAppWebhookUrl(): string | undefined {
	return resolveWhatsAppWebhookUrl({
		whatsappWebhookUrl:
			process.env.WHATSAPP_WEBHOOK_URL ?? import.meta.env.WHATSAPP_WEBHOOK_URL,
		publicWhatsappWebhookUrl:
			process.env.PUBLIC_WHATSAPP_WEBHOOK_URL ?? import.meta.env.PUBLIC_WHATSAPP_WEBHOOK_URL,
		leadWebhookUrl: getLeadWebhookUrl(),
	});
}

export type ForwardWhatsAppClickInput = {
	webhookUrl: string;
	secret?: string;
	payload: unknown;
	fetchImpl?: typeof fetch;
	timeoutMs?: number;
};

export type ForwardWhatsAppClickResult =
	| { ok: true }
	| { ok: false; status?: number; error?: string };

export const WHATSAPP_CLICK_MAX_BODY_BYTES = 8_192;

/**
 * Encaminha o payload de clique WhatsApp ao webhook externo (server→server).
 * Evita CORS no browser: o cliente só fala com a API same-origin.
 */
export async function forwardWhatsAppClickPayload(
	input: ForwardWhatsAppClickInput,
): Promise<ForwardWhatsAppClickResult> {
	const fetchImpl = input.fetchImpl ?? fetch;
	const headers: Record<string, string> = {
		'Content-Type': 'application/json',
		'User-Agent': 'TukiViagens-WhatsAppProxy/1.0',
	};

	if (input.secret) {
		headers.Authorization = `Bearer ${input.secret}`;
	}

	try {
		const upstream = await fetchImpl(input.webhookUrl, {
			method: 'POST',
			headers,
			body: JSON.stringify(input.payload),
			signal: AbortSignal.timeout(input.timeoutMs ?? 12_000),
		});

		if (!upstream.ok) {
			return { ok: false, status: upstream.status };
		}

		return { ok: true };
	} catch (error) {
		return {
			ok: false,
			error: error instanceof Error ? error.message : 'forward_failed',
		};
	}
}

export type HandleWhatsAppClickInput = {
	contentType: string;
	rawBody: string;
	webhookUrl?: string;
	secret?: string;
	maxBodyBytes?: number;
	forward?: typeof forwardWhatsAppClickPayload;
};

export type HandleWhatsAppClickOutput = {
	status: number;
	body: Record<string, unknown>;
};

/**
 * Orquestra validação + encaminhamento do clique WhatsApp (sem HTTP/Astro).
 */
export async function handleWhatsAppClickRequest(
	input: HandleWhatsAppClickInput,
): Promise<HandleWhatsAppClickOutput> {
	if (!input.contentType.includes('application/json')) {
		return { status: 415, body: { ok: false, error: 'Formato inválido.' } };
	}

	const maxBytes = input.maxBodyBytes ?? WHATSAPP_CLICK_MAX_BODY_BYTES;
	if (input.rawBody.length > maxBytes) {
		return { status: 413, body: { ok: false, error: 'Requisição muito grande.' } };
	}

	let parsed: unknown;
	try {
		parsed = JSON.parse(input.rawBody);
	} catch {
		return { status: 400, body: { ok: false, error: 'JSON inválido.' } };
	}

	const result = whatsappClickPayloadSchema.safeParse(parsed);
	if (!result.success) {
		return { status: 400, body: { ok: false, error: 'Payload inválido.' } };
	}

	if (!input.webhookUrl) {
		return {
			status: 503,
			body: { ok: false, error: 'Serviço temporariamente indisponível.' },
		};
	}

	const forward = input.forward ?? forwardWhatsAppClickPayload;
	const upstream = await forward({
		webhookUrl: input.webhookUrl,
		secret: input.secret,
		payload: result.data,
	});

	if (!upstream.ok) {
		return { status: 502, body: { ok: false, error: 'Não foi possível enviar agora.' } };
	}

	return { status: 200, body: { ok: true } };
}

export type { WhatsAppClickPayload };
