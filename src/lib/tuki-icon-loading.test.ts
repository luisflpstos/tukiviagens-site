import { describe, expect, it } from 'vitest';
import { resolveTukiIconLoading } from './tuki-icon-loading';

describe('resolveTukiIconLoading', () => {
	it('uses eager loading for marquee icons inside clipped animated tracks', () => {
		expect(resolveTukiIconLoading('marquee')).toBe('eager');
	});

	it('defaults to lazy loading for icons elsewhere on the page', () => {
		expect(resolveTukiIconLoading('default')).toBe('lazy');
	});
});
