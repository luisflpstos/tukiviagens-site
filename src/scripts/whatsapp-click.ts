import { getStoredAttribution } from './utm';
import { trackWhatsAppClick } from './tracking';
import {
	buildWhatsAppClickPayload,
	buildWhatsAppQuoteMessage,
	type WhatsAppClickPayload,
} from '../lib/whatsapp';
import { buildWhatsAppUrl } from '../lib/seo';
import { buildMetaBrowserContext, trackMetaPixelEvent } from './meta-pixel';

const META_EVENT_API_PATH = '/api/meta-event/';

function getWebhookUrl(): string | undefined {
	return import.meta.env.PUBLIC_WHATSAPP_WEBHOOK_URL || import.meta.env.PUBLIC_LEAD_WEBHOOK_URL;
}

export function sendWhatsAppClickPayload(payload: WhatsAppClickPayload): void {
	const webhookUrl = getWebhookUrl();
	if (!webhookUrl) return;

	const body = JSON.stringify(payload);

	if (navigator.sendBeacon) {
		navigator.sendBeacon(webhookUrl, new Blob([body], { type: 'application/json' }));
		return;
	}

	fetch(webhookUrl, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body,
		keepalive: true,
	}).catch(() => {});
}

/**
 * Dispara o evento Contact na Meta: Pixel no browser + CAPI via endpoint próprio,
 * ambos com o mesmo event_id para deduplicação.
 */
function sendMetaContactEvent(product: string, fbclid?: string): void {
	const metaContext = buildMetaBrowserContext();

	trackMetaPixelEvent('Contact', metaContext.event_id, { content_name: product });

	const body = JSON.stringify({
		event_name: 'Contact',
		event_id: metaContext.event_id,
		event_source_url: window.location.href,
		fbp: metaContext.fbp,
		fbc: metaContext.fbc,
		fbclid,
		content_name: product,
	});

	if (navigator.sendBeacon) {
		navigator.sendBeacon(META_EVENT_API_PATH, new Blob([body], { type: 'application/json' }));
		return;
	}

	fetch(META_EVENT_API_PATH, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body,
		keepalive: true,
	}).catch(() => {});
}

function resolveH1(element: HTMLElement): string {
	const override = element.dataset.h1?.trim();
	if (override) return override;

	return document.querySelector('h1')?.textContent?.trim() ?? '';
}

function handleWhatsAppClick(event: Event): void {
	const element = event.currentTarget;
	if (!(element instanceof HTMLAnchorElement)) return;

	const phone = element.dataset.phone?.trim();
	const product = element.dataset.product?.trim();
	if (!phone || !product) return;

	const attribution = getStoredAttribution();
	const message = buildWhatsAppQuoteMessage(product, attribution.utm_source);
	element.href = buildWhatsAppUrl(phone, message);

	const payload = buildWhatsAppClickPayload(attribution, {
		h1: resolveH1(element),
		pageUrl: window.location.href,
		pageTitle: document.title,
		userAgent: navigator.userAgent,
		referrer: document.referrer || attribution.referrer,
		product,
		campaign: element.dataset.campaign,
		buttonLabel: element.dataset.buttonLabel || element.getAttribute('aria-label') || undefined,
	});

	sendWhatsAppClickPayload(payload);
	trackWhatsAppClick(payload);
	sendMetaContactEvent(product, attribution.fbclid);
}

export function initWhatsAppLinks(): void {
	document.querySelectorAll<HTMLAnchorElement>('[data-whatsapp-link]').forEach((element) => {
		if (element.dataset.whatsappBound === 'true') return;
		element.dataset.whatsappBound = 'true';
		element.addEventListener('click', handleWhatsAppClick);
	});
}

export function observeWhatsAppLinks(): void {
	initWhatsAppLinks();

	const observer = new MutationObserver(() => {
		initWhatsAppLinks();
	});

	observer.observe(document.body, { childList: true, subtree: true });
}
