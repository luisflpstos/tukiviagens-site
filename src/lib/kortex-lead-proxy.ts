export const KORTEX_LEAD_FORM_MAX_BODY_BYTES = 16_384;

export function buildKortexLeadFormUrl(upstreamApiBase: string, projectKey: string): string {
	const base = upstreamApiBase.replace(/\/$/, '');
	return `${base}/public/leads/form?projectKey=${encodeURIComponent(projectKey)}`;
}

export type ForwardKortexLeadFormInput = {
	upstreamUrl: string;
	projectKey: string;
	rawBody: string;
	fetchImpl?: typeof fetch;
	timeoutMs?: number;
};

export type ForwardKortexLeadFormResult =
	| { ok: true }
	| { ok: false; status?: number; error?: string };

/**
 * Encaminha o payload do lead-tracker ao BFF Kortex (server→server).
 * Evita CORS no browser: sendBeacon só fala com a API same-origin.
 */
export async function forwardKortexLeadForm(
	input: ForwardKortexLeadFormInput,
): Promise<ForwardKortexLeadFormResult> {
	const fetchImpl = input.fetchImpl ?? fetch;

	try {
		const upstream = await fetchImpl(input.upstreamUrl, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'X-Project-Key': input.projectKey,
				'User-Agent': 'TukiViagens-KortexLeadProxy/1.0',
			},
			body: input.rawBody,
			signal: AbortSignal.timeout(input.timeoutMs ?? 12_000),
		});

		if (!upstream.ok) {
			return { ok: false, status: upstream.status };
		}

		return { ok: true };
	} catch (error) {
		return {
			ok: false,
			error: error instanceof Error ? error.message : 'forward_failed',
		};
	}
}

export type HandleKortexLeadFormInput = {
	contentType: string;
	rawBody: string;
	projectKey: string | null;
	expectedProjectKey: string;
	upstreamApiBase?: string;
	maxBodyBytes?: number;
	forward?: typeof forwardKortexLeadForm;
};

export type HandleKortexLeadFormOutput = {
	status: number;
	body: Record<string, unknown>;
};

/**
 * Orquestra validação + encaminhamento do formulário capturado pelo lead-tracker.
 */
export async function handleKortexLeadFormRequest(
	input: HandleKortexLeadFormInput,
): Promise<HandleKortexLeadFormOutput> {
	if (!input.projectKey || input.projectKey !== input.expectedProjectKey) {
		return { status: 403, body: { ok: false, error: 'Project key inválida.' } };
	}

	if (!input.contentType.includes('application/json')) {
		return { status: 415, body: { ok: false, error: 'Formato inválido.' } };
	}

	const maxBytes = input.maxBodyBytes ?? KORTEX_LEAD_FORM_MAX_BODY_BYTES;
	if (input.rawBody.length > maxBytes) {
		return { status: 413, body: { ok: false, error: 'Requisição muito grande.' } };
	}

	try {
		JSON.parse(input.rawBody);
	} catch {
		return { status: 400, body: { ok: false, error: 'JSON inválido.' } };
	}

	const upstreamApiBase = input.upstreamApiBase;
	if (!upstreamApiBase) {
		return {
			status: 503,
			body: { ok: false, error: 'Serviço temporariamente indisponível.' },
		};
	}

	const forward = input.forward ?? forwardKortexLeadForm;
	const upstream = await forward({
		upstreamUrl: buildKortexLeadFormUrl(upstreamApiBase, input.projectKey),
		projectKey: input.projectKey,
		rawBody: input.rawBody,
	});

	if (!upstream.ok) {
		return { status: 502, body: { ok: false, error: 'Não foi possível enviar agora.' } };
	}

	return { status: 200, body: { ok: true } };
}
