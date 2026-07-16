import { describe, expect, it } from 'vitest';
import { BRAND } from './constants';
import { getLeadCaptureSectionAssets } from './lead-capture-section';

describe('getLeadCaptureSectionAssets', () => {
	it('uses the suitcase mascot as the lead form side image', () => {
		const resolveMascot = (path: string) => `resolved:${path}`;

		expect(getLeadCaptureSectionAssets(resolveMascot)).toEqual({
			mascotSrc: `resolved:${BRAND.mascot.hero}`,
			mascotAlt: 'Tuki com a mala de viagem',
		});
	});

	it('resolves the default suitcase path through the injected resolver', () => {
		const seen: string[] = [];
		const resolveMascot = (path: string) => {
			seen.push(path);
			return path.replace(/\.png$/, '.webp');
		};

		const assets = getLeadCaptureSectionAssets(resolveMascot);

		expect(seen).toEqual([BRAND.mascot.hero]);
		expect(assets.mascotSrc).toBe('/images/mascot/tuki-frente-mala.webp');
	});
});
