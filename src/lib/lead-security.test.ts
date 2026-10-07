import { describe, expect, it } from 'vitest';
import { getAllowedOrigins, isAllowedOrigin, isSiteUrl, jsonResponse } from './lead-security';

const SITE = 'https://www.tukiviagens.com.br';

function request(headers: Record<string, string>): Request {
	return new Request('https://www.tukiviagens.com.br/api/whatsapp-click/', {
		method: 'POST',
		headers,
	});
}

describe('getAllowedOrigins', () => {
	it('combines site URL and Vercel deployment hosts, without duplicates', () => {
		expect(
			getAllowedOrigins(
				{
					PUBLIC_SITE_URL: 'https://www.tukiviagens.com.br/',
					VERCEL_URL: 'tukiviagens-abc123.vercel.app',
					VERCEL_PROJECT_PRODUCTION_URL: 'www.tukiviagens.com.br',
				},
				undefined,
			),
		).toEqual(['https://www.tukiviagens.com.br', 'https://tukiviagens-abc123.vercel.app']);
	});

	it('is empty when nothing is configured (fail-closed)', () => {
		expect(getAllowedOrigins({}, undefined)).toEqual([]);
	});
});

describe('isAllowedOrigin', () => {
	const prod = { allowedOrigins: [SITE], allowLocalhost: false };

	it('allows same-site Origin', () => {
		expect(isAllowedOrigin(request({ origin: SITE }), prod)).toBe(true);
		expect(isAllowedOrigin(request({ origin: SITE, 'sec-fetch-site': 'same-origin' }), prod)).toBe(
			true,
		);
	});

	it('allows same-origin requests without Origin when Sec-Fetch-Site says so', () => {
		expect(isAllowedOrigin(request({ 'sec-fetch-site': 'same-origin' }), prod)).toBe(true);
	});

	it('rejects requests with neither Origin nor Sec-Fetch-Site (curl, scripts)', () => {
		expect(isAllowedOrigin(request({}), prod)).toBe(false);
	});

	it('rejects foreign, null and cross-site origins', () => {
		expect(isAllowedOrigin(request({ origin: 'https://evil.example' }), prod)).toBe(false);
		expect(isAllowedOrigin(request({ origin: 'null' }), prod)).toBe(false);
		expect(isAllowedOrigin(request({ origin: SITE, 'sec-fetch-site': 'cross-site' }), prod)).toBe(
			false,
		);
	});

	it('only accepts localhost origins when allowLocalhost is on (astro dev)', () => {
		expect(isAllowedOrigin(request({ origin: 'http://localhost:4321' }), prod)).toBe(false);
		expect(
			isAllowedOrigin(request({ origin: 'http://localhost:4322' }), {
				allowedOrigins: [],
				allowLocalhost: true,
			}),
		).toBe(true);
		expect(
			isAllowedOrigin(request({ origin: 'http://127.0.0.1:4322' }), {
				allowedOrigins: [],
				allowLocalhost: true,
			}),
		).toBe(true);
	});
});

describe('isSiteUrl', () => {
	const prod = { allowedOrigins: [SITE], allowLocalhost: false };

	it('accepts http(s) URLs from allowed origins only', () => {
		expect(isSiteUrl(`${SITE}/olimpia/?utm_source=google`, prod)).toBe(true);
		expect(isSiteUrl('https://evil.example/olimpia/', prod)).toBe(false);
		expect(isSiteUrl('https://www.tukiviagens.com.br.evil.example/', prod)).toBe(false);
		expect(isSiteUrl('javascript:alert(1)', prod)).toBe(false);
		expect(isSiteUrl('not a url', prod)).toBe(false);
	});
});

describe('jsonResponse', () => {
	it('sets no-store/nosniff and merges extra headers', () => {
		const response = jsonResponse({ ok: false }, 429, { 'Retry-After': '30' });
		expect(response.status).toBe(429);
		expect(response.headers.get('cache-control')).toBe('no-store');
		expect(response.headers.get('x-content-type-options')).toBe('nosniff');
		expect(response.headers.get('retry-after')).toBe('30');
	});
});
