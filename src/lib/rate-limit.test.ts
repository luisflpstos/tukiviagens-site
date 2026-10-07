import { describe, expect, it } from 'vitest';
import { createRateLimiter } from './rate-limit';

describe('createRateLimiter', () => {
	it('limits each key independently within the window', () => {
		const check = createRateLimiter({ limit: 2, windowMs: 60_000 });

		expect(check('1.1.1.1', 0).limited).toBe(false);
		expect(check('1.1.1.1', 1_000).limited).toBe(false);
		expect(check('1.1.1.1', 2_000)).toEqual({ limited: true, retryAfterSeconds: 58 });
		expect(check('2.2.2.2', 2_000).limited).toBe(false);
	});

	it('resets after the window expires', () => {
		const check = createRateLimiter({ limit: 1, windowMs: 1_000 });

		expect(check('ip', 0).limited).toBe(false);
		expect(check('ip', 500).limited).toBe(true);
		expect(check('ip', 1_000).limited).toBe(false);
	});

	it('keeps memory bounded when the key cap is reached', () => {
		const check = createRateLimiter({ limit: 1, windowMs: 60_000, maxKeys: 2 });

		check('a', 0);
		expect(check('a', 0).limited).toBe(true);
		check('b', 0);
		check('c', 0);

		// Sem janelas expiradas para podar, o mapa é zerado em vez de crescer sem limite.
		expect(check('a', 0).limited).toBe(false);
	});
});
