import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import {
	LEAD_TRACKER_API_BASE,
	LEAD_TRACKER_PROJECT_KEY,
	LEAD_TRACKER_SRC,
	LEAD_TRACKER_UPSTREAM_API_BASE,
} from './lead-config';

describe('Kortex lead tracker', () => {
	it('exposes the same-origin script, api base, and project key for form pages', () => {
		expect(LEAD_TRACKER_SRC).toBe('/kortex-lead-tracker.js');
		expect(LEAD_TRACKER_PROJECT_KEY).toBe('f82b922f-91a1-4586-8447-b4944ecfd694');
		// sendBeacon (credentials:include) + BFF ACAO:* → CORS; proxy same-origin.
		expect(LEAD_TRACKER_API_BASE).toBe('/api/kortex');
		expect(LEAD_TRACKER_UPSTREAM_API_BASE).toBe('https://bff.kortex.app.br/api/v1');
	});

	it('posts to the trailing-slash form path so Astro trailingSlash:always matches the proxy', () => {
		const script = readFileSync(join(process.cwd(), 'public/kortex-lead-tracker.js'), 'utf8');
		expect(script).toContain("/public/leads/form/?projectKey=");
		expect(script).not.toContain("/public/leads/form?projectKey=");
	});
});
