import { formatDateDisplay } from './date-rules';
import { formatUtmSourceLabel } from './whatsapp';
import type { StoredAttribution } from '../scripts/utm';

export const LEAD_HANDOFF_KEY = 'tuki_lead_handoff';
export const LEAD_HANDOFF_TTL_MS = 30 * 60 * 1000;

export interface LeadHandoff {
	nome: string;
	hotel?: string;
	resort?: string;
	destination?: string;
	data_entrada: string;
	data_saida: string;
	adultos: number;
	criancas: number;
	saved_at: string;
}

export interface SaveLeadHandoffInput {
	nome: string;
	hotel?: string;
	resort?: string;
	destination?: string;
	data_entrada: string;
	data_saida: string;
	adultos: number;
	criancas: number;
}

function formatGuestSummary(adultos: number, criancas: number): string {
	const adultLabel = adultos === 1 ? '1 adulto' : `${adultos} adultos`;

	if (criancas === 0) return adultLabel;

	const childLabel = criancas === 1 ? '1 criança' : `${criancas} crianças`;
	return `${adultLabel} e ${childLabel}`;
}

export function buildThanksWhatsAppMessage(
	handoff: LeadHandoff | null | undefined,
	attribution: StoredAttribution = {},
): string {
	const source = formatUtmSourceLabel(attribution.utm_source);

	if (!handoff) {
		return `Olá! Acabei de enviar uma cotação pelo site. Vi ${source} e gostaria de agilizar meu atendimento.`;
	}

	const product = handoff.hotel || handoff.resort || 'minha hospedagem';
	const destination = handoff.destination ? ` em ${handoff.destination}` : '';
	const dates =
		handoff.data_entrada && handoff.data_saida
			? `, entrada ${formatDateDisplay(handoff.data_entrada)} e saída ${formatDateDisplay(handoff.data_saida)}`
			: '';
	const guests = formatGuestSummary(handoff.adultos, handoff.criancas);

	return `Olá! Acabei de enviar uma cotação pelo site: ${product}${destination}${dates}, ${guests}. Vi ${source}. Pode agilizar meu atendimento?`;
}

export function saveLeadHandoff(input: SaveLeadHandoffInput): void {
	if (typeof sessionStorage === 'undefined') return;

	const payload: LeadHandoff = {
		...input,
		saved_at: new Date().toISOString(),
	};

	sessionStorage.setItem(LEAD_HANDOFF_KEY, JSON.stringify(payload));
}

export function readLeadHandoff(): LeadHandoff | null {
	if (typeof sessionStorage === 'undefined') return null;

	try {
		const raw = sessionStorage.getItem(LEAD_HANDOFF_KEY);
		if (!raw) return null;

		const parsed = JSON.parse(raw) as LeadHandoff;
		if (!parsed.saved_at) return null;

		const age = Date.now() - new Date(parsed.saved_at).getTime();
		if (age > LEAD_HANDOFF_TTL_MS) {
			sessionStorage.removeItem(LEAD_HANDOFF_KEY);
			return null;
		}

		return parsed;
	} catch {
		return null;
	}
}
