import { DESTINATION_FALLBACK_IMAGES, HOTEL_FALLBACK_IMAGES } from './constants';
import {
	resolveGalleryImages,
	shouldShowGallery,
	type GalleryImage,
} from './gallery-images';
import { IMAGE_PATHS } from './image-paths';
import type { PageType } from './site-routes';

const PROPERTY_IMAGE_SLUG_OVERRIDES: Record<string, string> = {
	'olimpia/hot-beach': 'hot-beach-olimpia',
};

const CAROUSEL_PAGE_TYPES = new Set<PageType>(['hub', 'propriedade', 'atracao']);

export function resolvePropertyImageSlug(entryId: string): string {
	const override = PROPERTY_IMAGE_SLUG_OVERRIDES[entryId];
	if (override) return override;

	const parts = entryId.split('/');
	return parts[parts.length - 1] ?? entryId;
}

export function hasDedicatedPropertyGallery(entryId: string): boolean {
	if (entryId in PROPERTY_IMAGE_SLUG_OVERRIDES) return true;

	const slug = resolvePropertyImageSlug(entryId);
	return slug in IMAGE_PATHS.hoteis;
}

export function shouldShowPageCarousel(pageType: PageType, galleryImages: GalleryImage[]): boolean {
	return CAROUSEL_PAGE_TYPES.has(pageType) && shouldShowGallery(galleryImages);
}

export interface ResolvePageGalleryImagesOptions {
	entryId: string;
	pageType: PageType;
	explicitImages?: string[];
	label: string;
	basePath?: string;
}

export function resolvePageGalleryImages({
	entryId,
	pageType,
	explicitImages = [],
	label,
	basePath,
}: ResolvePageGalleryImagesOptions): GalleryImage[] {
	const destinationSlug = entryId.split('/')[0] ?? entryId;

	if (pageType === 'hub') {
		return resolveGalleryImages({
			slug: destinationSlug,
			category: 'destinos',
			explicitImages,
			fallbacks: DESTINATION_FALLBACK_IMAGES,
			label,
			basePath,
		});
	}

	if (pageType === 'propriedade' || pageType === 'atracao') {
		const useHotelGallery = pageType === 'propriedade' || hasDedicatedPropertyGallery(entryId);

		return resolveGalleryImages({
			slug: useHotelGallery ? resolvePropertyImageSlug(entryId) : destinationSlug,
			category: useHotelGallery ? 'hoteis' : 'destinos',
			explicitImages,
			fallbacks: useHotelGallery ? HOTEL_FALLBACK_IMAGES : DESTINATION_FALLBACK_IMAGES,
			label,
			basePath,
		});
	}

	return [];
}
