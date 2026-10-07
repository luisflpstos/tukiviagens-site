import { z } from 'zod';

const CONTROL_CHARS = /[\u0000-\u001F\u007F]/;
const LINK_PATTERN = /:\/\/|www\./i;

export function isHttpUrl(value: string): boolean {
	try {
		const { protocol } = new URL(value);
		return protocol === 'https:' || protocol === 'http:';
	} catch {
		return false;
	}
}

/** Texto livre que chega ao CRM/atendimento: sem caracteres de controle nem links. */
export function plainText(max: number) {
	return z
		.string()
		.max(max)
		.refine((value) => !CONTROL_CHARS.test(value), 'Caracteres inválidos.')
		.refine((value) => !LINK_PATTERN.test(value), 'Links não são permitidos.');
}

/** Texto sem caracteres de controle (ex.: user-agent, que pode conter URLs legítimas). */
export function printableText(max: number) {
	return z
		.string()
		.max(max)
		.refine((value) => !CONTROL_CHARS.test(value), 'Caracteres inválidos.');
}

/** Identificadores de clique/evento (gclid, fbclid, event_id…): vazio ou [A-Za-z0-9_.~-]. */
export function tokenString(max: number) {
	return z.string().max(max).regex(/^[\w.~-]*$/, 'Identificador inválido.');
}

/** URL http(s) ou string vazia (ex.: referrer externo). */
export function httpUrlOrEmpty(max = 2048) {
	return z
		.string()
		.max(max)
		.refine((value) => value === '' || isHttpUrl(value), 'URL inválida.');
}
