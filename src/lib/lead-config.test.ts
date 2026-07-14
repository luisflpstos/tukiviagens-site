import { describe, expect, it } from 'vitest';
import { LEAD_TRACKER_PROJECT_KEY, LEAD_TRACKER_SRC } from './lead-config';

describe('Kortex lead tracker', () => {
	it('exposes the public script URL and project key for form pages', () => {
		expect(LEAD_TRACKER_SRC).toBe(
			'https://bff.kortex.app.br/api/v1/public/lead-tracker.js',
		);
		expect(LEAD_TRACKER_PROJECT_KEY).toBe('f82b922f-91a1-4586-8447-b4944ecfd694');
	});
});
