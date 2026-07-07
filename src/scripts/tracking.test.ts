import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../lib/tracking-config', () => ({
	getGoogleAdsLeadSendTo: () => 'AW-123456789/lead-label',
	getGoogleAdsWhatsAppSendTo: () => 'AW-123456789/whatsapp-label',
}));

import {
	trackFormSubmit,
	trackLeadConversion,
	trackLeadThanksView,
	trackWhatsAppClick,
} from './tracking';

describe('tracking conversions', () => {
	const gtag = vi.fn();
	const sessionStore: Record<string, string> = {};

	beforeEach(() => {
		gtag.mockClear();
		for (const key of Object.keys(sessionStore)) delete sessionStore[key];

		vi.stubGlobal('window', {
			dataLayer: [] as Record<string, unknown>[],
			gtag,
		});
		vi.stubGlobal('sessionStorage', {
			getItem: (key: string) => sessionStore[key] ?? null,
			setItem: (key: string, value: string) => {
				sessionStore[key] = value;
			},
			removeItem: (key: string) => {
				delete sessionStore[key];
			},
			clear: () => {
				for (const key of Object.keys(sessionStore)) delete sessionStore[key];
			},
		});
	});

	afterEach(() => {
		vi.unstubAllGlobals();
	});

	it('tracks whatsapp as GA4 event and Google Ads conversion', () => {
		trackWhatsAppClick({ product: 'Hot Beach' });

		expect(gtag).toHaveBeenCalledWith('event', 'whatsapp_click', {
			method: 'whatsapp',
			product: 'Hot Beach',
		});
		expect(gtag).toHaveBeenCalledWith('event', 'conversion', {
			send_to: 'AW-123456789/whatsapp-label',
			currency: 'BRL',
			value: 1.0,
		});
	});

	it('tracks lead conversion as generate_lead and Google Ads conversion', () => {
		trackLeadConversion({ form_id: 'home-lead-form', destination: 'olimpia' });

		expect(gtag).toHaveBeenCalledWith('event', 'generate_lead', {
			method: 'form',
			currency: 'BRL',
			form_id: 'home-lead-form',
			destination: 'olimpia',
		});
		expect(gtag).toHaveBeenCalledWith('event', 'conversion', {
			send_to: 'AW-123456789/lead-label',
			currency: 'BRL',
			value: 1.0,
		});
	});

	it('deduplicates lead conversion within the same session', () => {
		trackLeadConversion();
		trackLeadConversion();

		const generateLeadCalls = gtag.mock.calls.filter((call) => call[1] === 'generate_lead');
		expect(generateLeadCalls).toHaveLength(1);
	});

	it('fires lead conversion from thanks page only when handoff exists', () => {
		trackLeadThanksView({ has_handoff: false });
		expect(gtag).not.toHaveBeenCalledWith('event', 'generate_lead', expect.anything());

		trackLeadThanksView({ has_handoff: true, destination: 'rio-quente' });
		expect(gtag).toHaveBeenCalledWith(
			'event',
			'generate_lead',
			expect.objectContaining({ destination: 'rio-quente' }),
		);
	});

	it('tracks form submit without firing conversion', () => {
		trackFormSubmit('contato-lead-form');

		expect(gtag).toHaveBeenCalledWith('event', 'lead_form_submit', { form_id: 'contato-lead-form' });
		expect(gtag).not.toHaveBeenCalledWith('event', 'generate_lead', expect.anything());
		expect(gtag).not.toHaveBeenCalledWith('event', 'conversion', expect.anything());
	});
});
