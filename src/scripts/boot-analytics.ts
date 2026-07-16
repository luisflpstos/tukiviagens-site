export type AnalyticsConfig = {
	gtmId?: string;
	ga4Id?: string;
	googleAdsId?: string;
	metaPixelId?: string;
};

export function hasAnalyticsConfig(config: AnalyticsConfig): boolean {
	return Boolean(config.gtmId || config.ga4Id || config.googleAdsId || config.metaPixelId);
}

function injectScript(doc: Document, src: string): void {
	const script = doc.createElement('script');
	script.async = true;
	script.src = src;
	const first = doc.getElementsByTagName('script')[0];
	if (first?.parentNode) {
		first.parentNode.insertBefore(script, first);
		return;
	}
	(doc.head ?? doc.body).appendChild(script);
}

function bootGtm(gtmId: string, doc: Document, win: Window & { dataLayer?: unknown[] }): void {
	win.dataLayer = win.dataLayer || [];
	win.dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' });
	injectScript(doc, `https://www.googletagmanager.com/gtm.js?id=${gtmId}`);
}

function bootGtag(
	config: AnalyticsConfig,
	doc: Document,
	win: Window & { dataLayer?: unknown[]; gtag?: (...args: unknown[]) => void },
): void {
	const primaryId = config.ga4Id || config.googleAdsId;
	if (!primaryId) return;

	injectScript(doc, `https://www.googletagmanager.com/gtag/js?id=${primaryId}`);
	win.dataLayer = win.dataLayer || [];
	win.gtag = function gtag(...args: unknown[]) {
		win.dataLayer?.push(args);
	};
	win.gtag('js', new Date());
	if (config.ga4Id) win.gtag('config', config.ga4Id);
	if (config.googleAdsId) win.gtag('config', config.googleAdsId);
}

function bootMetaPixel(
	pixelId: string,
	doc: Document,
	win: Window & { fbq?: (...args: unknown[]) => void; _fbq?: unknown },
): void {
	if (win.fbq) return;

	const fbq = function (...args: unknown[]) {
		(fbq as { callMethod?: (...a: unknown[]) => void; queue: unknown[] }).callMethod
			? (fbq as { callMethod: (...a: unknown[]) => void }).callMethod(...args)
			: (fbq as { queue: unknown[] }).queue.push(args);
	} as ((...args: unknown[]) => void) & {
		callMethod?: (...a: unknown[]) => void;
		queue: unknown[];
		push: (...args: unknown[]) => void;
		loaded: boolean;
		version: string;
	};

	fbq.queue = [];
	fbq.push = fbq;
	fbq.loaded = true;
	fbq.version = '2.0';
	win.fbq = fbq;
	win._fbq = fbq;

	injectScript(doc, 'https://connect.facebook.net/en_US/fbevents.js');
	fbq('init', pixelId);
	fbq('track', 'PageView');
}

/**
 * Injects GTM / gtag / Meta Pixel after the critical path (caller schedules idle).
 */
export function bootAnalytics(
	config: AnalyticsConfig,
	doc: Document = document,
	win: Window = window,
): void {
	if (!hasAnalyticsConfig(config)) return;

	if (config.gtmId) {
		bootGtm(config.gtmId, doc, win as Window & { dataLayer?: unknown[] });
	}

	if (config.ga4Id || config.googleAdsId) {
		bootGtag(config, doc, win as Window & { dataLayer?: unknown[]; gtag?: (...args: unknown[]) => void });
	}

	if (config.metaPixelId) {
		bootMetaPixel(
			config.metaPixelId,
			doc,
			win as Window & { fbq?: (...args: unknown[]) => void; _fbq?: unknown },
		);
	}
}
