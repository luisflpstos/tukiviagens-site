import { describe, expect, it } from 'vitest';
import { MIN_STAY_DAYS } from './date-rules';
import {
	hasLeadStayFields,
	parseLeadSubmissionFields,
	leadContactFieldsSchema,
	leadFormFieldsSchema,
	leadSubmissionSchema,
} from './lead-schema';

describe('leadContactFieldsSchema', () => {
	const validContact = {
		nome: 'Maria Silva',
		telefone: '(11) 98765-4321',
		email: 'maria@email.com',
	};

	it('aceita contato válido sem datas nem hóspedes', () => {
		expect(leadContactFieldsSchema.safeParse(validContact).success).toBe(true);
	});

	it('rejeita nome curto', () => {
		expect(leadContactFieldsSchema.safeParse({ ...validContact, nome: 'A' }).success).toBe(false);
	});

	it('rejeita telefone inválido', () => {
		expect(leadContactFieldsSchema.safeParse({ ...validContact, telefone: '123' }).success).toBe(
			false,
		);
	});

	it('rejeita e-mail inválido', () => {
		expect(leadContactFieldsSchema.safeParse({ ...validContact, email: 'x' }).success).toBe(false);
	});
});

describe('hasLeadStayFields', () => {
	it('detecta formulário completo', () => {
		expect(
			hasLeadStayFields({
				data_entrada: '2026-08-01',
				data_saida: '2026-08-05',
				adultos: 2,
				criancas: 0,
			}),
		).toBe(true);
	});

	it('detecta formulário só de contato', () => {
		expect(hasLeadStayFields({})).toBe(false);
		expect(
			hasLeadStayFields({
				data_entrada: '',
				data_saida: '',
				adultos: '',
				criancas: '',
			}),
		).toBe(false);
	});
});

function futureDate(daysFromNow: number): string {
	const date = new Date();
	date.setDate(date.getDate() + daysFromNow);
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const day = String(date.getDate()).padStart(2, '0');
	return `${year}-${month}-${day}`;
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

	it('rejeita entrada antes de amanhã', () => {
		const result = leadFormFieldsSchema.safeParse({
			...validPayload,
			data_entrada: futureDate(0),
			data_saida: futureDate(3),
		});
		expect(result.success).toBe(false);
	});

	it('rejeita estadia menor que o mínimo', () => {
		const result = leadFormFieldsSchema.safeParse({
			...validPayload,
			data_entrada: futureDate(1),
			data_saida: futureDate(2),
		});
		expect(result.success).toBe(false);
	});

	it(`aceita estadia de ${MIN_STAY_DAYS} dias`, () => {
		const result = leadFormFieldsSchema.safeParse({
			...validPayload,
			data_entrada: futureDate(1),
			data_saida: futureDate(1 + MIN_STAY_DAYS),
		});
		expect(result.success).toBe(true);
	});

	it('rejeita campos acima de 120 caracteres', () => {
		const result = leadFormFieldsSchema.safeParse({
			...validPayload,
			nome: 'a'.repeat(121),
		});
		expect(result.success).toBe(false);
	});
});

describe('leadSubmissionSchema', () => {
	const basePayload = {
		nome: 'Maria Silva',
		telefone: '(11) 98765-4321',
		email: 'maria@email.com',
		data_entrada: '2026-08-01',
		data_saida: '2026-08-05',
		adultos: 2,
		criancas: 0,
	};

	it('aceita attribution com URL longa e click IDs', () => {
		const longUrl =
			'https://www.tukiviagens.com.br/olimpia/hot-beach-resort/?utm_source=google&utm_medium=cpc&utm_campaign=' +
			'resorts-olimpia-2024&utm_content=ad-variant-a&gclid=' +
			'CjwKCAjw'.repeat(20);

		const result = leadSubmissionSchema.safeParse({
			...basePayload,
			attribution: {
				current_url: longUrl,
				referrer: longUrl,
				gclid: 'CjwKCAjw'.repeat(30),
			},
		});

		expect(result.success).toBe(true);
	});
});

describe('parseLeadSubmissionFields', () => {
	it('ignores envelope keys (_hp, attribution, context, meta) when validating stay fields', () => {
		// Regression: leadFormFieldsSchema.strict() on the whole envelope returned
		// Unrecognized keys: "_hp", "attribution", "context", "meta".
		const envelope = leadSubmissionSchema.parse({
			nome: 'Maria Silva',
			telefone: '(11) 98765-4321',
			email: 'maria@email.com',
			data_entrada: '2026-08-01',
			data_saida: '2026-08-05',
			adultos: 2,
			criancas: 0,
			_hp: '',
			attribution: { utm_source: 'google' },
			context: { form_id: 'pagina-lead-form', hotel: 'Enjoy' },
			meta: { event_id: 'evt-1', fbp: 'fb.1' },
		});

		const result = parseLeadSubmissionFields(envelope);
		expect(result.success).toBe(true);
		if (!result.success) return;
		expect(result.data).toMatchObject({
			nome: 'Maria Silva',
			email: 'maria@email.com',
			data_entrada: '2026-08-01',
			adultos: 2,
			criancas: 0,
		});
		expect(result.data).not.toHaveProperty('_hp');
		expect(result.data).not.toHaveProperty('attribution');
	});

	it('parses contact-only submissions without stay fields', () => {
		const envelope = leadSubmissionSchema.parse({
			nome: 'Maria Silva',
			telefone: '(11) 98765-4321',
			email: 'maria@email.com',
			_hp: '',
			context: { form_id: 'sticky' },
		});

		const result = parseLeadSubmissionFields(envelope);
		expect(result.success).toBe(true);
		if (!result.success) return;
		expect(result.data).toEqual({
			nome: 'Maria Silva',
			telefone: '(11) 98765-4321',
			email: 'maria@email.com',
		});
	});
});
