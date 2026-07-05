import type { PageType } from './site-routes';

export type HospitalityPageType = 'hotel' | 'resort';

export function isHospitalityPage(pageType: PageType): pageType is HospitalityPageType {
	return pageType === 'hotel' || pageType === 'resort';
}

export const OLIMPIA_HOTEL_SLUGS = new Set([
	'villa-italia-olimpia',
	'parque-das-aguas',
	'hotel-fazenda-haras',
	'hotel-dolce-dulce',
	'agua-viva-hotel',
	'tiffany-hotel',
	'villa-rebellato',
	'gloria-hotel',
	'js-thermas-hotel',
]);

export const OLIMPIA_RESORT_SLUGS = new Set([
	'thermas-park-resort-hot-beach-raizes',
	'wyndham-olimpia-royal-hotels',
	'celebration-resort-olimpia',
	'hot-beach-resort',
	'carpe-diem-eco-resort-olimpia',
	'enjoy-olimpia-park-resort',
	'thermas-olimpia-resorts-mercure',
	'enjoy-solar-das-aguas',
	'hot-beach-suites',
	'wyndham-royal-star-thermas-resort',
]);

export const RIO_QUENTE_HOTEL_SLUGS = new Set([
	'prime-hotel-aguas-da-serra',
	'serra-madre-hotel',
	'thermas-paradise',
	'aguas-da-serra-rio-quente',
	'hotel-giardino-rio-quente',
	'img-hotel-rio-quente',
	'apartamentos-em-rio-quente',
	'hotel-luupi-rio-quente',
	'hotel-pousada-rio-quente',
	'hotel-cristal-rio-quente',
	'eco-chales-rio-quente',
]);

export const RIO_QUENTE_RESORT_SLUGS = new Set([
	'refugio-grand-premium',
	'park-veredas-resort',
	'thermas-paradise-residence',
]);

export function resolveHospitalityPageType(entryId: string): HospitalityPageType | undefined {
	const slug = entryId.split('/').pop() ?? entryId;
	const silo = entryId.split('/')[0];

	if (silo === 'olimpia') {
		if (OLIMPIA_HOTEL_SLUGS.has(slug)) return 'hotel';
		if (OLIMPIA_RESORT_SLUGS.has(slug)) return 'resort';
	}

	if (silo === 'rio-quente') {
		if (RIO_QUENTE_HOTEL_SLUGS.has(slug)) return 'hotel';
		if (RIO_QUENTE_RESORT_SLUGS.has(slug)) return 'resort';
	}

	return undefined;
}
