import { describe, expect, it, vi } from 'vitest';
import { CONSENT_STORAGE_KEY, serializeConsent } from '../lib/consent';
import { applyConsentChoice, pushConsentDefault, readConsent, saveConsent } from './consent';

function createWindowStub(extra: Record<string, unknown> = {}) {
	return { ...extra } as unknown as Window;
}

function dataLayerOf(win: Window): IArguments[] {
	return (win as unknown as { dataLayer: IArguments[] }).dataLayer;
}

function commandsOf(win: Window): unknown[][] {
	return dataLayerOf(win).map((entry) => Array.from(entry));
}

function createStorageStub(initial: Record<string, string> = {}) {
	const store = { ...initial };
	return {
		store,
		storage: {
			getItem: (key: string) => store[key] ?? null,
			setItem: (key: string, value: string) => {
				store[key] = value;
			},
		} as unknown as Storage,
	};
}

describe('pushConsentDefault', () => {
	it('pushes gtag commands as `arguments` objects (arrays are ignored by GTM)', () => {
		const win = createWindowStub();

		pushConsentDefault(null, win);

		const [consent, redaction] = dataLayerOf(win);
		expect(Object.prototype.toString.call(consent)).toBe('[object Arguments]');
		expect(Array.from(consent!)).toEqual([
			'consent',
			'default',
			{
				ad_storage: 'denied',
				ad_user_data: 'denied',
				ad_personalization: 'denied',
				analytics_storage: 'denied',
				wait_for_update: 500,
			},
		]);
		expect(Array.from(redaction!)).toEqual(['set', 'ads_data_redaction', true]);
	});

	it('uses the stored choice as default without waiting for an update', () => {
		const win = createWindowStub();

		pushConsentDefault('granted', win);

		const [consent, redaction] = commandsOf(win);
		expect(consent?.[2]).toEqual({
			ad_storage: 'granted',
			ad_user_data: 'granted',
			ad_personalization: 'granted',
			analytics_storage: 'granted',
		});
		expect(redaction).toEqual(['set', 'ads_data_redaction', false]);
	});
});

describe('applyConsentChoice', () => {
	it('updates Google consent and grants/revokes the Meta Pixel', () => {
		const fbq = vi.fn();
		const win = createWindowStub({ fbq });

		applyConsentChoice('granted', win);
		applyConsentChoice('denied', win);

		const commands = commandsOf(win);
		expect(commands[0]).toEqual([
			'consent',
			'update',
			{
				ad_storage: 'granted',
				ad_user_data: 'granted',
				ad_personalization: 'granted',
				analytics_storage: 'granted',
			},
		]);
		expect(commands[2]?.[2]).toMatchObject({ analytics_storage: 'denied' });
		expect(fbq).toHaveBeenNthCalledWith(1, 'consent', 'grant');
		expect(fbq).toHaveBeenNthCalledWith(2, 'consent', 'revoke');
	});
});

describe('readConsent / saveConsent', () => {
	it('persists the choice in storage', () => {
		const { storage, store } = createStorageStub();

		expect(readConsent(storage)).toBeNull();
		saveConsent('denied', storage);
		expect(JSON.parse(store[CONSENT_STORAGE_KEY]!)).toMatchObject({ choice: 'denied' });
		expect(readConsent(storage)).toBe('denied');
	});

	it('reads a previously stored choice and survives storage errors', () => {
		const { storage } = createStorageStub({ [CONSENT_STORAGE_KEY]: serializeConsent('granted') });
		expect(readConsent(storage)).toBe('granted');

		const broken = {
			getItem: () => {
				throw new Error('blocked');
			},
			setItem: () => {
				throw new Error('blocked');
			},
		} as unknown as Storage;
		expect(readConsent(broken)).toBeNull();
		expect(() => saveConsent('granted', broken)).not.toThrow();
	});
});
