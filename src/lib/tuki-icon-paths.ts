const ICONS_PREFIX = '/images/icons/';

/**
 * Converts a brand icon public path to its optimized WebP counterpart.
 * Source PNGs remain on disk; the site serves the resized WebP from prebuild.
 */
export function toTukiIconWebpPath(path: string): string {
	if (!path.startsWith(ICONS_PREFIX)) {
		throw new Error(`Tuki icon path must be under ${ICONS_PREFIX}`);
	}

	if (path.endsWith('.webp')) {
		return path;
	}

	return path.replace(/\.(png|PNG)$/, '.webp');
}
