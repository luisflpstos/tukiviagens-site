import { mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { preferWebpPublicPath, toWebpPublicPath } from './prefer-webp-path';

const PUBLIC_ROOT = join(process.cwd(), 'public');
const FIXTURE_DIR = join(PUBLIC_ROOT, '_test-prefer-webp');

describe('toWebpPublicPath', () => {
	it('converts jpg/jpeg/png extensions to webp', () => {
		expect(toWebpPublicPath('/images/hero/capa.jpg')).toBe('/images/hero/capa.webp');
		expect(toWebpPublicPath('/images/destinos/rio-quente/capa.jpeg')).toBe(
			'/images/destinos/rio-quente/capa.webp',
		);
		expect(toWebpPublicPath('/images/mascot/tuki-frente-mala.png')).toBe(
			'/images/mascot/tuki-frente-mala.webp',
		);
	});

	it('leaves webp paths unchanged', () => {
		expect(toWebpPublicPath('/images/hero/capa.webp')).toBe('/images/hero/capa.webp');
	});
});

describe('preferWebpPublicPath', () => {
	beforeEach(() => {
		mkdirSync(FIXTURE_DIR, { recursive: true });
	});

	afterEach(() => {
		rmSync(FIXTURE_DIR, { recursive: true, force: true });
	});

	it('returns webp when sibling file exists', () => {
		writeFileSync(join(FIXTURE_DIR, 'capa.webp'), 'webp');

		expect(preferWebpPublicPath('/_test-prefer-webp/capa.jpg', PUBLIC_ROOT)).toBe(
			'/_test-prefer-webp/capa.webp',
		);
	});

	it('keeps original path when webp is missing', () => {
		writeFileSync(join(FIXTURE_DIR, 'capa.jpg'), 'jpg');

		expect(preferWebpPublicPath('/_test-prefer-webp/capa.jpg', PUBLIC_ROOT)).toBe(
			'/_test-prefer-webp/capa.jpg',
		);
	});
});
