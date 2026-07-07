/**
 * Integração direta com a API de Conversões da Meta (Conversions API).
 *
 * Envia eventos servidor→servidor para o endpoint /{dataset_id}/events do Graph API,
 * com hash SHA-256 dos dados do cliente conforme exigido pela Meta.
 *
 * Deduplicação: o mesmo `event_id` é usado no Pixel (browser) e aqui (servidor),
 * então a Meta descarta o evento duplicado automaticamente.
 */
import { createHash } from 'node:crypto';
import { getMetaCapiToken, getMetaPixelId, getMetaTestEventCode } from './meta-config';

export const META_GRAPH_VERSION = 'v25.0';

export type MetaEventName = 'Lead' | 'Contact';

export interface MetaUserDataInput {
	email?: string;
	/** Telefone em qualquer formato BR; será normalizado para E.164 sem "+". */
	phone?: string;
	/** Nome completo; será dividido em first/last name. */
	fullName?: string;
	city?: string;
	state?: string;
	/** Código do país ISO-3166 alpha-2 (ex.: BR). */
	country?: string;
	clientIpAddress?: string;
	clientUserAgent?: string;
	/** Cookie _fbp do browser (não é hasheado). */
	fbp?: string;
	/** Cookie _fbc do browser (não é hasheado). */
	fbc?: string;
	/** Parâmetro fbclid da URL — usado para derivar fbc quando o cookie não existe. */
	fbclid?: string;
}

export interface MetaEventInput {
	eventName: MetaEventName;
	eventId: string;
	eventTime?: number;
	eventSourceUrl?: string;
	userData: MetaUserDataInput;
	customData?: Record<string, unknown>;
}

export function sha256(value: string): string {
	return createHash('sha256').update(value).digest('hex');
}

function hashNormalized(value: string | undefined): string | undefined {
	const normalized = value?.trim().toLowerCase();
	return normalized ? sha256(normalized) : undefined;
}

export function normalizeEmail(email: string | undefined): string | undefined {
	return email?.trim().toLowerCase() || undefined;
}

/** Normaliza telefone BR para E.164 sem "+" (ex.: 5511999998888). */
export function normalizePhoneBr(phone: string | undefined): string | undefined {
	if (!phone) return undefined;
	const digits = phone.replace(/\D/g, '');
	if (digits.length < 10) return undefined;
	return digits.startsWith('55') ? digits : `55${digits}`;
}

export function splitFullName(
	fullName: string | undefined,
): { firstName?: string; lastName?: string } {
	const parts = fullName?.trim().split(/\s+/).filter(Boolean) ?? [];
	if (parts.length === 0) return {};
	if (parts.length === 1) return { firstName: parts[0] };
	return { firstName: parts[0], lastName: parts[parts.length - 1] };
}

/**
 * Deriva o parâmetro fbc a partir do fbclid quando o cookie _fbc não existe.
 * Formato: fb.1.{timestamp_ms}.{fbclid}
 */
export function buildFbcFromFbclid(
	fbclid: string | undefined,
	now: number = Date.now(),
): string | undefined {
	if (!fbclid?.trim()) return undefined;
	return `fb.1.${now}.${fbclid.trim()}`;
}

interface MetaUserDataPayload {
	em?: string[];
	ph?: string[];
	fn?: string[];
	ln?: string[];
	ct?: string[];
	st?: string[];
	country?: string[];
	client_ip_address?: string;
	client_user_agent?: string;
	fbp?: string;
	fbc?: string;
}

/** Monta o objeto user_data com os campos hasheados conforme a especificação da Meta. */
export function buildMetaUserData(input: MetaUserDataInput): MetaUserDataPayload {
	const { firstName, lastName } = splitFullName(input.fullName);
	const email = hashNormalized(normalizeEmail(input.email));
	const phone = hashNormalized(normalizePhoneBr(input.phone));
	const fn = hashNormalized(firstName);
	const ln = hashNormalized(lastName);
	const ct = hashNormalized(input.city?.replace(/[\s\-.]/g, ''));
	const st = hashNormalized(input.state);
	const country = hashNormalized(input.country);
	const fbc = input.fbc?.trim() || buildFbcFromFbclid(input.fbclid);

	return {
		...(email ? { em: [email] } : {}),
		...(phone ? { ph: [phone] } : {}),
		...(fn ? { fn: [fn] } : {}),
		...(ln ? { ln: [ln] } : {}),
		...(ct ? { ct: [ct] } : {}),
		...(st ? { st: [st] } : {}),
		...(country ? { country: [country] } : {}),
		...(input.clientIpAddress ? { client_ip_address: input.clientIpAddress } : {}),
		...(input.clientUserAgent ? { client_user_agent: input.clientUserAgent } : {}),
		...(input.fbp?.trim() ? { fbp: input.fbp.trim() } : {}),
		...(fbc ? { fbc } : {}),
	};
}

export interface MetaServerEvent {
	event_name: string;
	event_time: number;
	event_id: string;
	action_source: 'website';
	event_source_url?: string;
	user_data: MetaUserDataPayload;
	custom_data?: Record<string, unknown>;
}

export function buildMetaServerEvent(input: MetaEventInput): MetaServerEvent {
	return {
		event_name: input.eventName,
		event_time: input.eventTime ?? Math.floor(Date.now() / 1000),
		event_id: input.eventId,
		action_source: 'website',
		...(input.eventSourceUrl ? { event_source_url: input.eventSourceUrl } : {}),
		user_data: buildMetaUserData(input.userData),
		...(input.customData && Object.keys(input.customData).length > 0
			? { custom_data: input.customData }
			: {}),
	};
}

/**
 * Envia um evento à API de Conversões. Nunca lança — falhas são registradas em log
 * para não impactar o fluxo principal (ex.: envio do lead ao webhook).
 */
export async function sendMetaEvent(input: MetaEventInput): Promise<boolean> {
	const pixelId = getMetaPixelId();
	const token = getMetaCapiToken();
	if (!pixelId || !token) return false;

	const body: Record<string, unknown> = {
		data: [buildMetaServerEvent(input)],
	};

	const testEventCode = getMetaTestEventCode();
	if (testEventCode) body.test_event_code = testEventCode;

	try {
		const response = await fetch(
			`https://graph.facebook.com/${META_GRAPH_VERSION}/${pixelId}/events?access_token=${encodeURIComponent(token)}`,
			{
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(body),
				signal: AbortSignal.timeout(8_000),
			},
		);

		if (!response.ok) {
			const detail = await response.text().catch(() => '');
			console.error('[meta-capi] Falha ao enviar evento', input.eventName, response.status, detail);
			return false;
		}

		return true;
	} catch (error) {
		console.error('[meta-capi] Erro de rede ao enviar evento', input.eventName, error);
		return false;
	}
}

/** Extrai o IP do cliente dos headers da Vercel/proxy. */
export function extractClientIp(request: Request): string | undefined {
	const forwarded = request.headers.get('x-forwarded-for');
	const first = forwarded?.split(',')[0]?.trim();
	return request.headers.get('x-real-ip')?.trim() || first || undefined;
}
