import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { IMAGE_PATHS } from './image-paths';
import { SITE_ROUTES } from './site-routes';

const RIO_QUENTE_HOTELS = [
	'prime-hotel-aguas-da-serra',
	'serra-madre-hotel',
	'thermas-paradise',
	'aguas-da-serra-rio-quente',
	'hotel-giardino-rio-quente',
	'img-hotel-rio-quente',
	'park-veredas-resort',
	'apartamentos-em-rio-quente',
	'hotel-luupi-rio-quente',
	'refugio-grand-premium',
] as const;

const RIO_QUENTE_RESORTS = [
	'hotel-cristal-rio-quente',
	'refugio-grand-premium',
	'hotel-pousada-rio-quente',
	'hotel-giardino-rio-quente',
	'hotel-luupi-rio-quente',
	'eco-chales-rio-quente',
	'park-veredas-resort',
	'img-hotel-rio-quente',
	'prime-hotel-aguas-da-serra',
	'thermas-paradise-residence',
] as const;

const RIO_QUENTE_PROPERTIES = [...new Set([...RIO_QUENTE_HOTELS, ...RIO_QUENTE_RESORTS])] as const;

function routePath(slug: string): string {
	return `/rio-quente/${slug}/`;
}

function contentPath(slug: string): string {
	return join(process.cwd(), 'src/content/paginas/rio-quente', `${slug}.md`);
}

function imageFolderPath(slug: string): string {
	return join(process.cwd(), 'public/images/hoteis', slug);
}

describe('Rio Quente content coverage', () => {
	it('registers all hotel and resort property routes', () => {
		const paths = new Set(SITE_ROUTES.map((route) => route.path));

		for (const slug of RIO_QUENTE_PROPERTIES) {
			expect(paths.has(routePath(slug)), `missing route ${routePath(slug)}`).toBe(true);
		}
	});

	it('has markdown content for every Rio Quente property', () => {
		for (const slug of RIO_QUENTE_PROPERTIES) {
			expect(existsSync(contentPath(slug)), `missing content ${slug}.md`).toBe(true);
		}
	});

	it('maps every Rio Quente property slug to an image folder', () => {
		for (const slug of RIO_QUENTE_PROPERTIES) {
			expect(slug in IMAGE_PATHS.hoteis, `missing image path for ${slug}`).toBe(true);
			expect(existsSync(imageFolderPath(slug)), `missing image folder ${slug}`).toBe(true);
		}
	});
});
