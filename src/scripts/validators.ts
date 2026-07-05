import { LEAD_FIELD_MAX_LENGTH } from '../lib/lead-config';
import { leadFormFieldsSchema } from '../lib/lead-schema';

export { LEAD_FIELD_MAX_LENGTH };

export function validateName(name: string): string | null {
	const result = leadFormFieldsSchema.shape.nome.safeParse(name);
	return result.success ? null : (result.error.issues[0]?.message ?? 'Nome inválido.');
}

export function validatePhone(phone: string): string | null {
	const result = leadFormFieldsSchema.shape.telefone.safeParse(phone);
	return result.success ? null : (result.error.issues[0]?.message ?? 'Telefone inválido.');
}

export function validateEmail(email: string): string | null {
	const result = leadFormFieldsSchema.shape.email.safeParse(email);
	return result.success ? null : (result.error.issues[0]?.message ?? 'E-mail inválido.');
}

export function validateDateField(value: string, field: 'data_entrada' | 'data_saida'): string | null {
	const shape = leadFormFieldsSchema.shape[field];
	const result = shape.safeParse(value);
	return result.success ? null : (result.error.issues[0]?.message ?? 'Data inválida.');
}

export function validateGuestCount(
	value: string,
	field: 'adultos' | 'criancas',
): string | null {
	const shape = leadFormFieldsSchema.shape[field];
	const result = shape.safeParse(value === '' ? NaN : Number(value));
	return result.success ? null : (result.error.issues[0]?.message ?? 'Quantidade inválida.');
}

export function validateLeadForm(values: {
	nome: string;
	telefone: string;
	email: string;
	data_entrada: string;
	data_saida: string;
	adultos: string;
	criancas: string;
}): string | null {
	const result = leadFormFieldsSchema.safeParse({
		...values,
		adultos: values.adultos === '' ? NaN : Number(values.adultos),
		criancas: values.criancas === '' ? NaN : Number(values.criancas),
	});

	return result.success ? null : (result.error.issues[0]?.message ?? 'Verifique os campos.');
}
