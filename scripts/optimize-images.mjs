import { readdir, stat } from 'node:fs/promises';
import { join, extname, basename, dirname } from 'node:path';
import sharp from 'sharp';

const PUBLIC_ROOT = join(process.cwd(), 'public');
const IMAGE_DIRS = ['images/hoteis', 'images/destinos', 'images/resorts'];
const SOURCE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.JPG', '.JPEG', '.PNG']);
const MAX_WIDTH = { capa: 1600, default: 1200 };
const WEBP_QUALITY = 82;

async function walk(dir) {
	const entries = await readdir(dir, { withFileTypes: true });
	const files = [];

	for (const entry of entries) {
		const fullPath = join(dir, entry.name);
		if (entry.isDirectory()) {
			files.push(...(await walk(fullPath)));
			continue;
		}
		if (SOURCE_EXTENSIONS.has(extname(entry.name))) {
			files.push(fullPath);
		}
	}

	return files;
}

async function optimizeImage(filePath) {
	const relative = filePath.slice(PUBLIC_ROOT.length + 1);
	const slot = basename(filePath, extname(filePath));
	const maxWidth = slot === 'capa' ? MAX_WIDTH.capa : MAX_WIDTH.default;
	const webpPath = join(dirname(filePath), `${slot}.webp`);

	const sourceStat = await stat(filePath);
	const webpStat = await stat(webpPath).catch(() => null);
	if (webpStat && webpStat.mtimeMs >= sourceStat.mtimeMs) {
		console.log(`skip ${relative} (webp up to date)`);
		return;
	}

	const image = sharp(filePath);
	const metadata = await image.metadata();
	const width = metadata.width ?? maxWidth;
	const targetWidth = Math.min(width, maxWidth);

	await image
		.resize(targetWidth, null, { withoutEnlargement: true, fit: 'inside' })
		.webp({ quality: WEBP_QUALITY, effort: 4 })
		.toFile(webpPath);

	const outputStat = await stat(webpPath);
	const saved = ((sourceStat.size - outputStat.size) / sourceStat.size) * 100;
	console.log(
		`ok ${relative} → ${basename(webpPath)} (${Math.round(sourceStat.size / 1024)}KiB → ${Math.round(outputStat.size / 1024)}KiB, -${saved.toFixed(0)}%)`,
	);
}

async function main() {
	let total = 0;

	for (const dir of IMAGE_DIRS) {
		const fullDir = join(PUBLIC_ROOT, dir);
		try {
			const files = await walk(fullDir);
			for (const file of files) {
				await optimizeImage(file);
				total += 1;
			}
		} catch (error) {
			if (error && typeof error === 'object' && 'code' in error && error.code === 'ENOENT') {
				continue;
			}
			throw error;
		}
	}

	console.log(`\nDone. Processed ${total} source image(s).`);
}

main().catch((error) => {
	console.error(error);
	process.exit(1);
});
