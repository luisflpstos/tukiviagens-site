import { describe, expect, it } from 'vitest';
import { leadFormFieldsSchema } from './lead-schema';

function futureDate(daysFromNow: number): string {
	const date = new Date();
	date.setDate(date.getDate() + daysFromNow);
	return date.toISOString().slice(0, 10);
}

describe('leadFormFieldsSchema', () => {
	const validPayload = {
		nome: 'Maria Silva',
		telefone: '(11) 98765-4321',
		email: 'maria@email.com',
		data_entrada: futureDate(7),
		data_saida: futureDate(10),
		adultos: 2,
		criancas: 1,
	};

	it('aceita payload válido', () => {
		expect(leadFormFieldsSchema.safeParse(validPayload).success).toBe(true);
	});

	it('rejeita nome curto', () => {
		const result = leadFormFieldsSchema.safeParse({ ...validPayload, nome: 'A' });
		expect(result.success).toBe(false);
	});

	it('rejeita telefone inválido', () => {
		const result = leadFormFieldsSchema.safeParse({ ...validPayload, telefone: '123' });
		expect(result.success).toBe(false);
	});

	it('rejeita e-mail inválido', () => {
		const result = leadFormFieldsSchema.safeParse({ ...validPayload, email: 'invalido' });
		expect(result.success).toBe(false);
	});

	it('rejeita saída anterior ou igual à entrada', () => {
		const result = leadFormFieldsSchema.safeParse({
			...validPayload,
			data_entrada: futureDate(10),
			data_saida: futureDate(7),
		});
		expect(result.success).toBe(false);
	});

	it('rejeita campos acima de 120 caracteres', () => {
		const result = leadFormFieldsSchema.safeParse({
			...validPayload,
			nome: 'a'.repeat(121),
		});
		expect(result.success).toBe(false);
	});
});
