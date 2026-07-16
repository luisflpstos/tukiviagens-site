import { BRAND } from './constants';
import { resolveMascotImagePath } from './mascot-paths';

export type FaqSectionAssets = {
	mascotSrc: string;
	mascotAlt: string;
};

type MascotPathResolver = (path: string) => string;

/**
 * Presentation assets for the shared FAQ section (questions + mascot column).
 */
export function getFaqSectionAssets(
	resolveMascot: MascotPathResolver = resolveMascotImagePath,
): FaqSectionAssets {
	return {
		mascotSrc: resolveMascot(BRAND.mascot.selfie),
		mascotAlt: 'Tuki tirando selfie com o celular',
	};
}
