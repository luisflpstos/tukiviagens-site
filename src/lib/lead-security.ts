const LOCAL_ORIGINS = new Set(['http://localhost:4321', 'http://127.0.0.1:4321']);

export function isAllowedOrigin(request: Request): boolean {
	const origin = request.headers.get('origin');
	if (!origin) return true;

	if (LOCAL_ORIGINS.has(origin)) return true;

	const siteUrl = import.meta.env.PUBLIC_SITE_URL;
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
