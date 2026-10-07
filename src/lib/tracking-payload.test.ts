import { describe, expect, it } from 'vitest';
import {
	buildHashedUserData,
	buildLeadFormSubmitPayload,
	buildLeadSubmitPayload,
	normalizeEmailForAds,
	normalizePhoneForAds,
} from './tracking-payload';

describe('buildLeadFormSubmitPayload', () => {
	const attribution = {
		utm_source: 'google',
		utm_medium: 'cpc',
		utm_campaign: 'SEARCH-LEADS-OLIMPIA',
		utm_content: 'agencia-cotacao',
		utm_term: 'hot beach olimpia',
		gclid: 'CjwKCAjwGclid',
		gbraid: '0AAAABBQgbraid',
		wbraid: '0AAAABBQwbraid',
		fbclid: 'IwAR0fbclid',
		referrer: 'https://www.google.com/',
		landing_page: '/olimpia/',
	};

	const context = {
		h1: 'Hot Beach Resort de Olímpia',
		pageUrl: 'https://tukiviagens.com.br/olimpia/hot-beach-resort/?utm_source=google',
		pageTitle: 'Hot Beach Resort – Tuki Viagens',
		userAgent: 'Mozilla/5.0 Test',
		product: 'Hot Beach Resort',
		campaign: 'hotel-hot-beach',
		submittedAt: new Date('2026-07-03T20:05:13.912Z'),
	};

	it('espelha a estrutura completa do whatsapp_click com dados do formulário', () => {
		const payload = buildLeadFormSubmitPayload({
			formId: 'home-lead-form',
			attribution,
			context,
		});

		expect(payload).toEqual({
			event: 'lead_form_submit',
			source: 'google',
			h1: 'Hot Beach Resort de Olímpia',
			utm_source: 'google',
			utm_medium: 'cpc',
			utm_campaign: 'SEARCH-LEADS-OLIMPIA',
			utm_content: 'agencia-cotacao',
			utm_term: 'hot beach olimpia',
			gclid: 'CjwKCAjwGclid',
			gbraid: '0AAAABBQgbraid',
			wbraid: '0AAAABBQwbraid',
			fbclid: 'IwAR0fbclid',
			page_url: 'https://tukiviagens.com.br/olimpia/hot-beach-resort/?utm_source=google',
			page_title: 'Hot Beach Resort – Tuki Viagens',
			referrer: 'https://www.google.com/',
			horario_local: '03/07/2026 17:05:13',
			timestamp_iso: '2026-07-03T20:05:13.912Z',
			user_agent: 'Mozilla/5.0 Test',
			form_id: 'home-lead-form',
			product: 'Hot Beach Resort',
			campaign: 'hotel-hot-beach',
			currency: 'BRL',
			value: 1.0,
		});
		expect(payload).not.toHaveProperty('landing_page');
	});

	it('não inclui nome, telefone nem e-mail (PII proibida em eventos GA4/Ads)', () => {
		const payload = buildLeadFormSubmitPayload({ formId: 'home-lead-form', attribution, context });

		for (const key of ['nome', 'telefone', 'email', 'name', 'phone']) {
			expect(payload).not.toHaveProperty(key);
		}
	});

	it('usa source direct e strings vazias quando atribuição estiver ausente', () => {
		const payload = buildLeadFormSubmitPayload({
			formId: 'contato-lead-form',
			context: {
				h1: 'Contato',
				pageUrl: 'https://tukiviagens.com.br/contato/',
				pageTitle: 'Contato',
				userAgent: 'Mozilla/5.0 Test',
				submittedAt: new Date('2026-07-03T20:05:13.912Z'),
			},
		});

		expect(payload.source).toBe('direct');
		expect(payload.utm_source).toBe('');
		expect(payload.gclid).toBe('');
		expect(payload.fbclid).toBe('');
		expect(payload.product).toBeUndefined();
		expect(payload.campaign).toBeUndefined();
		expect(payload.currency).toBe('BRL');
		expect(payload.value).toBe(1.0);
	});
});

describe('buildLeadSubmitPayload', () => {
	const fields = {
		nome: 'Maria Silva',
		telefone: '(11) 98765-4321',
		email: 'maria@email.com',
		data_entrada: '2026-07-10',
		data_saida: '2026-07-12',
		adultos: 2,
		criancas: 1,
	};

	const attribution = {
		utm_source: 'google',
		utm_medium: 'cpc',
		utm_campaign: 'SEARCH-LEADS-OLIMPIA',
		utm_content: 'agencia-cotacao',
		utm_term: '',
		gclid: 'CjwKCAjwu53SBhAhEiwAJzSLNsdP4',
		gbraid: '0AAAABBQtrB2a_vPWwogpSOQWDvB1vk_Vp',
		wbraid: '',
		fbclid: '',
		referrer: 'https://www.google.com/',
		current_url: 'https://tukiviagens.com.br/olimpia/hot-beach-resort/?utm_source=google',
	};

	const context = {
		hotel: 'Hot Beach Resort',
		destination: 'Olímpia',
		campaign: 'hotel-hot-beach',
		form_id: 'hotel-lead-form',
		h1: 'Hot Beach Resort de Olímpia',
		page_url: 'https://tukiviagens.com.br/olimpia/hot-beach-resort/?utm_source=google',
		page_title: 'Hot Beach Resort – Tuki Viagens',
	};

	const submittedAt = new Date('2026-07-03T20:05:13.912Z');

	it('monta payload plano no padrão do WhatsApp', () => {
		const payload = buildLeadSubmitPayload({
			fields,
			attribution,
			context,
			geo: {
				cidade: 'São Paulo',
				regiao: 'SP',
				pais: 'BR',
				cep: 'SP-São Paulo',
				latitude: '-23.55',
				longitude: '-46.63',
			},
			submittedAt,
			userAgent: 'Mozilla/5.0 Test',
			referrer: 'https://www.google.com/',
		});

		expect(payload).toEqual({
			event: 'lead_submit',
			source: 'google',
			h1: 'Hot Beach Resort de Olímpia',
			utm_source: 'google',
			utm_medium: 'cpc',
			utm_campaign: 'SEARCH-LEADS-OLIMPIA',
			utm_content: 'agencia-cotacao',
			utm_term: '',
			gclid: 'CjwKCAjwu53SBhAhEiwAJzSLNsdP4',
			gbraid: '0AAAABBQtrB2a_vPWwogpSOQWDvB1vk_Vp',
			wbraid: '',
			fbclid: '',
			page_url: 'https://tukiviagens.com.br/olimpia/hot-beach-resort/?utm_source=google',
			page_title: 'Hot Beach Resort – Tuki Viagens',
			referrer: 'https://www.google.com/',
			local_time: '03/07/2026 17:05:13',
			timestamp_iso: '2026-07-03T20:05:13.912Z',
			user_agent: 'Mozilla/5.0 Test',
			name: 'Maria Silva',
			phone: '5511987654321',
			email: 'maria@email.com',
			check_in_date: '2026-07-10',
			check_out_date: '2026-07-12',
			adults: 2,
			children: 1,
			product: 'Hot Beach Resort',
			campaign: 'hotel-hot-beach',
			form_id: 'hotel-lead-form',
			destination: 'Olímpia',
			city: 'São Paulo',
			state: 'SP',
			country: 'BR',
			postal_code: 'SP-São Paulo',
		});
	});

	it('normaliza phone com prefixo 55 + DDD + número', () => {
		const payload = buildLeadSubmitPayload({
			fields: { ...fields, telefone: '(17) 98208-1786' },
		});

		expect(payload.phone).toBe('5517982081786');
	});

	it('mantém phone que já inclui 55', () => {
		const payload = buildLeadSubmitPayload({
			fields: { ...fields, telefone: '551721901358' },
		});

		expect(payload.phone).toBe('551721901358');
	});
});

describe('Enhanced Conversions user data', () => {
	it('normaliza e-mail (minúsculas; sem pontos no usuário do Gmail)', () => {
		expect(normalizeEmailForAds('  Maria@Email.com ')).toBe('maria@email.com');
		expect(normalizeEmailForAds('Joao.Silva@gmail.com')).toBe('joaosilva@gmail.com');
		expect(normalizeEmailForAds('joao.silva@empresa.com.br')).toBe('joao.silva@empresa.com.br');
		expect(normalizeEmailForAds('sem-arroba')).toBeUndefined();
	});

	it('normaliza telefone BR para E.164 com +', () => {
		expect(normalizePhoneForAds('(11) 98765-4321')).toBe('+5511987654321');
		expect(normalizePhoneForAds('(17) 2190-1358')).toBe('+551721901358');
		expect(normalizePhoneForAds('+55 11 98765-4321')).toBe('+5511987654321');
		// DDD 55 (RS) sem código do país não pode ser confundido com o +55.
		expect(normalizePhoneForAds('(55) 99999-8888')).toBe('+5555999998888');
		expect(normalizePhoneForAds('123')).toBeUndefined();
	});

	it('gera hashes SHA-256 hex dos valores normalizados', async () => {
		expect(
			await buildHashedUserData({ email: 'Maria@Email.com', telefone: '(11) 98765-4321' }),
		).toEqual({
			sha256_email_address: '25dd9496706c28b2cb132c9101c2a73768634a9d8a870ffd6e666157be937d85',
			sha256_phone_number: '38225ec3dccec4189659c110ddc4f3dc9c27539850cb6a9ddae31ae03a5cf441',
		});
		expect(await buildHashedUserData({ email: 'joao.silva@gmail.com', telefone: '' })).toEqual({
			sha256_email_address: '9119b3dd895707ae9aa81f2e338994504566fee2a8e9e2482514b323050a48c6',
		});
	});
});
