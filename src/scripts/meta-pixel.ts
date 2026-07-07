/**
 * Helpers do Meta Pixel no browser: leitura dos cookies _fbp/_fbc,
 * geração de event_id compartilhado com a API de Conversões (deduplicação)
 * e disparo de eventos via fbq.
 */

declare global {
	interface Window {
		fbq?: (...args: unknown[]) => void;
	}
}

export interface MetaBrowserContext {
	event_id: string;
	fbp?: string;
	fbc?: string;
}

function readCookie(name: string): string | undefined {
	const match = document.cookie.match(new RegExp(`(?:^|;\\s*)${name}=([^;]*)`));
	return match ? decodeURIComponent(match[1]) : undefined;
}

export function getFbp(): string | undefined {
	return readCookie('_fbp');
}

export function getFbc(): string | undefined {
	return readCookie('_fbc');
}

export function generateMetaEventId(): string {
	if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
		return crypto.randomUUID();
	}
	return `evt_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

/** Contexto enviado ao servidor para o evento CAPI correspondente. */
export function buildMetaBrowserContext(): MetaBrowserContext {
	return {
		event_id: generateMetaEventId(),
		fbp: getFbp(),
		fbc: getFbc(),
	};
}

/** Dispara um evento padrão no Pixel com eventID para deduplicação com a CAPI. */
export function trackMetaPixelEvent(
	eventName: 'Lead' | 'Contact',
	eventId: string,
	params: Record<string, unknown> = {},
): void {
	window.fbq?.('track', eventName, params, { eventID: eventId });
}
