import { describe, expect, it } from 'vitest';
import { BRAND } from './constants';
import { getFaqSectionAssets } from './faq-section';

describe('getFaqSectionAssets', () => {
	it('uses the selfie mascot as the FAQ side image', () => {
		const resolveMascot = (path: string) => `resolved:${path}`;

		expect(getFaqSectionAssets(resolveMascot)).toEqual({
			mascotSrc: `resolved:${BRAND.mascot.selfie}`,
			mascotAlt: 'Tuki tirando selfie com o celular',
		});
	});

	it('resolves the default selfie path through the injected resolver', () => {
		const seen: string[] = [];
		const resolveMascot = (path: string) => {
			seen.push(path);
			return path.replace(/\.png$/, '.webp');
		};

		const assets = getFaqSectionAssets(resolveMascot);

		expect(seen).toEqual([BRAND.mascot.selfie]);
		expect(assets.mascotSrc).toBe('/images/mascot/tuki-celular-selfie.webp');
	});
});
