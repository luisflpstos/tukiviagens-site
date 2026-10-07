import { describe, expect, it } from 'vitest';
import {
	CONSENT_VERSION,
	buildGoogleConsentState,
	parseStoredConsent,
	serializeConsent,
} from './consent';

describe('stored consent', () => {
	it('round-trips a choice for the current version', () => {
		expect(parseStoredConsent(serializeConsent('granted'))).toBe('granted');
		expect(parseStoredConsent(serializeConsent('denied'))).toBe('denied');
	});

	it('asks again when the version changes or the value is invalid', () => {
		expect(
			parseStoredConsent(JSON.stringify({ choice: 'granted', version: CONSENT_VERSION - 1 })),
		).toBeNull();
		expect(parseStoredConsent(JSON.stringify({ choice: 'yes', version: CONSENT_VERSION }))).toBeNull();
		expect(parseStoredConsent('{')).toBeNull();
		expect(parseStoredConsent(null)).toBeNull();
	});
});

describe('buildGoogleConsentState', () => {
	it('denies everything until the visitor accepts', () => {
		expect(buildGoogleConsentState(null)).toEqual({
			ad_storage: 'denied',
			ad_user_data: 'denied',
			ad_personalization: 'denied',
			analytics_storage: 'denied',
		});
		expect(buildGoogleConsentState('denied').analytics_storage).toBe('denied');
		expect(buildGoogleConsentState('granted')).toEqual({
			ad_storage: 'granted',
			ad_user_data: 'granted',
			ad_personalization: 'granted',
			analytics_storage: 'granted',
		});
	});
});
