import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { IMAGE_PATHS } from './image-paths';
import { SITE_ROUTES } from './site-routes';

const OLIMPIA_HOTELS = [
	'villa-italia-olimpia',
	'parque-das-aguas',
	'hotel-fazenda-haras',
	'hotel-dolce-dulce',
	'agua-viva-hotel',
	'tiffany-hotel',
	'villa-rebellato',
	'gloria-hotel',
	'js-thermas-hotel',
] as const;

const OLIMPIA_RESORTS = [
	'thermas-park-resort-hot-beach-raizes',
	'wyndham-olimpia-royal-hotels',
	'celebration-resort-olimpia',
	'hot-beach-resort',
	'carpe-diem-eco-resort-olimpia',
	'enjoy-olimpia-park-resort',
	'thermas-olimpia-resorts-mercure',
	'enjoy-solar-das-aguas',
	'hot-beach-suites',
] as const;

const OLIMPIA_PROPERTIES = [...OLIMPIA_HOTELS, ...OLIMPIA_RESORTS] as const;

function routePath(slug: string): string {
	return `/olimpia/${slug}/`;
}

function contentPath(slug: string): string {
	return join(process.cwd(), 'src/content/paginas/olimpia', `${slug}.md`);
}

function imageFolderPath(slug: string): string {
	return join(process.cwd(), 'public/images/hoteis', slug);
}

describe('Olímpia content coverage', () => {
	it('registers all hotel and resort property routes', () => {
		const paths = new Set(SITE_ROUTES.map((route) => route.path));

		for (const slug of OLIMPIA_PROPERTIES) {
			expect(paths.has(routePath(slug)), `missing route ${routePath(slug)}`).toBe(true);
		}
	});

	it('has markdown content for every Olímpia property', () => {
		for (const slug of OLIMPIA_PROPERTIES) {
			expect(existsSync(contentPath(slug)), `missing content ${slug}.md`).toBe(true);
		}
	});

	it('maps every Olímpia property slug to an image folder', () => {
		for (const slug of OLIMPIA_PROPERTIES) {
			expect(slug in IMAGE_PATHS.hoteis, `missing image path for ${slug}`).toBe(true);
			expect(existsSync(imageFolderPath(slug)), `missing image folder ${slug}`).toBe(true);
		}
	});
});
