import { defineMiddleware } from 'astro:middleware';
import { BLOCK_INDEXING } from './lib/seo';

export const onRequest = defineMiddleware(async (_context, next) => {
	const response = await next();

	if (BLOCK_INDEXING) {
		response.headers.set('X-Robots-Tag', 'noindex, nofollow');
	}

	return response;
});
