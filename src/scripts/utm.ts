const STORAGE_KEY = 'tuki_attribution';
export const ATTRIBUTION_TTL_MS = 24 * 60 * 60 * 1000;

export const TRACKING_PARAMS = [
	'utm_source',
	'utm_medium',
	'utm_campaign',
	'utm_content',
	'utm_term',
	'gclid',
	'gbraid',
	'wbraid',
	'fbclid',
	'msclkid',
] as const;

export type TrackingParams = Partial<Record<(typeof TRACKING_PARAMS)[number], string>>;

export interface StoredAttribution extends TrackingParams {
	first_landing_page?: string;
	landing_page?: string;
	current_url?: string;
	referrer?: string;
	timestamp?: string;
}

function isAttributionExpired(stored: StoredAttribution): boolean {
	if (!stored.timestamp) {
		return Object.keys(stored).length > 0;
	}

	const storedAt = Date.parse(stored.timestamp);
	if (Number.isNaN(storedAt)) return true;

	return Date.now() - storedAt > ATTRIBUTION_TTL_MS;
}

function clearStoredAttribution(): void {
	try {
		localStorage.removeItem(STORAGE_KEY);
	} catch {
		// ignore storage errors (private mode, quota, etc.)
	}
}

export function getStoredAttribution(): StoredAttribution {
	try {
		const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') as StoredAttribution;
		if (isAttributionExpired(stored)) {
			clearStoredAttribution();
			return {};
		}
		return stored;
	} catch {
		return {};
	}
}

export function captureUtmParams(): void {
	const params = new URLSearchParams(window.location.search);
	const stored = getStoredAttribution();
	const captured: StoredAttribution = { ...stored };
	let hasNewParams = false;

	for (const key of TRACKING_PARAMS) {
		const value = params.get(key);
		if (value) {
			captured[key] = value;
			hasNewParams = true;
		}
	}

	if (!stored.first_landing_page) {
		captured.first_landing_page = window.location.pathname;
	}

	captured.landing_page = window.location.pathname;
	captured.current_url = window.location.href;
	captured.referrer = document.referrer || stored.referrer;
	captured.timestamp = new Date().toISOString();

	if (hasNewParams || !stored.first_landing_page) {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(captured));
	}
}
