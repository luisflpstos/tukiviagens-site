import { describe, expect, it } from 'vitest';
import {
	hasDedicatedPropertyGallery,
	resolvePageGalleryImages,
	resolvePropertyImageSlug,
	shouldShowPageCarousel,
} from './property-gallery';

describe('resolvePropertyImageSlug', () => {
	it('maps hot-beach page to hot-beach-olimpia image folder', () => {
		expect(resolvePropertyImageSlug('olimpia/hot-beach')).toBe('hot-beach-olimpia');
	});

	it('uses leaf slug when it matches a hotel image folder', () => {
		expect(resolvePropertyImageSlug('olimpia/enjoy-olimpia-park-resort')).toBe(
			'enjoy-olimpia-park-resort',
		);
		expect(resolvePropertyImageSlug('olimpia/wyndham-olimpia-royal-hotels')).toBe(
			'wyndham-olimpia-royal-hotels',
		);
	});

	it('falls back to leaf slug for unmapped propriedade pages', () => {
		expect(resolvePropertyImageSlug('olimpia/custom-resort')).toBe('custom-resort');
	});
});

describe('hasDedicatedPropertyGallery', () => {
	it('returns true for mapped property pages', () => {
		expect(hasDedicatedPropertyGallery('olimpia/hot-beach')).toBe(true);
		expect(hasDedicatedPropertyGallery('olimpia/enjoy-solar-das-aguas')).toBe(true);
	});

	it('returns false for attraction pages without a hotel folder', () => {
		expect(hasDedicatedPropertyGallery('olimpia/thermas-dos-laranjais')).toBe(false);
	});
});

describe('shouldShowPageCarousel', () => {
	it('shows carousel for hub, propriedade and atracao with images', () => {
		const images = [{ src: '/images/hoteis/x/capa.jpg', alt: 'x' }];
		expect(shouldShowPageCarousel('hub', images)).toBe(true);
		expect(shouldShowPageCarousel('propriedade', images)).toBe(true);
		expect(shouldShowPageCarousel('atracao', images)).toBe(true);
	});

	it('hides carousel for venda and institucional pages', () => {
		const images = [{ src: '/images/hoteis/x/capa.jpg', alt: 'x' }];
		expect(shouldShowPageCarousel('venda', images)).toBe(false);
		expect(shouldShowPageCarousel('institucional', images)).toBe(false);
	});

	it('hides carousel when gallery is empty', () => {
		expect(shouldShowPageCarousel('propriedade', [])).toBe(false);
	});
});

describe('resolvePageGalleryImages', () => {
	it('resolves destination gallery for hub pages', () => {
		const result = resolvePageGalleryImages({
			entryId: 'olimpia',
			pageType: 'hub',
			explicitImages: [],
			label: 'Olímpia',
			basePath: '/images/_missing-gallery',
		});

		expect(result).toHaveLength(3);
		expect(result[0]?.src).toContain('unsplash');
	});

	it('resolves hotel gallery for propriedade pages', () => {
		const result = resolvePageGalleryImages({
			entryId: 'olimpia/enjoy-olimpia-park-resort',
			pageType: 'propriedade',
			explicitImages: [],
			label: 'Enjoy Olímpia Park Resort',
			basePath: '/images/_missing-gallery',
		});

		expect(result).toHaveLength(3);
		expect(result[0]?.alt).toContain('Enjoy Olímpia Park Resort');
	});

	it('uses destination gallery for atracao without dedicated hotel folder', () => {
		const result = resolvePageGalleryImages({
			entryId: 'olimpia/thermas-dos-laranjais',
			pageType: 'atracao',
			explicitImages: [],
			label: 'Thermas dos Laranjais',
			basePath: '/images/_missing-gallery',
		});

		expect(result).toHaveLength(3);
		expect(result[0]?.src).toContain('unsplash');
	});
});
