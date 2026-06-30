import { SITE } from './constants';

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
	const ogImage = image ?? `${SITE.url}/og-default.jpg`;

	return {
		title: fullTitle,
		description,
		canonical,
		ogImage,
		noindex,
		type,
	};
}

export function buildWhatsAppUrl(phone: string, message: string): string {
	const encoded = encodeURIComponent(message);
	return `https://wa.me/${phone.replace(/\D/g, '')}?text=${encoded}`;
}
