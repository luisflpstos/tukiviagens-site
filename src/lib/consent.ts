export const CONSENT_STORAGE_KEY = 'tuki_consent';

/** Incrementar quando as finalidades de cookies mudarem, para pedir o consentimento de novo. */
export const CONSENT_VERSION = 1;

export type ConsentChoice = 'granted' | 'denied';

export interface StoredConsent {
	choice: ConsentChoice;
	version: number;
	saved_at: string;
}

export type GoogleConsentState = Record<
	'ad_storage' | 'ad_user_data' | 'ad_personalization' | 'analytics_storage',
	ConsentChoice
>;

export function parseStoredConsent(raw: string | null | undefined): ConsentChoice | null {
	if (!raw) return null;

	try {
		const parsed = JSON.parse(raw) as Partial<StoredConsent>;
		if (parsed.version !== CONSENT_VERSION) return null;
		return parsed.choice === 'granted' || parsed.choice === 'denied' ? parsed.choice : null;
	} catch {
		return null;
	}
}

export function serializeConsent(choice: ConsentChoice, now: Date = new Date()): string {
	const stored: StoredConsent = { choice, version: CONSENT_VERSION, saved_at: now.toISOString() };
	return JSON.stringify(stored);
}

/** Consent Mode v2: sem escolha registrada, tudo começa negado (LGPD — consentimento prévio). */
export function buildGoogleConsentState(choice: ConsentChoice | null): GoogleConsentState {
	const value: ConsentChoice = choice === 'granted' ? 'granted' : 'denied';
	return {
		ad_storage: value,
		ad_user_data: value,
		ad_personalization: value,
		analytics_storage: value,
	};
}
