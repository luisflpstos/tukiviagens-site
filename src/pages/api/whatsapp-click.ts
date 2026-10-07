import type { APIRoute } from 'astro';
import { getLeadWebhookSecret } from '../../lib/lead-config';
import { isAllowedOrigin, jsonResponse } from '../../lib/lead-security';
import { extractClientIp } from '../../lib/meta-capi';
import { createRateLimiter } from '../../lib/rate-limit';
import {
	WHATSAPP_CLICK_MAX_BODY_BYTES,
	getWhatsAppWebhookUrl,
	handleWhatsAppClickRequest,
} from '../../lib/whatsapp-webhook';

export const prerender = false;

const rateLimit = createRateLimiter({ limit: 10, windowMs: 60_000 });

/**
 * Proxy same-origin para cliques no WhatsApp.
 * O browser não chama o webhook Kortex diretamente (CORS / credentials:include do sendBeacon).
 */
export const POST: APIRoute = async ({ request }) => {
	if (!isAllowedOrigin(request)) {
		return jsonResponse({ ok: false, error: 'Origem não permitida.' }, 403);
	}

	const rate = rateLimit(extractClientIp(request) ?? 'unknown');
	if (rate.limited) {
		return jsonResponse({ ok: false, error: 'Muitas requisições.' }, 429, {
			'Retry-After': String(rate.retryAfterSeconds),
		});
	}

	if (Number(request.headers.get('content-length') ?? 0) > WHATSAPP_CLICK_MAX_BODY_BYTES) {
		return jsonResponse({ ok: false, error: 'Requisição muito grande.' }, 413);
	}

	const result = await handleWhatsAppClickRequest({
		contentType: request.headers.get('content-type') ?? '',
		rawBody: await request.text(),
		webhookUrl: getWhatsAppWebhookUrl(),
		secret: getLeadWebhookSecret(),
	});

	if (!result.body.ok) {
		console.error('[whatsapp-click]', result.status, result.body);
	}

	return jsonResponse(result.body, result.status);
};
