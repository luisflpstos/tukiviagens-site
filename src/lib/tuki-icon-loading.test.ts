import { describe, expect, it } from 'vitest';
import { resolveTukiIconFetchPriority, resolveTukiIconLoading } from './tuki-icon-loading';

describe('resolveTukiIconLoading', () => {
	it('uses eager loading for marquee icons inside clipped animated tracks', () => {
		expect(resolveTukiIconLoading('marquee')).toBe('eager');
	});

	it('defaults to lazy loading for icons elsewhere on the page', () => {
		expect(resolveTukiIconLoading('default')).toBe('lazy');
	});
});

describe('resolveTukiIconFetchPriority', () => {
	it('deprioritizes marquee icons so they do not contend with the hero', () => {
		expect(resolveTukiIconFetchPriority('marquee')).toBe('low');
	});

	it('leaves default icons at auto fetch priority', () => {
		expect(resolveTukiIconFetchPriority('default')).toBe('auto');
	});
});
