import { describe, expect, it } from 'vitest';
import { buildGoogleAdsSendTo } from './tracking-config';

describe('buildGoogleAdsSendTo', () => {
	it('builds send_to from ads id and label', () => {
		expect(buildGoogleAdsSendTo('AW-123456789', 'AbCdEfGh')).toBe('AW-123456789/AbCdEfGh');
	});

	it('returns undefined when id or label is missing', () => {
		expect(buildGoogleAdsSendTo(undefined, 'label')).toBeUndefined();
		expect(buildGoogleAdsSendTo('AW-123', undefined)).toBeUndefined();
	});
});
