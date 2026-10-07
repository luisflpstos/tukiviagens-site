import { getGoogleAdsLeadSendTo } from '../lib/tracking-config';
import type { HashedUserData, LeadFormSubmitTrackingPayload } from '../lib/tracking-payload';

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
}

export function trackCtaClick(label: string, data: Record<string, unknown> = {}): void {
	pushEvent('cta_click', { cta_label: label, ...data });
}

export function trackFormStart(formId: string): void {
	pushEvent('lead_form_start', { form_id: formId });
}

/**
 * `lead_form_submit` sem PII em texto claro. E-mail/telefone só vão hasheados em `user_data`,
 * e apenas no dataLayer (para Enhanced Conversions no GTM) — nunca como parâmetro de evento.
 */
export function trackFormSubmit(
	payload: LeadFormSubmitTrackingPayload,
	userData: HashedUserData = {},
): void {
	const params = { method: 'form', ...payload };
	window.gtag?.('event', 'lead_form_submit', params);
	pushDataLayer(
		'lead_form_submit',
		Object.keys(userData).length > 0 ? { ...params, user_data: userData } : params,
	);
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
