import { existsSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Given a public path like `/images/hero/capa.jpg`, prefer the sibling `.webp`
 * when it exists on disk. Falls back to the original path when WebP is absent.
 */
export function toWebpPublicPath(publicPath: string): string {
	return publicPath.replace(/\.(jpe?g|png|JPE?G|PNG)$/, '.webp');
}

export function preferWebpPublicPath(
	publicPath: string,
	publicRoot = join(process.cwd(), 'public'),
): string {
	const webpPath = toWebpPublicPath(publicPath);
	if (webpPath === publicPath) return publicPath;

	const relative = webpPath.replace(/^\//, '');
	if (existsSync(join(publicRoot, relative))) {
		return webpPath;
	}

	return publicPath;
}
