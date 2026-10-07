export interface RateLimiterOptions {
	/** Máximo de requisições por chave dentro da janela. */
	limit: number;
	windowMs: number;
	/** Teto de chaves em memória antes de descartar janelas expiradas. */
	maxKeys?: number;
}

export interface RateLimitResult {
	limited: boolean;
	/** Segundos até a janela da chave reiniciar. */
	retryAfterSeconds: number;
}

/**
 * Rate limit em memória (janela fixa por chave, ex.: IP).
 * Vale por instância da função — proteção de melhor esforço; a regra no
 * Vercel Firewall é o controle principal.
 */
export function createRateLimiter({ limit, windowMs, maxKeys = 5_000 }: RateLimiterOptions) {
	const windows = new Map<string, { count: number; resetAt: number }>();

	function prune(now: number): void {
		for (const [key, entry] of windows) {
			if (entry.resetAt <= now) windows.delete(key);
		}
		if (windows.size >= maxKeys) windows.clear();
	}

	return function check(key: string, now: number = Date.now()): RateLimitResult {
		let entry = windows.get(key);

		if (!entry || entry.resetAt <= now) {
			if (!entry && windows.size >= maxKeys) prune(now);
			entry = { count: 0, resetAt: now + windowMs };
			windows.set(key, entry);
		}

		entry.count += 1;

		return {
			limited: entry.count > limit,
			retryAfterSeconds: Math.max(1, Math.ceil((entry.resetAt - now) / 1000)),
		};
	};
}
