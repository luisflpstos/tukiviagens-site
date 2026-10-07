import { z } from 'zod';
import type { WhatsAppClickPayload } from './whatsapp';
import { getLeadWebhookUrl } from './lead-config';
import { isSiteUrl } from './lead-security';
import { httpUrlOrEmpty, isHttpUrl, plainText, printableText, tokenString } from './safe-fields';

const text = plainText(512);
const clickId = tokenString(512);

/**
 * Schema do payload de clique WhatsApp enviado pelo browser ao proxy.
 * Campos de texto não aceitam links nem caracteres de controle: o conteúdo chega ao CRM.
 */
export const whatsappClickPayloadSchema = z
	.object({
		event: z.literal('whatsapp_click'),
		source: text,
		h1: text,
		utm_source: text,
		utm_medium: text,
		utm_campaign: text,
		utm_content: text,
		utm_term: text,
		gclid: clickId,
		gbraid: clickId,
		wbraid: clickId,
		fbclid: clickId,
		page_url: z.string().max(2048).refine(isHttpUrl, 'URL inválida.'),
		page_title: text,
		referrer: httpUrlOrEmpty(2048),
		horario_local: z.string().max(32).regex(/^[\d/: ]*$/),
		timestamp_iso: z.string().max(40).regex(/^[\dTZ:.+-]*$/),
		user_agent: printableText(1024),
		product: text.optional(),
		campaign: text.optional(),
		button_label: text.optional(),
	})
	.strict();

export type WhatsAppWebhookEnv = {
	whatsappWebhookUrl?: string;
	publicWhatsappWebhookUrl?: string;
	leadWebhookUrl?: string;
};

/**
 * Resolve a URL do webhook de WhatsApp (somente servidor).
 * Ordem: WHATSAPP_WEBHOOK_URL → PUBLIC_WHATSAPP_WEBHOOK_URL (legado) → LEAD_WEBHOOK_URL.
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
		// Legado: lido só em runtime via process.env para nunca ser embutido em bundles.
		// Migre o valor para WHATSAPP_WEBHOOK_URL na Vercel.
		publicWhatsappWebhookUrl: process.env.PUBLIC_WHATSAPP_WEBHOOK_URL,
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
	/** Valida que `page_url` é do próprio site (padrão: origens de `getAllowedOrigins`). */
	isAllowedPageUrl?: (url: string) => boolean;
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
	const isAllowedPageUrl = input.isAllowedPageUrl ?? ((url: string) => isSiteUrl(url));
	if (!result.success || !isAllowedPageUrl(result.data.page_url)) {
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
