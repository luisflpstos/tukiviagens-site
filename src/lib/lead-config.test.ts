import { describe, expect, it } from 'vitest';
import { LEAD_TRACKER_PROJECT_KEY, LEAD_TRACKER_SRC } from './lead-config';

describe('Kortex lead tracker', () => {
	it('exposes only the official public script URL and project key for form pages', () => {
		expect(LEAD_TRACKER_SRC).toBe(
			'https://bff.kortex.app.br/api/v1/public/lead-tracker.js',
		);
		expect(LEAD_TRACKER_PROJECT_KEY).toBe('4142ee56-cbe6-4c6f-ba30-42acfc67768f');
	});
});
