import { describe, expect, it } from 'vitest';
import { buildLeadFormSubmitPayload, buildLeadSubmitPayload } from './tracking-payload';

describe('buildLeadFormSubmitPayload', () => {
	it('monta payload limpo com dados do formulário e UTMs para dataLayer', () => {
		const payload = buildLeadFormSubmitPayload({
			formId: 'home-lead-form',
			contact: {
				nome: 'Maria Silva',
				telefone: '(11) 98765-4321',
				email: 'maria@email.com',
			},
			attribution: {
				utm_source: 'google',
				utm_medium: 'cpc',
				utm_campaign: 'SEARCH-LEADS-OLIMPIA',
				utm_term: 'hot beach olimpia',
				landing_page: '/olimpia/',
			},
		});

		expect(payload).toEqual({
			form_id: 'home-lead-form',
			nome: 'Maria Silva',
			telefone: '(11) 98765-4321',
			email: 'maria@email.com',
			utm_source: 'google',
			utm_medium: 'cpc',
			utm_campaign: 'SEARCH-LEADS-OLIMPIA',
			utm_term: 'hot beach olimpia',
		});
		expect(payload).not.toHaveProperty('landing_page');
	});

	it('usa string vazia quando UTM estiver ausente', () => {
		const payload = buildLeadFormSubmitPayload({
			formId: 'contato-lead-form',
			contact: {
				nome: 'João',
				telefone: '(17) 99999-0000',
				email: 'joao@email.com',
			},
		});

		expect(payload).toEqual({
			form_id: 'contato-lead-form',
			nome: 'João',
			telefone: '(17) 99999-0000',
			email: 'joao@email.com',
			utm_source: '',
			utm_medium: '',
			utm_campaign: '',
			utm_term: '',
		});
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
