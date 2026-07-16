export type IdleScheduleDeps = {
	requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
	setTimeout: typeof setTimeout;
};

const DEFAULT_IDLE_TIMEOUT_MS = 2500;

/**
 * Runs work after the browser is idle (or on the next macrotask as fallback).
 * Used to boot third-party analytics off the critical path.
 */
export function scheduleIdle(
	callback: () => void,
	deps: IdleScheduleDeps = {
		requestIdleCallback:
			typeof globalThis !== 'undefined' &&
			'requestIdleCallback' in globalThis &&
			typeof globalThis.requestIdleCallback === 'function'
				? (cb, opts) =>
						globalThis.requestIdleCallback(
							() => cb(),
							opts,
						)
				: undefined,
		setTimeout: globalThis.setTimeout.bind(globalThis),
	},
	timeoutMs = DEFAULT_IDLE_TIMEOUT_MS,
): void {
	if (typeof deps.requestIdleCallback === 'function') {
		deps.requestIdleCallback(callback, { timeout: timeoutMs });
		return;
	}

	deps.setTimeout(callback, 1);
}

export const IDLE_ANALYTICS_TIMEOUT_MS = DEFAULT_IDLE_TIMEOUT_MS;
