import { existsSync } from 'node:fs';
import { join } from 'node:path';

export type GalleryCategory = 'hoteis' | 'destinos';

export interface GalleryImage {
	src: string;
	alt: string;
}

export interface ResolveGalleryImagesOptions {
	slug: string;
	category: GalleryCategory;
	explicitImages?: string[];
	fallbacks: readonly string[];
	label: string;
	publicRoot?: string;
	basePath?: string;
}

export const GALLERY_SLOTS = ['capa', '01', '02', '03', '04', '05'] as const;
export const GALLERY_MAX_IMAGES = GALLERY_SLOTS.length;

const GALLERY_EXTENSIONS = ['.jpg', '.jpeg', '.JPG', '.JPEG', '.webp', '.png'] as const;

export function buildGalleryImageCandidates(slug: string, category: GalleryCategory): string[] {
	const base = `/images/${category}/${slug}`;
	return GALLERY_SLOTS.map((slot) => `${base}/${slot}.jpg`);
}

function publicFileExists(publicPath: string, publicRoot = join(process.cwd(), 'public')): boolean {
	const relativePath = publicPath.replace(/^\//, '');
	return existsSync(join(publicRoot, relativePath));
}

function resolvePublicImagePath(
	publicPath: string,
	fallback: string,
	publicRoot = join(process.cwd(), 'public'),
): string {
	return publicFileExists(publicPath, publicRoot) ? publicPath : fallback;
}

function resolveSlotImagePath(
	basePath: string,
	category: GalleryCategory,
	slug: string,
	slot: string,
	publicRoot = join(process.cwd(), 'public'),
): string | undefined {
	for (const extension of GALLERY_EXTENSIONS) {
		const imagePath = `${basePath}/${category}/${slug}/${slot}${extension}`;
		if (publicFileExists(imagePath, publicRoot)) return imagePath;
	}

	return undefined;
}

function uniqueImages(images: GalleryImage[]): GalleryImage[] {
	const seen = new Set<string>();

	return images.filter((image) => {
		if (seen.has(image.src)) return false;
		seen.add(image.src);
		return true;
	});
}

export function resolveGalleryImages({
	slug,
	category,
	explicitImages = [],
	fallbacks,
	label,
	publicRoot = join(process.cwd(), 'public'),
	basePath = '/images',
}: ResolveGalleryImagesOptions): GalleryImage[] {
	const resolved: GalleryImage[] = [];

	for (const imagePath of explicitImages) {
		if (!publicFileExists(imagePath, publicRoot)) continue;

		resolved.push({
			src: imagePath,
			alt: `${label} — foto ${resolved.length + 1}`,
		});
	}

	if (resolved.length > 0) {
		return resolved.slice(0, GALLERY_MAX_IMAGES);
	}

	for (const slot of GALLERY_SLOTS) {
		const imagePath = resolveSlotImagePath(basePath, category, slug, slot, publicRoot);
		if (!imagePath) continue;

		resolved.push({
			src: imagePath,
			alt: `${label} — foto ${resolved.length + 1}`,
		});
	}

	if (resolved.length > 0) {
		return resolved.slice(0, GALLERY_MAX_IMAGES);
	}

	return Array.from({ length: GALLERY_MAX_IMAGES }, (_, index) => ({
		src: fallbacks[index % fallbacks.length] ?? fallbacks[0] ?? '',
		alt: `${label} — foto ${index + 1}`,
	})).filter((image) => image.src.length > 0);
}

export function shouldShowGallery(images: GalleryImage[]): boolean {
	return images.length > 0;
}

export function resolveExplicitGalleryImages(
	explicitImages: string[],
	fallbacks: readonly string[],
): string[] {
	return explicitImages.map((imagePath, index) =>
		resolvePublicImagePath(imagePath, fallbacks[index % fallbacks.length] ?? fallbacks[0] ?? ''),
	);
}
