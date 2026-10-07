type Env = Record<string, string | undefined>;

function toOrigin(value: string | undefined): string | undefined {
	const trimmed = value?.trim();
	if (!trimmed) return undefined;

	try {
		const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
		return new URL(withProtocol).origin;
	} catch {
		return undefined;
	}
}

function isLocalHttpOrigin(origin: string): boolean {
	try {
		const url = new URL(origin);
		const host = url.hostname;
		return url.protocol === 'http:' && (host === 'localhost' || host === '127.0.0.1');
	} catch {
		return false;
	}
}

/**
 * Origens aceitas pelas APIs same-origin: URL canônica do site e, na Vercel,
 * a URL do deploy/branch (previews). Fail-closed: sem configuração, nada é aceito.
 */
export function getAllowedOrigins(
	env: Env = process.env,
	fallbackSiteUrl: string | undefined = import.meta.env.PUBLIC_SITE_URL,
): string[] {
	const candidates = [
		env.PUBLIC_SITE_URL ?? fallbackSiteUrl,
		env.VERCEL_URL,
		env.VERCEL_BRANCH_URL,
		env.VERCEL_PROJECT_PRODUCTION_URL,
	];

	return [...new Set(candidates.map(toOrigin).filter((origin): origin is string => Boolean(origin)))];
}

export interface OriginCheckOptions {
	allowedOrigins?: string[];
	/** Aceita http://localhost e http://127.0.0.1 (somente `astro dev`). */
	allowLocalhost?: boolean;
}

function isTrustedOrigin(origin: string, options: Required<OriginCheckOptions>): boolean {
	if (options.allowLocalhost && isLocalHttpOrigin(origin)) return true;
	return options.allowedOrigins.includes(origin);
}

/**
 * Aceita só requisições de páginas do próprio site.
 * Exige `Origin` permitido ou `Sec-Fetch-Site: same-origin` — requisições sem nenhum
 * dos dois (curl, scripts) são recusadas. Não substitui rate limit: headers são forjáveis
 * fora do navegador.
 */
export function isAllowedOrigin(request: Request, options: OriginCheckOptions = {}): boolean {
	const resolved: Required<OriginCheckOptions> = {
		allowedOrigins: options.allowedOrigins ?? getAllowedOrigins(),
		allowLocalhost: options.allowLocalhost ?? import.meta.env.DEV === true,
	};

	const fetchSite = request.headers.get('sec-fetch-site');
	if (fetchSite && fetchSite !== 'same-origin') return false;

	const origin = request.headers.get('origin');
	if (origin) {
		return toOrigin(origin) === origin && isTrustedOrigin(origin, resolved);
	}

	return fetchSite === 'same-origin';
}

/** True quando `value` é uma URL http(s) de uma origem aceita (ex.: page_url, event_source_url). */
export function isSiteUrl(value: string, options: OriginCheckOptions = {}): boolean {
	const resolved: Required<OriginCheckOptions> = {
		allowedOrigins: options.allowedOrigins ?? getAllowedOrigins(),
		allowLocalhost: options.allowLocalhost ?? import.meta.env.DEV === true,
	};

	try {
		const url = new URL(value);
		if (url.protocol !== 'https:' && url.protocol !== 'http:') return false;
		return isTrustedOrigin(url.origin, resolved);
	} catch {
		return false;
	}
}

export function jsonResponse(
	body: Record<string, unknown>,
	status = 200,
	extraHeaders: Record<string, string> = {},
): Response {
	return new Response(JSON.stringify(body), {
		status,
		headers: {
			'Content-Type': 'application/json',
			'Cache-Control': 'no-store',
			'X-Content-Type-Options': 'nosniff',
			...extraHeaders,
		},
	});
}
