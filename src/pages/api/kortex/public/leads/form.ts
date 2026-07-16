import type { APIRoute } from 'astro';
import {
	LEAD_TRACKER_PROJECT_KEY,
	LEAD_TRACKER_UPSTREAM_API_BASE,
} from '../../../../../lib/lead-config';
import { handleKortexLeadFormRequest } from '../../../../../lib/kortex-lead-proxy';
import { isAllowedOrigin, jsonResponse } from '../../../../../lib/lead-security';

export const prerender = false;

/**
 * Proxy same-origin para o Kortex lead-tracker.js.
 * O script usa sendBeacon (credentials:include); o BFF responde Access-Control-Allow-Origin: *.
 */
export const POST: APIRoute = async ({ request, url }) => {
	if (!isAllowedOrigin(request)) {
		return jsonResponse({ ok: false, error: 'Origem não permitida.' }, 403);
	}

	const result = await handleKortexLeadFormRequest({
		contentType: request.headers.get('content-type') ?? '',
		rawBody: await request.text(),
		projectKey: url.searchParams.get('projectKey'),
		expectedProjectKey: LEAD_TRACKER_PROJECT_KEY,
		upstreamApiBase: LEAD_TRACKER_UPSTREAM_API_BASE,
	});

	if (!result.body.ok) {
		console.error('[kortex-lead]', result.status, result.body);
	}

	return jsonResponse(result.body, result.status);
};
