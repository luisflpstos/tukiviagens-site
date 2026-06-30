const STORAGE_KEY = 'tuki_attribution';

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

export function getStoredAttribution(): StoredAttribution {
	try {
		return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') as StoredAttribution;
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

export function fillHiddenTrackingFields(form: HTMLFormElement): void {
	const data = getStoredAttribution();
	const fields: Record<string, string | undefined> = {
		utm_source: data.utm_source,
		utm_medium: data.utm_medium,
		utm_campaign: data.utm_campaign,
		utm_content: data.utm_content,
		utm_term: data.utm_term,
		gclid: data.gclid,
		gbraid: data.gbraid,
		wbraid: data.wbraid,
		fbclid: data.fbclid,
		msclkid: data.msclkid,
		referrer: data.referrer,
		landing_page: data.landing_page,
		first_landing_page: data.first_landing_page,
		current_url: data.current_url,
	};

	for (const [name, value] of Object.entries(fields)) {
		const input = form.querySelector<HTMLInputElement>(`input[name="${name}"]`);
		if (input && value) input.value = value;
	}

	const pageInput = form.querySelector<HTMLInputElement>('input[name="page_title"]');
	if (pageInput) pageInput.value = document.title;
}
