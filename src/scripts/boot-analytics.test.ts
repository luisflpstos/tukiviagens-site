import { describe, expect, it, vi } from 'vitest';
import {
	bootAnalytics,
	hasAnalyticsConfig,
	type AnalyticsConfig,
} from './boot-analytics';

function createDocumentStub() {
	const appendChild = vi.fn();
	const insertBefore = vi.fn();
	const createElement = vi.fn((tag: string) => {
		const el: Record<string, unknown> = {
			tagName: tag.toUpperCase(),
			async: false,
			src: '',
			innerHTML: '',
			parentNode: { insertBefore },
		};
		return el;
	});
	const firstScript = { parentNode: { insertBefore } };

	return {
		createElement,
		getElementsByTagName: vi.fn(() => [firstScript]),
		head: { appendChild },
		body: { appendChild },
		querySelector: vi.fn(),
	} as unknown as Document;
}

describe('hasAnalyticsConfig', () => {
	it('is false when all ids are empty', () => {
		expect(hasAnalyticsConfig({})).toBe(false);
	});

	it('is true when any id is present', () => {
		expect(hasAnalyticsConfig({ gtmId: 'GTM-1' })).toBe(true);
		expect(hasAnalyticsConfig({ ga4Id: 'G-1' })).toBe(true);
		expect(hasAnalyticsConfig({ metaPixelId: '1' })).toBe(true);
	});
});

function createWindowStub() {
	return { dataLayer: undefined as unknown[] | undefined } as unknown as Window;
}

describe('bootAnalytics', () => {
	it('injects gtm script when gtmId is set', () => {
		const doc = createDocumentStub();
		const win = createWindowStub();
		const config: AnalyticsConfig = { gtmId: 'GTM-TEST' };

		bootAnalytics(config, doc, win);

		expect(doc.createElement).toHaveBeenCalledWith('script');
		const created = (doc.createElement as ReturnType<typeof vi.fn>).mock.results[0]
			?.value as { src: string; async: boolean };
		expect(created.src).toContain('googletagmanager.com/gtm.js?id=GTM-TEST');
		expect(created.async).toBe(true);
	});

	it('injects gtag when ga4Id is set', () => {
		const doc = createDocumentStub();
		const win = createWindowStub();

		bootAnalytics({ ga4Id: 'G-TEST' }, doc, win);

		const scripts = (doc.createElement as ReturnType<typeof vi.fn>).mock.results.map(
			(r) => r.value as { src: string },
		);
		expect(scripts.some((s) => s.src.includes('gtag/js?id=G-TEST'))).toBe(true);
	});

	it('does nothing when config is empty', () => {
		const doc = createDocumentStub();

		bootAnalytics({}, doc, createWindowStub());

		expect(doc.createElement).not.toHaveBeenCalled();
	});
});
