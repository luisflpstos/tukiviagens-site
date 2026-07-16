import { describe, expect, it } from 'vitest';
import { MARQUEE_ICONS, TUKI_ICONS } from './icons';

describe('TUKI_ICONS', () => {
	it('exposes WebP paths for every brand icon', () => {
		for (const src of Object.values(TUKI_ICONS)) {
			expect(src).toMatch(/^\/images\/icons\/.+\.webp$/);
		}
	});
});

describe('MARQUEE_ICONS', () => {
	it('uses a curated subset instead of every brand icon', () => {
		expect(MARQUEE_ICONS.length).toBeGreaterThan(0);
		expect(MARQUEE_ICONS.length).toBeLessThan(Object.keys(TUKI_ICONS).length);
	});

	it('only references registered WebP icon paths', () => {
		const registered = new Set(Object.values(TUKI_ICONS));
		for (const icon of MARQUEE_ICONS) {
			expect(registered.has(icon.src)).toBe(true);
			expect(icon.alt.length).toBeGreaterThan(0);
		}
	});
});
