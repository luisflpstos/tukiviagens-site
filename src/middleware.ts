import { defineMiddleware } from 'astro:middleware';
import { BLOCK_INDEXING } from './lib/seo';

// Com `output: 'static'`, este middleware só roda em runtime nas rotas `/api/*`; páginas
// prerenderizadas não recebem estes headers. Headers de segurança ficam no vercel.json.
export const onRequest = defineMiddleware(async (_context, next) => {
	const response = await next();

	if (BLOCK_INDEXING) {
		response.headers.set('X-Robots-Tag', 'noindex, nofollow');
	}

	return response;
});
