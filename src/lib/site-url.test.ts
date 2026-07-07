import { describe, expect, it } from 'vitest';
import { resolveSiteUrl } from './site-url';

describe('resolveSiteUrl', () => {
	it('uses PUBLIC_SITE_URL when set', () => {
		expect(resolveSiteUrl({ PUBLIC_SITE_URL: 'https://example.com/' })).toBe('https://example.com');
	});

	it('falls back to production URL on Vercel production builds', () => {
		expect(resolveSiteUrl({ VERCEL_ENV: 'production' })).toBe('https://www.tukiviagens.com.br');
	});

	it('falls back to localhost for local development', () => {
		expect(resolveSiteUrl({})).toBe('http://localhost:4321');
	});
});
