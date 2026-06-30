/**
 * Caminhos canônicos para imagens locais em `public/`.
 * Enquanto o arquivo não existir na pasta, os componentes usam fallback (Unsplash).
 *
 * Convenção por hotel: `public/images/hoteis/<slug>/capa.jpg` (ou .webp)
 * Hero: `public/images/hero/capa.jpg`
 */
export const IMAGE_PATHS = {
	hero: '/images/hero/capa.jpg',
	hoteis: {
		'enjoy-olimpia-park-resort': '/images/hoteis/enjoy-olimpia-park-resort/capa.jpg',
		'wyndham-olimpia-royal-hotels': '/images/hoteis/wyndham-olimpia-royal-hotels/capa.jpg',
		'enjoy-solar-das-aguas': '/images/hoteis/enjoy-solar-das-aguas/capa.jpg',
		'hot-beach-olimpia': '/images/hoteis/hot-beach-olimpia/capa.jpg',
		'rio-quente-resorts': '/images/hoteis/rio-quente-resorts/capa.jpg',
		'nordeste-all-inclusive': '/images/hoteis/nordeste-all-inclusive/capa.jpg',
	},
	destinos: {
		olimpia: '/images/destinos/olimpia/capa.jpg',
		'rio-quente': '/images/destinos/rio-quente/capa.jpg',
		nordeste: '/images/destinos/nordeste/capa.jpg',
		pacotes: '/images/destinos/pacotes-brasil/capa.jpg',
		'rio-de-janeiro': '/images/destinos/rio-de-janeiro/capa.jpg',
		gramado: '/images/destinos/gramado/capa.jpg',
	},
} as const;

/** Mapeia o id de HOME_FEATURED_PROPERTIES para a pasta do hotel. */
export const HOME_PROPERTY_IMAGE_SLUG: Record<string, keyof typeof IMAGE_PATHS.hoteis> = {
	'enjoy-olimpia-park': 'enjoy-olimpia-park-resort',
	'wyndham-olimpia': 'wyndham-olimpia-royal-hotels',
	'enjoy-solar': 'enjoy-solar-das-aguas',
	'hot-beach': 'hot-beach-olimpia',
	'rio-quente-resorts': 'rio-quente-resorts',
	'nordeste-all-inclusive': 'nordeste-all-inclusive',
};

export function getHotelImagePath(propertyId: string): string | undefined {
	const slug = HOME_PROPERTY_IMAGE_SLUG[propertyId];
	if (!slug) return undefined;
	return IMAGE_PATHS.hoteis[slug];
}
