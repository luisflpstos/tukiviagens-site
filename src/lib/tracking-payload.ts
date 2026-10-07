import type { LeadGeoData } from './lead-geo';
import { resolveLeadDestination } from './lead-destination';
import type { LeadAttribution, LeadContactFields, LeadContext, LeadFormFields } from './lead-schema';

export function formatLocalTimestamp(
	date: Date,
	timeZone = 'America/Sao_Paulo',
): string {
	const parts = new Intl.DateTimeFormat('pt-BR', {
		timeZone,
		day: '2-digit',
		month: '2-digit',
		year: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
		second: '2-digit',
		hour12: false,
	}).formatToParts(date);

	const get = (type: Intl.DateTimeFormatPartTypes) =>
		parts.find((part) => part.type === type)?.value ?? '';

	return `${get('day')}/${get('month')}/${get('year')} ${get('hour')}:${get('minute')}:${get('second')}`;
}

function empty(value?: string | null): string {
	return value ?? '';
}

export interface TrackingFields {
	source: string;
	utm_source: string;
	utm_medium: string;
	utm_campaign: string;
	utm_content: string;
	utm_term: string;
	gclid: string;
	gbraid: string;
	wbraid: string;
	fbclid: string;
}

export function buildTrackingFields(attribution: LeadAttribution = {}): TrackingFields {
	const utmSource = empty(attribution.utm_source);

	return {
		source: utmSource || 'direct',
		utm_source: utmSource,
		utm_medium: empty(attribution.utm_medium),
		utm_campaign: empty(attribution.utm_campaign),
		utm_content: empty(attribution.utm_content),
		utm_term: empty(attribution.utm_term),
		gclid: empty(attribution.gclid),
		gbraid: empty(attribution.gbraid),
		wbraid: empty(attribution.wbraid),
		fbclid: empty(attribution.fbclid),
	};
}

export interface LeadFormSubmitContext {
	h1: string;
	pageUrl: string;
	pageTitle: string;
	userAgent: string;
	referrer?: string;
	product?: string;
	campaign?: string;
	submittedAt?: Date;
}

/**
 * Payload de `lead_form_submit` para dataLayer/GA4.
 * Não contém nome, telefone nem e-mail: GA4 e Google Ads proíbem PII em parâmetros de evento.
 */
export interface LeadFormSubmitTrackingPayload extends TrackingFields {
	event: 'lead_form_submit';
	h1: string;
	page_url: string;
	page_title: string;
	referrer: string;
	horario_local: string;
	timestamp_iso: string;
	user_agent: string;
	form_id: string;
	currency: string;
	value: number;
	product?: string;
	campaign?: string;
}

export interface BuildLeadFormSubmitPayloadInput {
	formId: string;
	attribution?: LeadAttribution;
	context: LeadFormSubmitContext;
}

/** Payload de `lead_form_submit` espelhando a estrutura completa do `whatsapp_click`. */
export function buildLeadFormSubmitPayload({
	formId,
	attribution = {},
	context,
}: BuildLeadFormSubmitPayloadInput): LeadFormSubmitTrackingPayload {
	const submittedAt = context.submittedAt ?? new Date();
	const tracking = buildTrackingFields(attribution);

	return {
		event: 'lead_form_submit',
		...tracking,
		h1: context.h1,
		page_url: context.pageUrl,
		page_title: context.pageTitle,
		referrer: empty(context.referrer) || empty(attribution.referrer),
		horario_local: formatLocalTimestamp(submittedAt),
		timestamp_iso: submittedAt.toISOString(),
		user_agent: context.userAgent,
		form_id: formId,
		currency: 'BRL',
		value: 1.0,
		...(context.product ? { product: context.product } : {}),
		...(context.campaign ? { campaign: context.campaign } : {}),
	};
}

/** Dados do usuário hasheados (SHA-256) no formato do Enhanced Conversions do Google. */
export interface HashedUserData {
	sha256_email_address?: string;
	sha256_phone_number?: string;
}

const GMAIL_DOMAINS = new Set(['gmail.com', 'googlemail.com']);

/** Normaliza e-mail como o Google exige antes do hash (minúsculas; sem pontos no usuário do Gmail). */
export function normalizeEmailForAds(email: string): string | undefined {
	const normalized = email.trim().toLowerCase();
	const at = normalized.lastIndexOf('@');
	if (at <= 0 || at === normalized.length - 1) return undefined;

	const local = normalized.slice(0, at);
	const domain = normalized.slice(at + 1);
	return GMAIL_DOMAINS.has(domain) ? `${local.replace(/\./g, '')}@${domain}` : normalized;
}

/** Telefone BR em E.164 com "+" (ex.: +5517999998888), formato exigido pelo Google. */
export function normalizePhoneForAds(phone: string): string | undefined {
	const digits = phone.replace(/\D/g, '');
	if (digits.length === 10 || digits.length === 11) return `+55${digits}`;
	if ((digits.length === 12 || digits.length === 13) && digits.startsWith('55')) return `+${digits}`;
	return undefined;
}

async function sha256Hex(value: string): Promise<string> {
	const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value));
	return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Hash SHA-256 de e-mail/telefone para Enhanced Conversions (variável "Dados fornecidos
 * pelo usuário" no GTM). Retorna `{}` quando a Web Crypto não está disponível.
 */
export async function buildHashedUserData(
	contact: Pick<LeadContactFields, 'email' | 'telefone'>,
): Promise<HashedUserData> {
	const email = normalizeEmailForAds(contact.email);
	const phone = normalizePhoneForAds(contact.telefone);

	try {
		return {
			...(email ? { sha256_email_address: await sha256Hex(email) } : {}),
			...(phone ? { sha256_phone_number: await sha256Hex(phone) } : {}),
		};
	} catch {
		return {};
	}
}

function formatPhoneE164Br(phone: string): string {
	const digits = phone.replace(/\D/g, '');
	if (digits.startsWith('55')) return digits;
	return `55${digits}`;
}

export interface LeadSubmitPayload extends TrackingFields {
	event: 'lead_submit';
	h1: string;
	page_url: string;
	page_title: string;
	referrer: string;
	local_time: string;
	timestamp_iso: string;
	user_agent: string;
	name: string;
	phone: string;
	email: string;
	check_in_date: string;
	check_out_date: string;
	adults: number;
	children: number;
	product?: string;
	campaign?: string;
	form_id?: string;
	destination?: string;
	city?: string;
	state?: string;
	country?: string;
	postal_code?: string;
}

export interface BuildLeadSubmitPayloadInput {
	fields: LeadFormFields | LeadContactFields;
	attribution?: LeadAttribution;
	context?: LeadContext;
	geo?: LeadGeoData;
	submittedAt?: Date;
	userAgent?: string | null;
	referrer?: string | null;
}

function isFullLeadFields(fields: LeadFormFields | LeadContactFields): fields is LeadFormFields {
	return 'data_entrada' in fields && 'data_saida' in fields && 'adultos' in fields && 'criancas' in fields;
}

export function buildLeadSubmitPayload({
	fields,
	attribution = {},
	context = {},
	geo,
	submittedAt = new Date(),
	userAgent,
	referrer,
}: BuildLeadSubmitPayloadInput): LeadSubmitPayload {
	const tracking = buildTrackingFields(attribution);
	const product = empty(context.hotel) || empty(context.resort) || undefined;
	const destination =
		resolveLeadDestination({
			cidade: context.destination,
			path: context.landing_slug,
		}) || undefined;

	return {
		event: 'lead_submit',
		...tracking,
		h1: empty(context.h1),
		page_url: empty(context.page_url) || empty(attribution.current_url),
		page_title: empty(context.page_title),
		referrer: empty(referrer) || empty(attribution.referrer),
		local_time: formatLocalTimestamp(submittedAt),
		timestamp_iso: submittedAt.toISOString(),
		user_agent: empty(userAgent),
		name: fields.nome,
		phone: formatPhoneE164Br(fields.telefone),
		email: fields.email,
		check_in_date: isFullLeadFields(fields) ? fields.data_entrada : '',
		check_out_date: isFullLeadFields(fields) ? fields.data_saida : '',
		adults: isFullLeadFields(fields) ? fields.adultos : 0,
		children: isFullLeadFields(fields) ? fields.criancas : 0,
		...(product ? { product } : {}),
		...(context.campaign ? { campaign: context.campaign } : {}),
		...(context.form_id ? { form_id: context.form_id } : {}),
		...(destination ? { destination } : {}),
		...(geo?.cidade ? { city: geo.cidade } : {}),
		...(geo?.regiao ? { state: geo.regiao } : {}),
		...(geo?.pais ? { country: geo.pais } : {}),
		...(geo?.cep ? { postal_code: geo.cep } : {}),
	};
}
