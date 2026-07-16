import { afterEach, describe, expect, it, vi } from 'vitest';
import {
	buildKortexLeadFormUrl,
	forwardKortexLeadForm,
	handleKortexLeadFormRequest,
	KORTEX_LEAD_FORM_MAX_BODY_BYTES,
} from './kortex-lead-proxy';
import { LEAD_TRACKER_PROJECT_KEY, LEAD_TRACKER_UPSTREAM_API_BASE } from './lead-config';

describe('buildKortexLeadFormUrl', () => {
	it('builds the upstream form URL with the project key', () => {
		expect(buildKortexLeadFormUrl(LEAD_TRACKER_UPSTREAM_API_BASE, LEAD_TRACKER_PROJECT_KEY)).toBe(
			`https://bff.kortex.app.br/api/v1/public/leads/form?projectKey=${LEAD_TRACKER_PROJECT_KEY}`,
		);
	});
});

describe('forwardKortexLeadForm', () => {
	afterEach(() => {
		vi.unstubAllGlobals();
		vi.restoreAllMocks();
	});

	it('POSTs the raw JSON body with X-Project-Key (server→server, no credentials)', async () => {
		const fetchMock = vi.fn().mockResolvedValue({ ok: true, status: 200 });
		vi.stubGlobal('fetch', fetchMock);

		const body = JSON.stringify({ name: 'Ana', phone: '11999999999' });
		const result = await forwardKortexLeadForm({
			upstreamUrl: buildKortexLeadFormUrl(
				LEAD_TRACKER_UPSTREAM_API_BASE,
				LEAD_TRACKER_PROJECT_KEY,
			),
			projectKey: LEAD_TRACKER_PROJECT_KEY,
			rawBody: body,
		});

		expect(result).toEqual({ ok: true });
		expect(fetchMock).toHaveBeenCalledOnce();
		const [url, init] = fetchMock.mock.calls[0]!;
		expect(url).toContain('/public/leads/form?projectKey=');
		expect(init.method).toBe('POST');
		expect(init.body).toBe(body);
		expect(init.headers).toMatchObject({
			'Content-Type': 'application/json',
			'X-Project-Key': LEAD_TRACKER_PROJECT_KEY,
		});
	});

	it('returns ok:false when upstream fails or throws', async () => {
		vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 502 }));
		expect(
			await forwardKortexLeadForm({
				upstreamUrl: 'https://bff.example/form',
				projectKey: 'key',
				rawBody: '{}',
			}),
		).toEqual({ ok: false, status: 502 });

		vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('timeout')));
		expect(
			await forwardKortexLeadForm({
				upstreamUrl: 'https://bff.example/form',
				projectKey: 'key',
				rawBody: '{}',
			}),
		).toEqual({ ok: false, error: 'timeout' });
	});
});

describe('handleKortexLeadFormRequest', () => {
	const validBody = JSON.stringify({
		name: 'Ana',
		email: 'ana@example.com',
		phone: '11999999999',
		fields: { nome: 'Ana', telefone: '11999999999' },
		dedupeKey: 'kortex-1',
		occurredAt: '2026-07-16T21:00:00.000Z',
	});

	it('rejects wrong project key, non-JSON, oversized body, and invalid JSON', async () => {
		expect(
			await handleKortexLeadFormRequest({
				contentType: 'application/json',
				rawBody: validBody,
				projectKey: 'wrong-key',
				expectedProjectKey: LEAD_TRACKER_PROJECT_KEY,
			}),
		).toEqual({ status: 403, body: { ok: false, error: 'Project key inválida.' } });

		expect(
			await handleKortexLeadFormRequest({
				contentType: 'text/plain',
				rawBody: validBody,
				projectKey: LEAD_TRACKER_PROJECT_KEY,
				expectedProjectKey: LEAD_TRACKER_PROJECT_KEY,
			}),
		).toEqual({ status: 415, body: { ok: false, error: 'Formato inválido.' } });

		expect(
			await handleKortexLeadFormRequest({
				contentType: 'application/json',
				rawBody: 'x'.repeat(KORTEX_LEAD_FORM_MAX_BODY_BYTES + 1),
				projectKey: LEAD_TRACKER_PROJECT_KEY,
				expectedProjectKey: LEAD_TRACKER_PROJECT_KEY,
			}),
		).toEqual({ status: 413, body: { ok: false, error: 'Requisição muito grande.' } });

		expect(
			await handleKortexLeadFormRequest({
				contentType: 'application/json',
				rawBody: '{',
				projectKey: LEAD_TRACKER_PROJECT_KEY,
				expectedProjectKey: LEAD_TRACKER_PROJECT_KEY,
			}),
		).toEqual({ status: 400, body: { ok: false, error: 'JSON inválido.' } });
	});

	it('returns 502 when forward fails and 200 on success', async () => {
		const fail = await handleKortexLeadFormRequest({
			contentType: 'application/json',
			rawBody: validBody,
			projectKey: LEAD_TRACKER_PROJECT_KEY,
			expectedProjectKey: LEAD_TRACKER_PROJECT_KEY,
			upstreamApiBase: LEAD_TRACKER_UPSTREAM_API_BASE,
			forward: async () => ({ ok: false, status: 500 }),
		});
		expect(fail.status).toBe(502);

		const ok = await handleKortexLeadFormRequest({
			contentType: 'application/json',
			rawBody: validBody,
			projectKey: LEAD_TRACKER_PROJECT_KEY,
			expectedProjectKey: LEAD_TRACKER_PROJECT_KEY,
			upstreamApiBase: LEAD_TRACKER_UPSTREAM_API_BASE,
			forward: async (input) => {
				expect(input.projectKey).toBe(LEAD_TRACKER_PROJECT_KEY);
				expect(input.rawBody).toBe(validBody);
				expect(input.upstreamUrl).toContain(LEAD_TRACKER_PROJECT_KEY);
				return { ok: true };
			},
		});
		expect(ok).toEqual({ status: 200, body: { ok: true } });
	});
});
