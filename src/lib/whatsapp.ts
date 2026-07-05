import { buildWhatsAppUrl } from './seo';
import type { StoredAttribution } from '../scripts/utm';
import { buildTrackingFields, formatLocalTimestamp } from './tracking-payload';

export { formatLocalTimestamp };

const SOURCE_LABELS: Record<string, string> = {
	google: 'no Google',
	facebook: 'no Facebook',
	meta: 'no Facebook',
	instagram: 'no Instagram',
	bing: 'no Bing',
	tiktok: 'no TikTok',
	email: 'no e-mail',
	organic: 'na busca orgânica',
};

export function formatUtmSourceLabel(utmSource?: string): string {
	if (!utmSource?.trim()) return 'no site';
	return SOURCE_LABELS[utmSource.toLowerCase()] ?? `em ${utmSource}`;
}

export function buildWhatsAppQuoteMessage(productName: string, utmSource?: string): string {
	const source = formatUtmSourceLabel(utmSource);
	return `Olá! Vi ${source} e gostaria de uma cotação: ${productName}.`;
}

export function buildWhatsAppFallbackUrl(phone: string, productName: string): string {
	return buildWhatsAppUrl(phone, buildWhatsAppQuoteMessage(productName));
}

export interface WhatsAppClickContext {
	h1: string;
	pageUrl: string;
	pageTitle: string;
	userAgent: string;
	referrer?: string;
	product?: string;
	campaign?: string;
	buttonLabel?: string;
	clickedAt?: Date;
}

export interface WhatsAppClickPayload {
	event: 'whatsapp_click';
	source: string;
	h1: string;
	utm_source: string;
	utm_medium: string;
	utm_campaign: string;
	utm_content: string;
	utm_term: string;
	gclid: string;
	gbraid: string;
	wbraid: string;
	fbclid: string;
	page_url: string;
	page_title: string;
	referrer: string;
	horario_local: string;
	timestamp_iso: string;
	user_agent: string;
	product?: string;
	campaign?: string;
	button_label?: string;
}

function empty(value?: string): string {
	return value ?? '';
}

export function buildWhatsAppClickPayload(
	attribution: StoredAttribution,
	context: WhatsAppClickContext,
): WhatsAppClickPayload {
	const clickedAt = context.clickedAt ?? new Date();
	const tracking = buildTrackingFields(attribution);

	return {
		event: 'whatsapp_click',
		...tracking,
		h1: context.h1,
		page_url: context.pageUrl,
		page_title: context.pageTitle,
		referrer: context.referrer ?? empty(attribution.referrer),
		horario_local: formatLocalTimestamp(clickedAt),
		timestamp_iso: clickedAt.toISOString(),
		user_agent: context.userAgent,
		...(context.product ? { product: context.product } : {}),
		...(context.campaign ? { campaign: context.campaign } : {}),
		...(context.buttonLabel ? { button_label: context.buttonLabel } : {}),
	};
}
