declare global {
	interface Window {
		dataLayer: Record<string, unknown>[];
	}
}

export function pushEvent(event: string, data: Record<string, unknown> = {}): void {
	window.dataLayer = window.dataLayer || [];
	window.dataLayer.push({ event, ...data });
}

export function trackWhatsAppClick(data: Record<string, unknown> = {}): void {
	pushEvent('whatsapp_click', data);
}

export function trackCtaClick(label: string, data: Record<string, unknown> = {}): void {
	pushEvent('cta_click', { cta_label: label, ...data });
}

export function trackFormStart(formId: string): void {
	pushEvent('lead_form_start', { form_id: formId });
}

export function trackFormSuccess(formId: string, data: Record<string, unknown> = {}): void {
	pushEvent('lead_form_success', { form_id: formId, ...data });
}

export function trackFormError(formId: string, error: string): void {
	pushEvent('lead_form_error', { form_id: formId, error });
}
