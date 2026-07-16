import { describe, expect, it } from 'vitest';
import { LEAD_FORM_USES_SERVER_API } from './lead-form';

describe('lead form submit', () => {
	it('does not post form leads to /api/lead or the flow webhook', () => {
		// Ingestão de lead do formulário: só Kortex lead-tracker.js (auto-capture).
		expect(LEAD_FORM_USES_SERVER_API).toBe(false);
	});
});
