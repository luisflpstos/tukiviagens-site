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

const GALLERY_SLOTS = ['capa', '01', '02', '03', '04', '05'] as const;
const PLACEHOLDER_COUNT = 3;

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

function toPublicPath(basePath: string, category: GalleryCategory, slug: string, slot: string): string {
	return `${basePath}/${category}/${slug}/${slot}.jpg`;
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
		return resolved;
	}

	for (const slot of GALLERY_SLOTS) {
		const imagePath = toPublicPath(basePath, category, slug, slot);
		if (!publicFileExists(imagePath, publicRoot)) continue;

		resolved.push({
			src: imagePath,
			alt: `${label} — foto ${resolved.length + 1}`,
		});
	}

	if (resolved.length > 0) {
		return resolved;
	}

	return Array.from({ length: PLACEHOLDER_COUNT }, (_, index) => ({
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
