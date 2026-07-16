import { BRAND } from './constants';
import { resolveMascotImagePath } from './mascot-paths';

export type LeadCaptureSectionAssets = {
	mascotSrc: string;
	mascotAlt: string;
};

type MascotPathResolver = (path: string) => string;

/**
 * Presentation assets for the shared lead capture section (form + mascot column).
 */
export function getLeadCaptureSectionAssets(
	resolveMascot: MascotPathResolver = resolveMascotImagePath,
): LeadCaptureSectionAssets {
	return {
		mascotSrc: resolveMascot(BRAND.mascot.hero),
		mascotAlt: 'Tuki com a mala de viagem',
	};
}
