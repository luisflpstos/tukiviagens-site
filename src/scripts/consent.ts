import {
	CONSENT_STORAGE_KEY,
	buildGoogleConsentState,
	parseStoredConsent,
	serializeConsent,
	type ConsentChoice,
} from '../lib/consent';

type ConsentWindow = Window & { fbq?: (...args: unknown[]) => void };

/** gtag.js/GTM só tratam como comando o objeto `arguments` — arrays empurrados são ignorados. */
function toGtagCommand(..._args: unknown[]): IArguments {
	return arguments;
}

function pushGtagCommand(win: Window, command: IArguments): void {
	const target = win as unknown as { dataLayer?: unknown[] };
	target.dataLayer = target.dataLayer || [];
	target.dataLayer.push(command);
}

export function readConsent(storage?: Storage): ConsentChoice | null {
	try {
		return parseStoredConsent((storage ?? localStorage).getItem(CONSENT_STORAGE_KEY));
	} catch {
		return null;
	}
}

export function saveConsent(choice: ConsentChoice, storage?: Storage): void {
	try {
		(storage ?? localStorage).setItem(CONSENT_STORAGE_KEY, serializeConsent(choice));
	} catch {
		// ignore storage errors (private mode, quota, etc.)
	}
}

/** Estado padrão do Consent Mode — precisa entrar no dataLayer antes do GTM/gtag carregarem. */
export function pushConsentDefault(choice: ConsentChoice | null, win: Window = window): void {
	pushGtagCommand(
		win,
		toGtagCommand('consent', 'default', {
			...buildGoogleConsentState(choice),
			...(choice ? {} : { wait_for_update: 500 }),
		}),
	);
	pushGtagCommand(win, toGtagCommand('set', 'ads_data_redaction', choice !== 'granted'));
}

/** Aplica a escolha do banner ao Google (Consent Mode) e ao Meta Pixel. */
export function applyConsentChoice(choice: ConsentChoice, win: ConsentWindow = window): void {
	pushGtagCommand(win, toGtagCommand('consent', 'update', buildGoogleConsentState(choice)));
	pushGtagCommand(win, toGtagCommand('set', 'ads_data_redaction', choice !== 'granted'));
	win.fbq?.('consent', choice === 'granted' ? 'grant' : 'revoke');
}
