import { SITE, BRAND } from './constants';

/** When true, blocks all search engine indexing (robots.txt, meta, X-Robots-Tag). */
export const BLOCK_INDEXING = import.meta.env.PUBLIC_BLOCK_INDEXING === 'true';

export interface SeoProps {
	title: string;
	description: string;
	path?: string;
	image?: string;
	noindex?: boolean;
	type?: 'website' | 'article';
}

export function buildCanonical(path = '/'): string {
	const base = SITE.url.replace(/\/$/, '');
	const normalized = path.startsWith('/') ? path : `/${path}`;
	return `${base}${normalized}`;
}

export function buildSeo({
	title,
	description,
	path = '/',
	image,
	noindex = false,
	type = 'website',
}: SeoProps) {
	const canonical = buildCanonical(path);
	const fullTitle = title.includes(SITE.name) ? title : `${title} | ${SITE.name}`;
	const ogImage = image ?? `${SITE.url}${BRAND.ogImage}`;

	return {
		title: fullTitle,
		description,
		canonical,
		ogImage,
		noindex,
		type,
	};
}

/**
 * Serializa JSON-LD para `<script type="application/ld+json">`.
 * Escapa `<`, `>` e `&` para que um `</script>` no conteúdo não feche a tag.
 */
export function serializeJsonLd(data: unknown): string {
	return JSON.stringify(data)
		.replace(/</g, '\\u003c')
		.replace(/>/g, '\\u003e')
		.replace(/&/g, '\\u0026');
}

export function buildWhatsAppUrl(phone: string, message: string): string {
	const encoded = encodeURIComponent(message);
	return `https://wa.me/${phone.replace(/\D/g, '')}?text=${encoded}`;
}
