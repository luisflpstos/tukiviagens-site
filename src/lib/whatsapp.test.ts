import { describe, expect, it } from 'vitest';
import {
	buildWhatsAppClickPayload,
	buildWhatsAppQuoteMessage,
	formatLocalTimestamp,
	formatUtmSourceLabel,
} from './whatsapp';
import type { StoredAttribution } from '../scripts/utm';

describe('formatUtmSourceLabel', () => {
	it('maps google to "no Google"', () => {
		expect(formatUtmSourceLabel('google')).toBe('no Google');
	});

	it('maps facebook and meta to "no Facebook"', () => {
		expect(formatUtmSourceLabel('facebook')).toBe('no Facebook');
		expect(formatUtmSourceLabel('meta')).toBe('no Facebook');
	});

	it('maps instagram to "no Instagram"', () => {
		expect(formatUtmSourceLabel('instagram')).toBe('no Instagram');
	});

	it('falls back to "em {source}" for unknown sources', () => {
		expect(formatUtmSourceLabel('taboola')).toBe('em taboola');
	});

	it('returns "no site" when source is empty', () => {
		expect(formatUtmSourceLabel(undefined)).toBe('no site');
		expect(formatUtmSourceLabel('')).toBe('no site');
	});

	it('is case-insensitive', () => {
		expect(formatUtmSourceLabel('Google')).toBe('no Google');
	});
});

describe('buildWhatsAppQuoteMessage', () => {
	it('builds message with Google source', () => {
		expect(
			buildWhatsAppQuoteMessage('Hotel Giardino Rio Quente | Hot Park incluso', 'google'),
		).toBe(
			'Olá! Vi no Google e gostaria de uma cotação: Hotel Giardino Rio Quente | Hot Park incluso.',
		);
	});

	it('builds message without UTM', () => {
		expect(buildWhatsAppQuoteMessage('Enjoy Solar das Águas')).toBe(
			'Olá! Vi no site e gostaria de uma cotação: Enjoy Solar das Águas.',
		);
	});
});

describe('formatLocalTimestamp', () => {
	it('formats date in pt-BR São Paulo timezone', () => {
		const date = new Date('2026-07-03T20:05:13.912Z');
		expect(formatLocalTimestamp(date)).toBe('03/07/2026 17:05:13');
	});
});

describe('buildWhatsAppClickPayload', () => {
	const attribution: StoredAttribution = {
		utm_source: 'google',
		utm_medium: 'cpc',
		utm_campaign: 'SEARCH-LEADS-WHATSAPP-OLIMPIA-Enjoy-Solar',
		utm_content: 'agencia-cotacao-nova-hospedagem',
		utm_term: '',
		gclid: 'CjwKCAjwu53SBhAhEiwAJzSLNsdP4',
		gbraid: '0AAAABBQtrB2a_vPWwogpSOQWDvB1vk_Vp',
		wbraid: '',
		fbclid: '',
		referrer: 'https://www.google.com/',
	};

	const context = {
		h1: 'Enjoy Solar das\nÁguas Park Resort de Olímpia',
		pageUrl: 'https://olimtour.com.br/enjoy-solar-park-resort/?utm_source=google',
		pageTitle: 'Enjoy Solar das Águas Park Resort – AGÊNCIA OLIM TOUR',
		userAgent: 'Mozilla/5.0 Test',
		product: 'Enjoy Solar das Águas',
		campaign: 'google-search-enjoy-solar',
		clickedAt: new Date('2026-07-03T20:05:13.912Z'),
	};

	it('builds full tracking payload', () => {
		const payload = buildWhatsAppClickPayload(attribution, context);

		expect(payload).toEqual({
			event: 'whatsapp_click',
			source: 'google',
			h1: 'Enjoy Solar das\nÁguas Park Resort de Olímpia',
			utm_source: 'google',
			utm_medium: 'cpc',
			utm_campaign: 'SEARCH-LEADS-WHATSAPP-OLIMPIA-Enjoy-Solar',
			utm_content: 'agencia-cotacao-nova-hospedagem',
			utm_term: '',
			gclid: 'CjwKCAjwu53SBhAhEiwAJzSLNsdP4',
			gbraid: '0AAAABBQtrB2a_vPWwogpSOQWDvB1vk_Vp',
			wbraid: '',
			fbclid: '',
			page_url: 'https://olimtour.com.br/enjoy-solar-park-resort/?utm_source=google',
			page_title: 'Enjoy Solar das Águas Park Resort – AGÊNCIA OLIM TOUR',
			referrer: 'https://www.google.com/',
			horario_local: '03/07/2026 17:05:13',
			timestamp_iso: '2026-07-03T20:05:13.912Z',
			user_agent: 'Mozilla/5.0 Test',
			product: 'Enjoy Solar das Águas',
			campaign: 'google-search-enjoy-solar',
		});
	});

	it('uses "direct" when utm_source is missing', () => {
		const payload = buildWhatsAppClickPayload({}, context);
		expect(payload.source).toBe('direct');
		expect(payload.utm_source).toBe('');
	});
});
