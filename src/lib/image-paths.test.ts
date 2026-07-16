import { existsSync, mkdirSync, writeFileSync, unlinkSync } from 'node:fs';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { getHotelImagePath, resolveHeroImagePath } from './image-paths';

const PUBLIC_ROOT = join(process.cwd(), 'public');
const HERO_WEBP = join(PUBLIC_ROOT, 'images/hero/capa.webp');
const WYNDHAM_WEBP = join(
	PUBLIC_ROOT,
	'images/hoteis/wyndham-olimpia-royal-hotels/capa.webp',
);

describe('resolveHeroImagePath', () => {
	let createdHeroWebp = false;

	afterEach(() => {
		if (createdHeroWebp && existsSync(HERO_WEBP)) {
			unlinkSync(HERO_WEBP);
		}
		createdHeroWebp = false;
	});

	it('prefers hero capa.webp when it exists alongside capa.jpg', () => {
		mkdirSync(join(PUBLIC_ROOT, 'images/hero'), { recursive: true });
		if (!existsSync(HERO_WEBP)) {
			writeFileSync(HERO_WEBP, 'webp');
			createdHeroWebp = true;
		}

		expect(resolveHeroImagePath()).toBe('/images/hero/capa.webp');
	});
});

describe('getHotelImagePath', () => {
	let createdWyndhamWebp = false;

	afterEach(() => {
		if (createdWyndhamWebp && existsSync(WYNDHAM_WEBP)) {
			unlinkSync(WYNDHAM_WEBP);
		}
		createdWyndhamWebp = false;
	});

	it('prefers wyndham capa.webp over capa.jpg when webp exists', () => {
		mkdirSync(join(PUBLIC_ROOT, 'images/hoteis/wyndham-olimpia-royal-hotels'), {
			recursive: true,
		});
		if (!existsSync(WYNDHAM_WEBP)) {
			writeFileSync(WYNDHAM_WEBP, 'webp');
			createdWyndhamWebp = true;
		}

		expect(getHotelImagePath('wyndham-olimpia')).toBe(
			'/images/hoteis/wyndham-olimpia-royal-hotels/capa.webp',
		);
	});
});
