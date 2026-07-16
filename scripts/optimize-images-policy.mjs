/** Shared sizing/quality policy for `optimize-images.mjs` (unit-tested). */

export const IMAGE_DIRS = [
	'images/hoteis',
	'images/destinos',
	'images/resorts',
	'images/icons',
	'images/hero',
	'images/mascot',
	'images/paginas',
];

export const MAX_WIDTH = {
	capa: 1600,
	icons: 304,
	mascot: 800,
	default: 1200,
};

export const WEBP_QUALITY = 82;
export const ICONS_WEBP_QUALITY = 85;

/**
 * @param {string} relativePath path under public/, e.g. images/mascot/foo.png
 * @param {string} slot basename without extension
 */
export function resolveMaxWidth(relativePath, slot) {
	if (relativePath.startsWith('images/icons/')) {
		return MAX_WIDTH.icons;
	}
	if (relativePath.startsWith('images/mascot/')) {
		return MAX_WIDTH.mascot;
	}
	return slot === 'capa' ? MAX_WIDTH.capa : MAX_WIDTH.default;
}

/**
 * @param {string} relativePath
 */
export function resolveWebpQuality(relativePath) {
	return relativePath.startsWith('images/icons/') ? ICONS_WEBP_QUALITY : WEBP_QUALITY;
}
