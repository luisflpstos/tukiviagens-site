import { afterEach, describe, expect, it, vi } from 'vitest';
import {
	forwardWhatsAppClickPayload,
	handleWhatsAppClickRequest,
	resolveWhatsAppWebhookUrl,
	whatsappClickPayloadSchema,
} from './whatsapp-webhook';

describe('resolveWhatsAppWebhookUrl', () => {
	it('prefers dedicated WhatsApp webhook over lead webhook', () => {
		expect(
			resolveWhatsAppWebhookUrl({
				whatsappWebhookUrl: 'https://wa.example/hook',
				publicWhatsappWebhookUrl: 'https://public.example/hook',
				leadWebhookUrl: 'https://lead.example/hook',
			}),
		).toBe('https://wa.example/hook');
	});

	it('falls back to PUBLIC_WHATSAPP then LEAD webhook', () => {
		expect(
			resolveWhatsAppWebhookUrl({
				publicWhatsappWebhookUrl: 'https://public.example/hook',
				leadWebhookUrl: 'https://lead.example/hook',
			}),
		).toBe('https://public.example/hook');

		expect(
			resolveWhatsAppWebhookUrl({
				leadWebhookUrl: 'https://lead.example/hook',
			}),
		).toBe('https://lead.example/hook');
	});

	it('returns undefined when no webhook is configured', () => {
		expect(resolveWhatsAppWebhookUrl({})).toBeUndefined();
	});
});

describe('whatsappClickPayloadSchema', () => {
	const validPayload = {
		event: 'whatsapp_click',
		source: 'google',
		h1: 'Enjoy Solar',
		utm_source: 'google',
		utm_medium: 'cpc',
		utm_campaign: 'camp',
		utm_content: '',
		utm_term: '',
		gclid: '',
		gbraid: '',
		wbraid: '',
		fbclid: '',
		page_url: 'https://www.tukiviagens.com.br/lp/x/',
		page_title: 'LP',
		referrer: 'https://www.google.com/',
		horario_local: '03/07/2026 17:05:13',
		timestamp_iso: '2026-07-03T20:05:13.912Z',
		user_agent: 'Mozilla/5.0',
		product: 'Enjoy Solar',
	};

	it('accepts a valid whatsapp_click payload', () => {
		const result = whatsappClickPayloadSchema.safeParse(validPayload);
		expect(result.success).toBe(true);
	});

	it('rejects payloads with wrong event type', () => {
		const result = whatsappClickPayloadSchema.safeParse({
			...validPayload,
			event: 'lead_submit',
		});
		expect(result.success).toBe(false);
	});

	it('rejects oversized payloads fields', () => {
		const result = whatsappClickPayloadSchema.safeParse({
			...validPayload,
			h1: 'x'.repeat(600),
		});
		expect(result.success).toBe(false);
	});
});

describe('forwardWhatsAppClickPayload', () => {
	afterEach(() => {
		vi.unstubAllGlobals();
		vi.restoreAllMocks();
	});

	it('POSTs JSON to the webhook with optional Bearer secret', async () => {
		const fetchMock = vi.fn().mockResolvedValue({ ok: true, status: 200 });
		vi.stubGlobal('fetch', fetchMock);

		const result = await forwardWhatsAppClickPayload({
			webhookUrl: 'https://flow.example/webhook',
			secret: 'tokensecret',
			payload: {
				event: 'whatsapp_click',
				source: 'direct',
				h1: 'Home',
				utm_source: '',
				utm_medium: '',
				utm_campaign: '',
				utm_content: '',
				utm_term: '',
				gclid: '',
				gbraid: '',
				wbraid: '',
				fbclid: '',
				page_url: 'https://www.tukiviagens.com.br/',
				page_title: 'Tuki',
				referrer: '',
				horario_local: '14/07/2026 13:00:00',
				timestamp_iso: '2026-07-14T16:00:00.000Z',
				user_agent: 'test',
			},
		});

		expect(result).toEqual({ ok: true });
		expect(fetchMock).toHaveBeenCalledOnce();
		const [url, init] = fetchMock.mock.calls[0]!;
		expect(url).toBe('https://flow.example/webhook');
		expect(init.method).toBe('POST');
		expect(init.headers).toMatchObject({
			'Content-Type': 'application/json',
			Authorization: 'Bearer tokensecret',
		});
	});

	it('returns ok:false when upstream responds with error', async () => {
		vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 500 }));

		const result = await forwardWhatsAppClickPayload({
			webhookUrl: 'https://flow.example/webhook',
			payload: { event: 'whatsapp_click' },
		});

		expect(result).toEqual({ ok: false, status: 500 });
	});

	it('returns ok:false when fetch throws (network/timeout)', async () => {
		vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('timeout')));

		const result = await forwardWhatsAppClickPayload({
			webhookUrl: 'https://flow.example/webhook',
			payload: { event: 'whatsapp_click' },
		});

		expect(result).toEqual({ ok: false, error: 'timeout' });
	});
});

describe('handleWhatsAppClickRequest', () => {
	const validBody = JSON.stringify({
		event: 'whatsapp_click',
		source: 'google',
		h1: 'Enjoy Solar',
		utm_source: 'google',
		utm_medium: 'cpc',
		utm_campaign: 'camp',
		utm_content: '',
		utm_term: '',
		gclid: '',
		gbraid: '',
		wbraid: '',
		fbclid: '',
		page_url: 'https://www.tukiviagens.com.br/lp/x/',
		page_title: 'LP',
		referrer: '',
		horario_local: '14/07/2026 13:00:00',
		timestamp_iso: '2026-07-14T16:00:00.000Z',
		user_agent: 'Mozilla/5.0',
		product: 'Enjoy Solar',
	});

	it('returns 415 for non-JSON content type', async () => {
		const result = await handleWhatsAppClickRequest({
			contentType: 'text/plain',
			rawBody: validBody,
			webhookUrl: 'https://flow.example/webhook',
		});
		expect(result).toEqual({
			status: 415,
			body: { ok: false, error: 'Formato inválido.' },
		});
	});

	it('returns 400 for invalid JSON and invalid schema', async () => {
		expect(
			await handleWhatsAppClickRequest({
				contentType: 'application/json',
				rawBody: '{',
				webhookUrl: 'https://flow.example/webhook',
			}),
		).toEqual({ status: 400, body: { ok: false, error: 'JSON inválido.' } });

		expect(
			await handleWhatsAppClickRequest({
				contentType: 'application/json',
				rawBody: JSON.stringify({ event: 'lead_submit' }),
				webhookUrl: 'https://flow.example/webhook',
			}),
		).toEqual({ status: 400, body: { ok: false, error: 'Payload inválido.' } });
	});

	it('returns 503 when webhook URL is missing', async () => {
		const result = await handleWhatsAppClickRequest({
			contentType: 'application/json',
			rawBody: validBody,
		});
		expect(result.status).toBe(503);
		expect(result.body.ok).toBe(false);
	});

	it('returns 502 when upstream forward fails and 200 on success', async () => {
		const fail = await handleWhatsAppClickRequest({
			contentType: 'application/json',
			rawBody: validBody,
			webhookUrl: 'https://flow.example/webhook',
			forward: async () => ({ ok: false, status: 500 }),
		});
		expect(fail.status).toBe(502);

		const ok = await handleWhatsAppClickRequest({
			contentType: 'application/json',
			rawBody: validBody,
			webhookUrl: 'https://flow.example/webhook',
			secret: 'secret',
			forward: async (input) => {
				expect(input.webhookUrl).toBe('https://flow.example/webhook');
				expect(input.secret).toBe('secret');
				expect(input.payload).toMatchObject({ event: 'whatsapp_click' });
				return { ok: true };
			},
		});
		expect(ok).toEqual({ status: 200, body: { ok: true } });
	});
});
