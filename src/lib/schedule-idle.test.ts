import { describe, expect, it, vi } from 'vitest';
import { scheduleIdle } from './schedule-idle';

describe('scheduleIdle', () => {
	it('uses requestIdleCallback when available', () => {
		const callback = vi.fn();
		const requestIdleCallback = vi.fn((cb: () => void) => {
			cb();
			return 1;
		});

		scheduleIdle(callback, {
			requestIdleCallback,
			setTimeout: vi.fn() as unknown as typeof setTimeout,
		});

		expect(requestIdleCallback).toHaveBeenCalledOnce();
		expect(callback).toHaveBeenCalledOnce();
	});

	it('falls back to setTimeout when requestIdleCallback is missing', () => {
		const callback = vi.fn();
		const setTimeoutFn = vi.fn((fn: () => void) => {
			fn();
			return 1 as unknown as ReturnType<typeof setTimeout>;
		});

		scheduleIdle(callback, {
			setTimeout: setTimeoutFn as unknown as typeof setTimeout,
		});

		expect(setTimeoutFn).toHaveBeenCalledWith(expect.any(Function), 1);
		expect(callback).toHaveBeenCalledOnce();
	});

	it('passes timeout option to requestIdleCallback', () => {
		const requestIdleCallback = vi.fn();

		scheduleIdle(
			() => {},
			{
				requestIdleCallback,
				setTimeout: vi.fn() as unknown as typeof setTimeout,
			},
			1800,
		);

		expect(requestIdleCallback).toHaveBeenCalledWith(expect.any(Function), {
			timeout: 1800,
		});
	});
});
