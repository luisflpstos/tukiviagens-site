const PRODUCTION_SITE_URL = 'https://www.tukiviagens.com.br';
const LOCAL_DEV_SITE_URL = 'http://localhost:4321';

type Env = Record<string, string | undefined>;

/** Canonical origin for sitemap, canonical tags and absolute URLs at build time. */
export function resolveSiteUrl(env: Env = process.env): string {
	const explicit = env.PUBLIC_SITE_URL?.trim().replace(/\/$/, '');
	if (explicit) return explicit;

	if (env.VERCEL_ENV === 'production') {
		return PRODUCTION_SITE_URL;
	}

	return LOCAL_DEV_SITE_URL;
}
