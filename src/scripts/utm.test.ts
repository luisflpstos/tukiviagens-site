import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
	ATTRIBUTION_TTL_MS,
	captureUtmParams,
	getStoredAttribution,
} from './utm';

const STORAGE_KEY_INTERNAL = 'tuki_attribution';

describe('utm attribution TTL', () => {
	const localStore: Record<string, string> = {};

	beforeEach(() => {
		vi.useFakeTimers();
		vi.setSystemTime(new Date('2026-07-07T12:00:00.000Z'));

		for (const key of Object.keys(localStore)) delete localStore[key];

		vi.stubGlobal('localStorage', {
			getItem: (key: string) => localStore[key] ?? null,
			setItem: (key: string, value: string) => {
				localStore[key] = value;
			},
			removeItem: (key: string) => {
				delete localStore[key];
			},
		});

		vi.stubGlobal('window', {
			location: {
				search: '',
				pathname: '/olimpia/enjoy-olimpia-park-resort/',
				href: 'https://tukiviagens.com.br/olimpia/enjoy-olimpia-park-resort/',
			},
		});

		vi.stubGlobal('document', { referrer: '' });
	});

	afterEach(() => {
		vi.useRealTimers();
		vi.unstubAllGlobals();
	});

	it('returns stored attribution within 24 hours', () => {
		localStore[STORAGE_KEY_INTERNAL] = JSON.stringify({
			utm_source: 'google',
			timestamp: '2026-07-07T10:00:00.000Z',
		});

		expect(getStoredAttribution()).toEqual({
			utm_source: 'google',
			timestamp: '2026-07-07T10:00:00.000Z',
		});
	});

	it('clears attribution older than 24 hours', () => {
		localStore[STORAGE_KEY_INTERNAL] = JSON.stringify({
			utm_source: 'google',
			timestamp: '2026-07-06T11:59:59.000Z',
		});

		expect(getStoredAttribution()).toEqual({});
		expect(localStore[STORAGE_KEY_INTERNAL]).toBeUndefined();
	});

	it('clears legacy attribution without timestamp', () => {
		localStore[STORAGE_KEY_INTERNAL] = JSON.stringify({
			utm_source: 'google',
		});

		expect(getStoredAttribution()).toEqual({});
		expect(localStore[STORAGE_KEY_INTERNAL]).toBeUndefined();
	});

	it('resets TTL when a new campaign is captured', () => {
		localStore[STORAGE_KEY_INTERNAL] = JSON.stringify({
			utm_source: 'google',
			first_landing_page: '/olimpia/',
			timestamp: '2026-07-06T12:00:00.000Z',
		});

		vi.stubGlobal('window', {
			location: {
				search: '?utm_source=facebook&utm_medium=cpc',
				pathname: '/olimpia/enjoy-olimpia-park-resort/',
				href: 'https://tukiviagens.com.br/olimpia/enjoy-olimpia-park-resort/?utm_source=facebook&utm_medium=cpc',
			},
		});

		captureUtmParams();

		const stored = JSON.parse(localStore[STORAGE_KEY_INTERNAL] ?? '{}');
		expect(stored.utm_source).toBe('facebook');
		expect(stored.utm_medium).toBe('cpc');
		expect(stored.timestamp).toBe('2026-07-07T12:00:00.000Z');
	});

	it('uses a 24-hour TTL constant', () => {
		expect(ATTRIBUTION_TTL_MS).toBe(24 * 60 * 60 * 1000);
	});
});
