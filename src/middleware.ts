import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { defineMiddleware } from 'astro:middleware';
import { BLOCK_INDEXING } from './lib/seo';

const STATIC_ASSET_PREFIXES = ['/images/', '/icons/', '/logotipo/', '/Logotipo/'] as const;
const STATIC_ASSET_EXTENSIONS = /\.(avif|gif|ico|jpe?g|png|svg|webp)$/i;

function isStaticAssetPath(pathname: string) {
	return (
		STATIC_ASSET_PREFIXES.some((prefix) => pathname.startsWith(prefix)) ||
		STATIC_ASSET_EXTENSIONS.test(pathname)
	);
}

export const onRequest = defineMiddleware(async (context, next) => {
	const { pathname } = context.url;

	if (isStaticAssetPath(pathname)) {
		const publicPath = join(process.cwd(), 'public', pathname);
		if (!existsSync(publicPath)) {
			return new Response(null, { status: 404 });
		}
	}

	const response = await next();

	if (BLOCK_INDEXING) {
		response.headers.set('X-Robots-Tag', 'noindex, nofollow');
	}

	return response;
});
