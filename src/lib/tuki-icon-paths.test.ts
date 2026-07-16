import { describe, expect, it } from 'vitest';
import { toTukiIconWebpPath } from './tuki-icon-paths';

describe('toTukiIconWebpPath', () => {
	it('converts a PNG icon path to WebP', () => {
		expect(toTukiIconWebpPath('/images/icons/icone-aviao-tuki-viagens.png')).toBe(
			'/images/icons/icone-aviao-tuki-viagens.webp',
		);
	});

	it('returns an already-WebP path unchanged', () => {
		expect(toTukiIconWebpPath('/images/icons/icone-aviao-tuki-viagens.webp')).toBe(
			'/images/icons/icone-aviao-tuki-viagens.webp',
		);
	});

	it('rejects paths that are not under /images/icons/', () => {
		expect(() => toTukiIconWebpPath('/images/hoteis/foo.png')).toThrow(
			/must be under \/images\/icons\//i,
		);
	});
});
