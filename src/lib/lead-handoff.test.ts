import { describe, expect, it } from 'vitest';
import { buildThanksWhatsAppMessage, type LeadHandoff } from './lead-handoff';

const fullHandoff: LeadHandoff = {
	nome: 'Maria Silva',
	hotel: 'Hot Beach Resort',
	destination: 'Olímpia',
	data_entrada: '2026-07-10',
	data_saida: '2026-07-12',
	adultos: 2,
	criancas: 1,
	saved_at: new Date().toISOString(),
};

describe('buildThanksWhatsAppMessage', () => {
	it('monta mensagem personalizada com hotel, datas, hóspedes e UTM', () => {
		const message = buildThanksWhatsAppMessage(fullHandoff, { utm_source: 'google' });

		expect(message).toContain('Hot Beach Resort em Olímpia');
		expect(message).toContain('entrada 10/07/2026 e saída 12/07/2026');
		expect(message).toContain('2 adultos e 1 criança');
		expect(message).toContain('Vi no Google');
		expect(message).toContain('Pode agilizar meu atendimento?');
	});

	it('usa fallback de origem sem UTM', () => {
		const message = buildThanksWhatsAppMessage(fullHandoff, {});
		expect(message).toContain('Vi no site');
	});

	it('formata singular de adultos e crianças', () => {
		const message = buildThanksWhatsAppMessage(
			{ ...fullHandoff, adultos: 1, criancas: 1 },
			{ utm_source: 'google' },
		);
		expect(message).toContain('1 adulto e 1 criança');
	});

	it('omite crianças quando zero', () => {
		const message = buildThanksWhatsAppMessage(
			{ ...fullHandoff, criancas: 0 },
			{ utm_source: 'google' },
		);
		expect(message).toContain('2 adultos');
		expect(message).not.toContain('criança');
	});

	it('usa mensagem genérica sem handoff', () => {
		const message = buildThanksWhatsAppMessage(null, { utm_source: 'google' });
		expect(message).toContain('Acabei de enviar uma cotação pelo site');
		expect(message).toContain('Vi no Google');
		expect(message).toContain('agilizar meu atendimento');
	});
});
