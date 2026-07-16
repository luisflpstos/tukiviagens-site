import { mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { resolveMascotImagePath } from './mascot-paths';

const TEST_DIR = join(process.cwd(), 'public/images/mascot/_test-resolve');

describe('resolveMascotImagePath', () => {
	beforeEach(() => {
		mkdirSync(TEST_DIR, { recursive: true });
	});

	afterEach(() => {
		rmSync(TEST_DIR, { recursive: true, force: true });
	});

	it('prefers webp when optimized sibling exists', () => {
		writeFileSync(join(TEST_DIR, 'hero.png'), 'png');
		writeFileSync(join(TEST_DIR, 'hero.webp'), 'webp');

		expect(resolveMascotImagePath('/images/mascot/_test-resolve/hero.png')).toBe(
			'/images/mascot/_test-resolve/hero.webp',
		);
	});

	it('keeps png when webp is absent', () => {
		writeFileSync(join(TEST_DIR, 'hero.png'), 'png');

		expect(resolveMascotImagePath('/images/mascot/_test-resolve/hero.png')).toBe(
			'/images/mascot/_test-resolve/hero.png',
		);
	});

	it('rejects paths outside /images/mascot/', () => {
		expect(() => resolveMascotImagePath('/images/hero/capa.png')).toThrow(
			/must be under \/images\/mascot\//i,
		);
	});
});
