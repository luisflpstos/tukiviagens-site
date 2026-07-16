import { describe, expect, it } from 'vitest';
import { isAllowedOrigin } from './lead-security';

function requestWithOrigin(origin: string | null): Request {
	const headers = new Headers();
	if (origin) headers.set('origin', origin);
	return new Request('http://localhost:4321/api/whatsapp-click/', { headers });
}

describe('isAllowedOrigin', () => {
	it('allows requests without Origin (sendBeacon / same-origin navigations)', () => {
		expect(isAllowedOrigin(requestWithOrigin(null))).toBe(true);
	});

	it('allows local http origins on any port (Astro may use 4321, 4322, …)', () => {
		expect(isAllowedOrigin(requestWithOrigin('http://localhost:4321'))).toBe(true);
		expect(isAllowedOrigin(requestWithOrigin('http://localhost:4322'))).toBe(true);
		expect(isAllowedOrigin(requestWithOrigin('http://127.0.0.1:4322'))).toBe(true);
	});

	it('rejects non-local origins that do not match PUBLIC_SITE_URL when set', () => {
		const previous = process.env.PUBLIC_SITE_URL;
		process.env.PUBLIC_SITE_URL = 'https://www.tukiviagens.com.br';
		try {
			expect(isAllowedOrigin(requestWithOrigin('https://evil.example'))).toBe(false);
			expect(isAllowedOrigin(requestWithOrigin('https://www.tukiviagens.com.br'))).toBe(true);
		} finally {
			if (previous === undefined) delete process.env.PUBLIC_SITE_URL;
			else process.env.PUBLIC_SITE_URL = previous;
		}
	});
});
