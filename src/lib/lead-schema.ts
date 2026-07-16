import { z } from 'zod';
import {
	MIN_STAY_DAYS,
	daysBetween,
	getMinCheckInDate,
	parseDateISO,
} from './date-rules';
import { LEAD_FIELD_MAX_LENGTH, MAX_ADULTS, MAX_CHILDREN } from './lead-config';

const dateString = z
	.string()
	.trim()
	.max(LEAD_FIELD_MAX_LENGTH)
	.regex(/^\d{4}-\d{2}-\d{2}$/, 'Data inválida.');

function parseDateOnly(value: string): Date {
	return parseDateISO(value);
}

function phoneDigits(phone: string): string {
	return phone.replace(/\D/g, '');
}

const pageUrlString = z.string().max(2048);
const pageMetaString = z.string().max(512);
const clickIdString = z.string().max(512);

export const leadAttributionSchema = z
	.object({
		utm_source: pageMetaString.optional(),
		utm_medium: pageMetaString.optional(),
		utm_campaign: pageMetaString.optional(),
		utm_content: pageMetaString.optional(),
		utm_term: pageMetaString.optional(),
		gclid: clickIdString.optional(),
		gbraid: clickIdString.optional(),
		wbraid: clickIdString.optional(),
		fbclid: clickIdString.optional(),
		msclkid: clickIdString.optional(),
		referrer: pageUrlString.optional(),
		landing_page: pageUrlString.optional(),
		first_landing_page: pageUrlString.optional(),
		current_url: pageUrlString.optional(),
		timestamp: z.string().max(LEAD_FIELD_MAX_LENGTH).optional(),
	})
	.strict();

/** Contexto do Meta Pixel para deduplicação browser/servidor (CAPI). */
export const leadMetaContextSchema = z
	.object({
		event_id: z.string().max(LEAD_FIELD_MAX_LENGTH).optional(),
		fbp: z.string().max(LEAD_FIELD_MAX_LENGTH).optional(),
		fbc: z.string().max(512).optional(),
	})
	.strict();

export const leadContextSchema = z
	.object({
		hotel: z.string().max(LEAD_FIELD_MAX_LENGTH).optional(),
		resort: z.string().max(LEAD_FIELD_MAX_LENGTH).optional(),
		destination: z.string().max(LEAD_FIELD_MAX_LENGTH).optional(),
		campaign: z.string().max(LEAD_FIELD_MAX_LENGTH).optional(),
		form_id: z.string().max(LEAD_FIELD_MAX_LENGTH).optional(),
		landing_slug: z.string().max(LEAD_FIELD_MAX_LENGTH).optional(),
		h1: pageMetaString.optional(),
		page_url: pageUrlString.optional(),
		page_title: pageMetaString.optional(),
	})
	.strict();

export const leadContactFieldsSchema = z
	.object({
		nome: z
			.string()
			.trim()
			.min(2, 'Informe seu nome completo.')
			.max(LEAD_FIELD_MAX_LENGTH, 'Nome muito longo.'),
		telefone: z
			.string()
			.trim()
			.min(1, 'Informe seu telefone (WhatsApp).')
			.max(LEAD_FIELD_MAX_LENGTH, 'Telefone muito longo.')
			.refine((value) => phoneDigits(value).length >= 10, 'Informe um telefone válido com DDD.'),
		email: z
			.string()
			.trim()
			.min(1, 'Informe seu e-mail.')
			.max(LEAD_FIELD_MAX_LENGTH, 'E-mail muito longo.')
			.email('Informe um e-mail válido.'),
	})
	.strict();

export const leadFormFieldsSchema = leadContactFieldsSchema
	.extend({
		data_entrada: dateString,
		data_saida: dateString,
		adultos: z.coerce
			.number({ error: 'Informe a quantidade de adultos.' })
			.int('Informe a quantidade de adultos.')
			.min(1, 'Informe pelo menos 1 adulto.')
			.max(MAX_ADULTS, `Máximo de ${MAX_ADULTS} adultos.`),
		criancas: z.coerce
			.number({ error: 'Informe a quantidade de crianças.' })
			.int('Informe a quantidade de crianças.')
			.min(0, 'Quantidade de crianças inválida.')
			.max(MAX_CHILDREN, `Máximo de ${MAX_CHILDREN} crianças.`),
	})
	.superRefine((data, ctx) => {
		const entrada = parseDateOnly(data.data_entrada);
		const saida = parseDateOnly(data.data_saida);

		if (Number.isNaN(entrada.getTime())) {
			ctx.addIssue({ code: 'custom', message: 'Data de entrada inválida.', path: ['data_entrada'] });
		}
		if (Number.isNaN(saida.getTime())) {
			ctx.addIssue({ code: 'custom', message: 'Data de saída inválida.', path: ['data_saida'] });
		}
		if (!Number.isNaN(entrada.getTime()) && !Number.isNaN(saida.getTime()) && saida <= entrada) {
			ctx.addIssue({
				code: 'custom',
				message: 'A data de saída deve ser posterior à data de entrada.',
				path: ['data_saida'],
			});
		}

		const minCheckIn = getMinCheckInDate();
		if (!Number.isNaN(entrada.getTime()) && entrada < minCheckIn) {
			ctx.addIssue({
				code: 'custom',
				message: 'A data de entrada deve ser a partir de amanhã.',
				path: ['data_entrada'],
			});
		}

		if (
			!Number.isNaN(entrada.getTime()) &&
			!Number.isNaN(saida.getTime()) &&
			daysBetween(entrada, saida) < MIN_STAY_DAYS
		) {
			ctx.addIssue({
				code: 'custom',
				message: `Selecione no mínimo ${MIN_STAY_DAYS} dias de hospedagem.`,
				path: ['data_saida'],
			});
		}
	});

export const leadSubmissionSchema = z
	.object({
		nome: z.string(),
		telefone: z.string(),
		email: z.string(),
		data_entrada: z.string().optional(),
		data_saida: z.string().optional(),
		adultos: z.union([z.string(), z.number()]).optional(),
		criancas: z.union([z.string(), z.number()]).optional(),
		_hp: z.string().max(LEAD_FIELD_MAX_LENGTH).optional(),
		attribution: leadAttributionSchema.optional(),
		context: leadContextSchema.optional(),
		meta: leadMetaContextSchema.optional(),
	})
	.strict();

export type LeadContactFields = z.infer<typeof leadContactFieldsSchema>;
export type LeadFormFields = z.infer<typeof leadFormFieldsSchema>;
export type LeadAttribution = z.infer<typeof leadAttributionSchema>;
export type LeadContext = z.infer<typeof leadContextSchema>;
export type LeadMetaContext = z.infer<typeof leadMetaContextSchema>;

/** True when the submission includes stay details (full form), not contact-only. */
export function hasLeadStayFields(data: {
	data_entrada?: string;
	data_saida?: string;
	adultos?: string | number;
	criancas?: string | number;
}): boolean {
	return (
		Boolean(data.data_entrada?.trim()) &&
		Boolean(data.data_saida?.trim()) &&
		data.adultos !== undefined &&
		data.adultos !== '' &&
		data.criancas !== undefined &&
		data.criancas !== ''
	);
}

export type LeadSubmissionEnvelope = z.infer<typeof leadSubmissionSchema>;

/**
 * Valida só os campos de contato/estadia do envelope.
 * Não passa `_hp` / `attribution` / `context` / `meta` aos schemas `.strict()` de fields.
 */
export function parseLeadSubmissionFields(
	data: LeadSubmissionEnvelope,
):
	| { success: true; data: LeadFormFields | LeadContactFields }
	| { success: false; error: z.ZodError } {
	if (hasLeadStayFields(data)) {
		return leadFormFieldsSchema.safeParse({
			nome: data.nome,
			telefone: data.telefone,
			email: data.email,
			data_entrada: data.data_entrada,
			data_saida: data.data_saida,
			adultos: data.adultos,
			criancas: data.criancas,
		});
	}

	return leadContactFieldsSchema.safeParse({
		nome: data.nome,
		telefone: data.telefone,
		email: data.email,
	});
}

export function firstZodError(error: z.ZodError): string {
	return error.issues[0]?.message ?? 'Verifique os campos do formulário.';
}
