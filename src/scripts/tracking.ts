import {
	getGoogleAdsLeadSendTo,
	getGoogleAdsWhatsAppSendTo,
} from '../lib/tracking-config';

declare global {
	interface Window {
		dataLayer: Record<string, unknown>[];
		gtag?: (...args: unknown[]) => void;
	}
}

const LEAD_CONVERSION_SENT_KEY = 'tuki_lead_conversion_sent';

function pushDataLayer(event: string, data: Record<string, unknown> = {}): void {
	window.dataLayer = window.dataLayer || [];
	window.dataLayer.push({ event, ...data });
}

function trackGa4Event(name: string, params: Record<string, unknown> = {}): void {
	window.gtag?.('event', name, params);
	pushDataLayer(name, params);
}

function trackGoogleAdsConversion(
	sendTo: string | undefined,
	params: Record<string, unknown> = {},
): void {
	if (!sendTo) return;

	const payload = { send_to: sendTo, currency: 'BRL', value: 1.0, ...params };
	pushDataLayer('google_ads_conversion', payload);
}

export function pushEvent(event: string, data: Record<string, unknown> = {}): void {
	trackGa4Event(event, data);
}

export function trackWhatsAppClick(data: Record<string, unknown> = {}): void {
	const params = { method: 'whatsapp', ...data };
	trackGa4Event('whatsapp_click', params);
	trackGoogleAdsConversion(getGoogleAdsWhatsAppSendTo());
}

export function trackCtaClick(label: string, data: Record<string, unknown> = {}): void {
	pushEvent('cta_click', { cta_label: label, ...data });
}

export function trackFormStart(formId: string): void {
	pushEvent('lead_form_start', { form_id: formId });
}

export function trackFormSubmit(formId: string, data: Record<string, unknown> = {}): void {
	pushEvent('lead_form_submit', { form_id: formId, ...data });
}

export function trackFormError(formId: string, error: string): void {
	pushEvent('lead_form_error', { form_id: formId, error });
}

export function trackLeadConversion(data: Record<string, unknown> = {}): void {
	if (typeof sessionStorage !== 'undefined') {
		if (sessionStorage.getItem(LEAD_CONVERSION_SENT_KEY)) return;
		sessionStorage.setItem(LEAD_CONVERSION_SENT_KEY, '1');
	}

	const params = { method: 'form', currency: 'BRL', ...data };
	trackGa4Event('generate_lead', params);
	trackGoogleAdsConversion(getGoogleAdsLeadSendTo());
}

export function trackLeadThanksView(data: Record<string, unknown> = {}): void {
	pushEvent('lead_thanks_view', data);

	if (data.has_handoff) {
		trackLeadConversion(data);
	}
}
