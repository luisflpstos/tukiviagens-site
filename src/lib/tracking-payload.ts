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
