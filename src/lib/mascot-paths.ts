import { preferWebpPublicPath } from './prefer-webp-path';

const MASCOT_PREFIX = '/images/mascot/';

/**
 * Resolves a mascot public path to its optimized WebP when available.
 * Source PNGs remain on disk for the prebuild Sharp pipeline.
 */
export function resolveMascotImagePath(
	path: string,
	publicRoot?: string,
): string {
	if (!path.startsWith(MASCOT_PREFIX)) {
		throw new Error(`Mascot path must be under ${MASCOT_PREFIX}`);
	}

	return preferWebpPublicPath(path, publicRoot);
}
