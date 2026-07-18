import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../lib/tracking-config', () => ({
	getGoogleAdsLeadSendTo: () => 'AW-123456789/lead-label',
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

	it('tracks whatsapp_click without Google Ads send_to conversion', () => {
		trackWhatsAppClick({ product: 'Hot Beach' });

		expect(gtag).toHaveBeenCalledWith('event', 'whatsapp_click', {
			method: 'whatsapp',
			product: 'Hot Beach',
		});
		expect(gtag).not.toHaveBeenCalledWith('event', 'conversion', expect.anything());
		expect(
			window.dataLayer.filter((entry) => entry.event === 'google_ads_conversion'),
		).toHaveLength(0);
	});

	it('tracks lead conversion as generate_lead and pushes Google Ads conversion for GTM', () => {
		trackLeadConversion({ form_id: 'home-lead-form', destination: 'olimpia' });

		expect(gtag).toHaveBeenCalledWith('event', 'generate_lead', {
			method: 'form',
			currency: 'BRL',
			form_id: 'home-lead-form',
			destination: 'olimpia',
		});
		expect(gtag).not.toHaveBeenCalledWith('event', 'conversion', expect.anything());
		expect(window.dataLayer).toContainEqual({
			event: 'google_ads_conversion',
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

	it('tracks form submit with WhatsApp-mirrored payload in dataLayer without firing conversion', () => {
		const payload = {
			event: 'lead_form_submit' as const,
			source: 'google',
			h1: 'Contato',
			utm_source: 'google',
			utm_medium: 'cpc',
			utm_campaign: 'SEARCH-LEADS',
			utm_content: 'ad-a',
			utm_term: 'olimpia',
			gclid: 'gclid-1',
			gbraid: 'gbraid-1',
			wbraid: 'wbraid-1',
			fbclid: 'fbclid-1',
			page_url: 'https://tukiviagens.com.br/contato/',
			page_title: 'Contato',
			referrer: 'https://www.google.com/',
			horario_local: '03/07/2026 17:05:13',
			timestamp_iso: '2026-07-03T20:05:13.912Z',
			user_agent: 'Mozilla/5.0 Test',
			nome: 'Maria Silva',
			telefone: '(11) 98765-4321',
			email: 'maria@email.com',
			form_id: 'contato-lead-form',
			currency: 'BRL',
			value: 1.0,
		};

		trackFormSubmit(payload);

		expect(gtag).toHaveBeenCalledWith('event', 'lead_form_submit', {
			method: 'form',
			...payload,
		});
		expect(window.dataLayer).toContainEqual({
			event: 'lead_form_submit',
			method: 'form',
			...payload,
		});
		expect(gtag).not.toHaveBeenCalledWith('event', 'generate_lead', expect.anything());
		expect(gtag).not.toHaveBeenCalledWith('event', 'conversion', expect.anything());
	});
});
