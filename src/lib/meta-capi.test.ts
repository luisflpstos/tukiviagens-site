import { describe, expect, it } from 'vitest';
import {
	buildFbcFromFbclid,
	buildMetaServerEvent,
	buildMetaUserData,
	normalizeEmail,
	normalizePhoneBr,
	sha256,
	splitFullName,
} from './meta-capi';

describe('normalizeEmail', () => {
	it('normaliza para minúsculas e remove espaços', () => {
		expect(normalizeEmail('  Maria@Example.COM ')).toBe('maria@example.com');
	});

	it('retorna undefined para vazio', () => {
		expect(normalizeEmail('')).toBeUndefined();
		expect(normalizeEmail(undefined)).toBeUndefined();
	});
});

describe('normalizePhoneBr', () => {
	it('adiciona DDI 55 quando ausente', () => {
		expect(normalizePhoneBr('(11) 99999-8888')).toBe('5511999998888');
	});

	it('mantém DDI 55 existente', () => {
		expect(normalizePhoneBr('+55 11 99999-8888')).toBe('5511999998888');
	});

	it('rejeita telefones curtos demais', () => {
		expect(normalizePhoneBr('9999')).toBeUndefined();
	});
});

describe('splitFullName', () => {
	it('divide nome completo em primeiro e último nome', () => {
		expect(splitFullName('Maria da Silva Souza')).toEqual({
			firstName: 'Maria',
			lastName: 'Souza',
		});
	});

	it('lida com nome único', () => {
		expect(splitFullName('Maria')).toEqual({ firstName: 'Maria' });
	});

	it('lida com vazio', () => {
		expect(splitFullName(undefined)).toEqual({});
	});
});

describe('buildFbcFromFbclid', () => {
	it('monta o fbc no formato fb.1.{timestamp}.{fbclid}', () => {
		expect(buildFbcFromFbclid('abc123', 1700000000000)).toBe('fb.1.1700000000000.abc123');
	});

	it('retorna undefined sem fbclid', () => {
		expect(buildFbcFromFbclid(undefined)).toBeUndefined();
		expect(buildFbcFromFbclid('  ')).toBeUndefined();
	});
});

describe('buildMetaUserData', () => {
	it('hasheia PII com SHA-256 e mantém fbp/fbc/ip/ua em texto', () => {
		const userData = buildMetaUserData({
			email: 'Maria@Example.com',
			phone: '(11) 99999-8888',
			fullName: 'Maria Souza',
			city: 'São Paulo',
			state: 'SP',
			country: 'BR',
			clientIpAddress: '203.0.113.7',
			clientUserAgent: 'Mozilla/5.0',
			fbp: 'fb.1.1700000000000.111',
			fbc: 'fb.1.1700000000000.abc',
		});

		expect(userData.em).toEqual([sha256('maria@example.com')]);
		expect(userData.ph).toEqual([sha256('5511999998888')]);
		expect(userData.fn).toEqual([sha256('maria')]);
		expect(userData.ln).toEqual([sha256('souza')]);
		expect(userData.st).toEqual([sha256('sp')]);
		expect(userData.country).toEqual([sha256('br')]);
		expect(userData.client_ip_address).toBe('203.0.113.7');
		expect(userData.client_user_agent).toBe('Mozilla/5.0');
		expect(userData.fbp).toBe('fb.1.1700000000000.111');
		expect(userData.fbc).toBe('fb.1.1700000000000.abc');
	});

	it('deriva fbc do fbclid quando o cookie não existe', () => {
		const userData = buildMetaUserData({ fbclid: 'xyz789' });
		expect(userData.fbc).toMatch(/^fb\.1\.\d+\.xyz789$/);
	});

	it('prioriza o cookie _fbc sobre o fbclid', () => {
		const userData = buildMetaUserData({ fbc: 'fb.1.1.cookie', fbclid: 'xyz789' });
		expect(userData.fbc).toBe('fb.1.1.cookie');
	});

	it('omite campos ausentes', () => {
		expect(buildMetaUserData({})).toEqual({});
	});
});

describe('buildMetaServerEvent', () => {
	it('monta o evento com action_source website e event_id', () => {
		const event = buildMetaServerEvent({
			eventName: 'Lead',
			eventId: 'evt-1',
			eventTime: 1700000000,
			eventSourceUrl: 'https://www.tukiviagens.com.br/lp/olimpia/',
			userData: { email: 'a@b.com' },
			customData: { content_name: 'Hotel X' },
		});

		expect(event.event_name).toBe('Lead');
		expect(event.event_id).toBe('evt-1');
		expect(event.event_time).toBe(1700000000);
		expect(event.action_source).toBe('website');
		expect(event.event_source_url).toBe('https://www.tukiviagens.com.br/lp/olimpia/');
		expect(event.user_data.em).toHaveLength(1);
		expect(event.custom_data).toEqual({ content_name: 'Hotel X' });
	});

	it('omite custom_data vazio', () => {
		const event = buildMetaServerEvent({
			eventName: 'Contact',
			eventId: 'evt-2',
			userData: {},
			customData: {},
		});

		expect(event.custom_data).toBeUndefined();
		expect(event.event_time).toBeGreaterThan(1_700_000_000);
	});
});
