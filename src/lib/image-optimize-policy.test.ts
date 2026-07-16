import { describe, expect, it } from 'vitest';
import {
	IMAGE_DIRS,
	resolveMaxWidth,
	resolveWebpQuality,
} from '../../scripts/optimize-images-policy.mjs';

describe('optimize-images policy', () => {
	it('includes hero, mascot and paginas directories', () => {
		expect(IMAGE_DIRS).toEqual(
			expect.arrayContaining(['images/hero', 'images/mascot', 'images/paginas']),
		);
	});

	it('caps mascot width at 800px', () => {
		expect(resolveMaxWidth('images/mascot/tuki-frente-mala.png', 'tuki-frente-mala')).toBe(800);
	});

	it('caps hero capa at 1600px', () => {
		expect(resolveMaxWidth('images/hero/capa.jpg', 'capa')).toBe(1600);
	});

	it('keeps icon quality higher than default', () => {
		expect(resolveWebpQuality('images/icons/foo.png')).toBe(85);
		expect(resolveWebpQuality('images/hero/capa.jpg')).toBe(82);
	});
});
