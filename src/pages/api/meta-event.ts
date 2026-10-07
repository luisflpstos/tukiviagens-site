import type { APIRoute } from 'astro';
import { z } from 'zod';
import { isAllowedOrigin, isSiteUrl, jsonResponse } from '../../lib/lead-security';
import { extractClientIp, sendMetaEvent } from '../../lib/meta-capi';
import { isMetaCapiEnabled } from '../../lib/meta-config';
import { createRateLimiter } from '../../lib/rate-limit';
import { plainText, tokenString } from '../../lib/safe-fields';

export const prerender = false;

const MAX_BODY_BYTES = 8_192;

const rateLimit = createRateLimiter({ limit: 10, windowMs: 60_000 });

/**
 * Recebe eventos do browser (ex.: clique no WhatsApp) e os repassa à
 * API de Conversões da Meta com IP e user-agent do cliente para melhorar
 * a correspondência. Deduplicado com o Pixel via event_id.
 */
const metaEventSchema = z
	.object({
		event_name: z.enum(['Contact']),
		event_id: tokenString(120).min(1),
		event_source_url: z
			.string()
			.max(2048)
			.refine((value) => isSiteUrl(value), 'URL fora do site.')
			.optional(),
		// Cookies da Meta: _fbp = fb.{n}.{timestamp}.{random}; _fbc = fb.{n}.{timestamp}.{fbclid}[.extra]
		fbp: z
			.string()
			.max(120)
			.regex(/^fb\.\d\.\d+\.\d+$/)
			.optional(),
		fbc: z
			.string()
			.max(512)
			.regex(/^fb\.\d\.\d+\.[\w.-]+$/)
			.optional(),
		fbclid: tokenString(512).optional(),
		content_name: plainText(512).optional(),
	})
	.strict();

export const POST: APIRoute = async ({ request }) => {
	if (!isAllowedOrigin(request)) {
		return jsonResponse({ ok: false, error: 'Origem não permitida.' }, 403);
	}

	if (!isMetaCapiEnabled()) {
		return jsonResponse({ ok: true, skipped: true });
	}

	const rate = rateLimit(extractClientIp(request) ?? 'unknown');
	if (rate.limited) {
		return jsonResponse({ ok: false, error: 'Muitas requisições.' }, 429, {
			'Retry-After': String(rate.retryAfterSeconds),
		});
	}

	if (Number(request.headers.get('content-length') ?? 0) > MAX_BODY_BYTES) {
		return jsonResponse({ ok: false, error: 'Requisição muito grande.' }, 413);
	}

	const rawBody = await request.text();
	if (rawBody.length > MAX_BODY_BYTES) {
		return jsonResponse({ ok: false, error: 'Requisição muito grande.' }, 413);
	}

	let parsed: unknown;
	try {
		parsed = JSON.parse(rawBody);
	} catch {
		return jsonResponse({ ok: false, error: 'JSON inválido.' }, 400);
	}

	const result = metaEventSchema.safeParse(parsed);
	if (!result.success) {
		return jsonResponse({ ok: false, error: 'Evento inválido.' }, 400);
	}

	const event = result.data;

	await sendMetaEvent({
		eventName: event.event_name,
		eventId: event.event_id,
		eventSourceUrl: event.event_source_url,
		userData: {
			clientIpAddress: extractClientIp(request),
			clientUserAgent: request.headers.get('user-agent') ?? undefined,
			fbp: event.fbp,
			fbc: event.fbc,
			fbclid: event.fbclid,
		},
		customData: event.content_name ? { content_name: event.content_name } : undefined,
	});

	return jsonResponse({ ok: true });
};
