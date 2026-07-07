import type { APIRoute } from 'astro';
import { getLeadWebhookSecret, getLeadWebhookUrl } from '../../lib/lead-config';
import { extractGeoFromRequest } from '../../lib/lead-geo';
import { isAllowedOrigin, jsonResponse } from '../../lib/lead-security';
import {
	firstZodError,
	leadFormFieldsSchema,
	leadSubmissionSchema,
} from '../../lib/lead-schema';
import { buildLeadSubmitPayload } from '../../lib/tracking-payload';
import { extractClientIp, sendMetaEvent } from '../../lib/meta-capi';

export const prerender = false;

const MAX_BODY_BYTES = 16_384;

export const POST: APIRoute = async ({ request }) => {
	if (request.method !== 'POST') {
		return jsonResponse({ ok: false, error: 'Método não permitido.' }, 405);
	}

	if (!isAllowedOrigin(request)) {
		return jsonResponse({ ok: false, error: 'Origem não permitida.' }, 403);
	}

	const contentType = request.headers.get('content-type') ?? '';
	if (!contentType.includes('application/json')) {
		return jsonResponse({ ok: false, error: 'Formato inválido.' }, 415);
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

	const envelope = leadSubmissionSchema.safeParse(parsed);
	if (!envelope.success) {
		return jsonResponse({ ok: false, error: firstZodError(envelope.error) }, 400);
	}

	if (envelope.data._hp?.trim()) {
		return jsonResponse({ ok: true });
	}

	const fields = leadFormFieldsSchema.safeParse(envelope.data);
	if (!fields.success) {
		return jsonResponse({ ok: false, error: firstZodError(fields.error) }, 400);
	}

	const webhookUrl = getLeadWebhookUrl();
	if (!webhookUrl) {
		console.error('[lead] LEAD_WEBHOOK_URL não configurada.');
		return jsonResponse({ ok: false, error: 'Serviço temporariamente indisponível.' }, 503);
	}

	const geo = extractGeoFromRequest(request);
	const submittedAt = new Date();

	const payload = buildLeadSubmitPayload({
		fields: fields.data,
		attribution: envelope.data.attribution,
		context: envelope.data.context,
		geo,
		submittedAt,
		userAgent: request.headers.get('user-agent'),
		referrer: request.headers.get('referer'),
	});

	const headers: Record<string, string> = {
		'Content-Type': 'application/json',
		'User-Agent': 'TukiViagens-LeadProxy/1.0',
	};

	const secret = getLeadWebhookSecret();
	if (secret) {
		headers.Authorization = `Bearer ${secret}`;
	}

	try {
		const upstream = await fetch(webhookUrl, {
			method: 'POST',
			headers,
			body: JSON.stringify(payload),
			signal: AbortSignal.timeout(12_000),
		});

		if (!upstream.ok) {
			console.error('[lead] Webhook respondeu com status', upstream.status);
			return jsonResponse({ ok: false, error: 'Não foi possível enviar agora.' }, 502);
		}
	} catch (error) {
		console.error('[lead] Falha ao encaminhar lead:', error);
		return jsonResponse({ ok: false, error: 'Não foi possível enviar agora.' }, 502);
	}

	// Meta CAPI: evento Lead servidor→servidor, deduplicado com o Pixel via event_id.
	// Nunca lança — falhas não impactam a resposta ao usuário.
	await sendMetaEvent({
		eventName: 'Lead',
		eventId: envelope.data.meta?.event_id ?? crypto.randomUUID(),
		eventTime: Math.floor(submittedAt.getTime() / 1000),
		eventSourceUrl: envelope.data.context?.page_url ?? envelope.data.attribution?.current_url,
		userData: {
			email: fields.data.email,
			phone: fields.data.telefone,
			fullName: fields.data.nome,
			city: geo.cidade ?? undefined,
			state: geo.regiao ?? undefined,
			country: geo.pais ?? undefined,
			clientIpAddress: extractClientIp(request),
			clientUserAgent: request.headers.get('user-agent') ?? undefined,
			fbp: envelope.data.meta?.fbp,
			fbc: envelope.data.meta?.fbc,
			fbclid: envelope.data.attribution?.fbclid,
		},
		customData: {
			...(envelope.data.context?.hotel || envelope.data.context?.resort
				? { content_name: envelope.data.context.hotel || envelope.data.context.resort }
				: {}),
			...(envelope.data.context?.destination
				? { content_category: envelope.data.context.destination }
				: {}),
		},
	});

	return jsonResponse({ ok: true });
};
