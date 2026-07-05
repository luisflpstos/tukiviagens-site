import { existsSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
	buildGalleryImageCandidates,
	GALLERY_MAX_IMAGES,
	resolveGalleryImages,
	shouldShowGallery,
} from './gallery-images';

const FIXTURE_ROOT = join(process.cwd(), 'public/images/_test-gallery');

function writeFixture(relativePath: string) {
	const fullPath = join(FIXTURE_ROOT, relativePath);
	mkdirSync(join(fullPath, '..'), { recursive: true });
	writeFileSync(fullPath, 'fixture');
}

describe('buildGalleryImageCandidates', () => {
	it('returns ordered jpg paths for hotel slug', () => {
		expect(buildGalleryImageCandidates('enjoy-solar-das-aguas', 'hoteis')).toEqual([
			'/images/hoteis/enjoy-solar-das-aguas/capa.jpg',
			'/images/hoteis/enjoy-solar-das-aguas/01.jpg',
			'/images/hoteis/enjoy-solar-das-aguas/02.jpg',
			'/images/hoteis/enjoy-solar-das-aguas/03.jpg',
			'/images/hoteis/enjoy-solar-das-aguas/04.jpg',
			'/images/hoteis/enjoy-solar-das-aguas/05.jpg',
		]);
	});

	it('returns ordered jpg paths for destination slug', () => {
		expect(buildGalleryImageCandidates('olimpia', 'destinos')[0]).toBe(
			'/images/destinos/olimpia/capa.jpg',
		);
	});
});

describe('resolveGalleryImages', () => {
	beforeEach(() => {
		mkdirSync(FIXTURE_ROOT, { recursive: true });
	});

	afterEach(() => {
		rmSync(FIXTURE_ROOT, { recursive: true, force: true });
	});

	it('prefers explicit frontmatter images when files exist', () => {
		writeFixture('hoteis/sample-hotel/capa.jpg');
		writeFixture('hoteis/sample-hotel/01.jpg');

		const result = resolveGalleryImages({
			slug: 'sample-hotel',
			category: 'hoteis',
			explicitImages: ['/images/_test-gallery/hoteis/sample-hotel/capa.jpg'],
			fallbacks: ['https://example.com/fallback.jpg'],
			label: 'Enjoy Solar das Águas',
		});

		expect(result).toEqual([
			{
				src: '/images/_test-gallery/hoteis/sample-hotel/capa.jpg',
				alt: 'Enjoy Solar das Águas — foto 1',
			},
		]);
	});

	it('discovers local gallery files in slug folder', () => {
		const fixtureBase = join(process.cwd(), 'public/images/_test-gallery');
		writeFixture('destinos/olimpia/capa.jpg');
		writeFixture('destinos/olimpia/02.jpg');

		const result = resolveGalleryImages({
			slug: 'olimpia',
			category: 'destinos',
			explicitImages: [],
			fallbacks: ['https://example.com/fallback-1.jpg', 'https://example.com/fallback-2.jpg'],
			label: 'Olímpia',
			basePath: '/images/_test-gallery',
		});

		expect(result.map((image) => image.src)).toEqual([
			'/images/_test-gallery/destinos/olimpia/capa.jpg',
			'/images/_test-gallery/destinos/olimpia/02.jpg',
		]);

		rmSync(fixtureBase, { recursive: true, force: true });
	});

	it('uses fallbacks when no local images exist', () => {
		const result = resolveGalleryImages({
			slug: 'missing-hotel',
			category: 'hoteis',
			explicitImages: [],
			fallbacks: ['https://example.com/fallback-1.jpg', 'https://example.com/fallback-2.jpg'],
			label: 'Hotel exemplo',
			basePath: '/images/_test-gallery',
		});

		expect(result).toHaveLength(GALLERY_MAX_IMAGES);
		expect(result[0]?.src).toBe('https://example.com/fallback-1.jpg');
		expect(result[0]?.alt).toBe('Hotel exemplo — foto 1');
	});

	it('discovers gallery files with alternate extensions', () => {
		writeFixture('destinos/olimpia/capa.png');
		writeFixture('destinos/olimpia/01.png');
		writeFixture('destinos/olimpia/02.JPG');
		writeFixture('destinos/olimpia/03.jpg');

		const result = resolveGalleryImages({
			slug: 'olimpia',
			category: 'destinos',
			explicitImages: [],
			fallbacks: ['https://example.com/fallback.jpg'],
			label: 'Olímpia',
			basePath: '/images/_test-gallery',
		});

		expect(result.map((image) => image.src)).toEqual([
			'/images/_test-gallery/destinos/olimpia/capa.png',
			'/images/_test-gallery/destinos/olimpia/01.png',
			'/images/_test-gallery/destinos/olimpia/02.JPG',
			'/images/_test-gallery/destinos/olimpia/03.jpg',
		]);
	});

	it('caps explicit frontmatter images at gallery max', () => {
		const explicitImages = Array.from({ length: 8 }, (_, index) => {
			const slot = String(index).padStart(2, '0');
			writeFixture(`hoteis/sample-hotel/${slot}.jpg`);
			return `/images/_test-gallery/hoteis/sample-hotel/${slot}.jpg`;
		});

		const result = resolveGalleryImages({
			slug: 'sample-hotel',
			category: 'hoteis',
			explicitImages,
			fallbacks: ['https://example.com/fallback.jpg'],
			label: 'Hotel exemplo',
		});

		expect(result).toHaveLength(GALLERY_MAX_IMAGES);
	});
});

describe('shouldShowGallery', () => {
	it('returns true when at least one image is resolved', () => {
		expect(shouldShowGallery([{ src: '/images/hoteis/x/capa.jpg', alt: 'x' }])).toBe(true);
	});

	it('returns false when gallery is empty', () => {
		expect(shouldShowGallery([])).toBe(false);
	});
});
