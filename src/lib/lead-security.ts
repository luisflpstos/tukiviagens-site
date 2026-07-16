function isLocalHttpOrigin(origin: string): boolean {
	try {
		const url = new URL(origin);
		const host = url.hostname;
		return url.protocol === 'http:' && (host === 'localhost' || host === '127.0.0.1');
	} catch {
		return false;
	}
}

export function isAllowedOrigin(request: Request): boolean {
	const origin = request.headers.get('origin');
	if (!origin) return true;

	if (isLocalHttpOrigin(origin)) return true;

	const siteUrl = process.env.PUBLIC_SITE_URL ?? import.meta.env.PUBLIC_SITE_URL;
	if (!siteUrl) return true;

	try {
		return new URL(origin).origin === new URL(siteUrl).origin;
	} catch {
		return false;
	}
}

export function jsonResponse(body: Record<string, unknown>, status = 200): Response {
	return new Response(JSON.stringify(body), {
		status,
		headers: {
			'Content-Type': 'application/json',
			'Cache-Control': 'no-store',
			'X-Content-Type-Options': 'nosniff',
		},
	});
}
