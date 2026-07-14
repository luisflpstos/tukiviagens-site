import type { APIRoute } from 'astro';
import { getLeadWebhookSecret } from '../../lib/lead-config';
import { isAllowedOrigin, jsonResponse } from '../../lib/lead-security';
import {
	getWhatsAppWebhookUrl,
	handleWhatsAppClickRequest,
} from '../../lib/whatsapp-webhook';

export const prerender = false;

/**
 * Proxy same-origin para cliques no WhatsApp.
 * O browser não chama o webhook Kortex diretamente (CORS / credentials:include do sendBeacon).
 */
export const POST: APIRoute = async ({ request }) => {
	if (!isAllowedOrigin(request)) {
		return jsonResponse({ ok: false, error: 'Origem não permitida.' }, 403);
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
