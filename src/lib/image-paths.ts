import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { HERO_BACKGROUND, HOTEL_FALLBACK_IMAGES } from './constants';

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
		'hot-beach-resort': '/images/hoteis/hot-beach-resort/capa.jpg',
		'thermas-park-resort-hot-beach-raizes':
			'/images/hoteis/thermas-park-resort-hot-beach-raizes/capa.jpg',
		'celebration-resort-olimpia': '/images/hoteis/celebration-resort-olimpia/capa.jpg',
		'carpe-diem-eco-resort-olimpia': '/images/hoteis/carpe-diem-eco-resort-olimpia/capa.jpg',
		'thermas-olimpia-resorts-mercure': '/images/hoteis/thermas-olimpia-resorts-mercure/capa.jpg',
		'hot-beach-suites': '/images/hoteis/hot-beach-suites/capa.jpg',
		'wyndham-royal-star-thermas-resort':
			'/images/hoteis/wyndham-royal-star-thermas-resort/capa.jpg',
		'villa-italia-olimpia': '/images/hoteis/villa-italia-olimpia/capa.jpg',
		'parque-das-aguas': '/images/hoteis/parque-das-aguas/capa.jpg',
		'carpe-diem-park-hotel': '/images/hoteis/carpe-diem-park-hotel/capa.jpg',
		'hotel-fazenda-haras': '/images/hoteis/hotel-fazenda-haras/capa.jpg',
		'hotel-dolce-dulce': '/images/hoteis/hotel-dolce-dulce/capa.jpg',
		'agua-viva-hotel': '/images/hoteis/agua-viva-hotel/capa.jpg',
		'tiffany-hotel': '/images/hoteis/tiffany-hotel/capa.jpg',
		'villa-rebellato': '/images/hoteis/villa-rebellato/capa.jpg',
		'gloria-hotel': '/images/hoteis/gloria-hotel/capa.jpg',
		'js-thermas-hotel': '/images/hoteis/js-thermas-hotel/capa.jpg',
		'prime-hotel-aguas-da-serra': '/images/hoteis/prime-hotel-aguas-da-serra/capa.jpg',
		'serra-madre-hotel': '/images/hoteis/serra-madre-hotel/capa.jpg',
		'thermas-paradise': '/images/hoteis/thermas-paradise/capa.jpg',
		'aguas-da-serra-rio-quente': '/images/hoteis/aguas-da-serra-rio-quente/capa.jpg',
		'hotel-giardino-rio-quente': '/images/hoteis/hotel-giardino-rio-quente/capa.jpg',
		'img-hotel-rio-quente': '/images/hoteis/img-hotel-rio-quente/capa.jpg',
		'park-veredas-resort': '/images/hoteis/park-veredas-resort/capa.jpg',
		'apartamentos-em-rio-quente': '/images/hoteis/apartamentos-em-rio-quente/capa.jpg',
		'hotel-luupi-rio-quente': '/images/hoteis/hotel-luupi-rio-quente/capa.jpg',
		'refugio-grand-premium': '/images/hoteis/refugio-grand-premium/capa.jpg',
		'hotel-cristal-rio-quente': '/images/hoteis/hotel-cristal-rio-quente/capa.jpg',
		'hotel-pousada-rio-quente': '/images/hoteis/hotel-pousada-rio-quente/capa.jpg',
		'eco-chales-rio-quente': '/images/hoteis/eco-chales-rio-quente/capa.jpg',
		'thermas-paradise-residence': '/images/hoteis/thermas-paradise-residence/capa.jpg',
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

function publicFileExists(publicPath: string): boolean {
	return existsSync(join(process.cwd(), 'public', publicPath));
}

export function resolvePublicImagePath(publicPath: string, fallback: string): string {
	return publicFileExists(publicPath) ? publicPath : fallback;
}

export function resolveHeroImagePath(): string {
	return resolvePublicImagePath(IMAGE_PATHS.hero, HERO_BACKGROUND);
}

export function getHotelImagePath(propertyId: string, index = 0): string {
	const slug = HOME_PROPERTY_IMAGE_SLUG[propertyId];
	const localPath = slug ? IMAGE_PATHS.hoteis[slug] : undefined;
	const fallback = HOTEL_FALLBACK_IMAGES[index % HOTEL_FALLBACK_IMAGES.length];

	if (!localPath) return fallback;
	return resolvePublicImagePath(localPath, fallback);
}
