import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { IMAGE_PATHS } from './image-paths';
import { SITE_ROUTES } from './site-routes';

const CALDAS_NOVAS_PROPERTIES = ['lacqua-diroma-iii'] as const;

const CALDAS_NOVAS_LISTING_PAGES = ['hoteis', 'resorts'] as const;

function routePath(slug: string): string {
	return `/caldas-novas/${slug}/`;
}

function contentPath(slug: string): string {
	return join(process.cwd(), 'src/content/paginas/caldas-novas', `${slug}.md`);
}

function hubContentPath(): string {
	return join(process.cwd(), 'src/content/paginas/caldas-novas.md');
}

function imageFolderPath(slug: string): string {
	return join(process.cwd(), 'public/images/hoteis', slug);
}

function destinoFolderPath(): string {
	return join(process.cwd(), 'public/images/destinos/caldas-novas');
}

describe('Caldas Novas content coverage', () => {
	it('registers hub, listing and property routes', () => {
		const paths = new Set(SITE_ROUTES.map((route) => route.path));

		expect(paths.has('/caldas-novas/'), 'missing hub /caldas-novas/').toBe(true);
		for (const slug of CALDAS_NOVAS_LISTING_PAGES) {
			expect(paths.has(routePath(slug)), `missing route ${routePath(slug)}`).toBe(true);
		}
		for (const slug of CALDAS_NOVAS_PROPERTIES) {
			expect(paths.has(routePath(slug)), `missing route ${routePath(slug)}`).toBe(true);
		}
	});

	it('has markdown content for hub, listings and properties', () => {
		expect(existsSync(hubContentPath()), 'missing caldas-novas.md').toBe(true);
		for (const slug of CALDAS_NOVAS_LISTING_PAGES) {
			expect(existsSync(contentPath(slug)), `missing content ${slug}.md`).toBe(true);
		}
		for (const slug of CALDAS_NOVAS_PROPERTIES) {
			expect(existsSync(contentPath(slug)), `missing content ${slug}.md`).toBe(true);
		}
	});

	it('maps destination and property image folders', () => {
		expect('caldas-novas' in IMAGE_PATHS.destinos, 'missing destinos.caldas-novas').toBe(true);
		expect(existsSync(destinoFolderPath()), 'missing destinos/caldas-novas folder').toBe(true);

		for (const slug of CALDAS_NOVAS_PROPERTIES) {
			expect(slug in IMAGE_PATHS.hoteis, `missing image path for ${slug}`).toBe(true);
			expect(existsSync(imageFolderPath(slug)), `missing image folder ${slug}`).toBe(true);
		}
	});
});

describe('/caldas-novas/ hub SEO page', () => {
	it('answers the main intent early and links hotels and Rio Quente without currency values', () => {
		const body = readFileSync(hubContentPath(), 'utf8');
		expect(body).toMatch(/Caldas Novas/);
		expect(body).toMatch(/águas termais/i);
		expect(body).toContain('/caldas-novas/lacqua-diroma-iii/');
		expect(body).toContain('/caldas-novas/hoteis/');
		expect(body).toContain('/rio-quente/');
		expect(body).not.toMatch(/R\$\s*\d/);
	});

	it('avoids uncertain phrasing, em dashes and meta jargon in visible copy', () => {
		const body = readFileSync(hubContentPath(), 'utf8');
		const visible = body.replace(/^---[\s\S]*?---\n/, '');

		expect(visible).not.toContain('—');
		expect(visible).not.toMatch(/\bsilo\b/i);
		expect(visible).not.toMatch(/\bcluster\b/i);
		expect(visible).not.toMatch(/também escrito\s+Lacqua/i);
		expect(visible).not.toMatch(/costumam|costuma|provavelmente|pode ser|em geral|tipicamente/i);
		expect(visible).not.toMatch(/não assuma|não trate como|não assumir/i);
	});
});

describe('/caldas-novas/resorts/ SEO listing page', () => {
	it('lists Lacqua diRoma III and links related pages without currency values', () => {
		const body = readFileSync(contentPath('resorts'), 'utf8');
		expect(body).toMatch(/L'?acqua diRoma III/i);
		expect(body).toContain('/caldas-novas/lacqua-diroma-iii/');
		expect(body).toContain('/caldas-novas/');
		expect(body).toContain('/caldas-novas/hoteis/');
		expect(body).toContain('/rio-quente/');
		expect(body).toMatch(/## Como cotar/);
		expect(body).not.toMatch(/R\$\s*\d/);
	});

	it('avoids uncertain phrasing, em dashes and meta jargon in visible copy', () => {
		const body = readFileSync(contentPath('resorts'), 'utf8');
		const visible = body.replace(/^---[\s\S]*?---\n/, '');

		expect(visible).not.toContain('—');
		expect(visible).not.toMatch(/\bsilo\b/i);
		expect(visible).not.toMatch(/\bcluster\b/i);
		expect(visible).not.toMatch(/também escrito\s+Lacqua/i);
		expect(visible).not.toMatch(/costumam|costuma|provavelmente|pode ser|em geral|tipicamente/i);
		expect(visible).not.toMatch(/não assuma|não trate como|não assumir/i);
	});
});

describe('/caldas-novas/hoteis/ SEO listing page', () => {
	it('lists Lacqua diRoma III and links the destination without currency values', () => {
		const body = readFileSync(contentPath('hoteis'), 'utf8');
		expect(body).toMatch(/L'?acqua diRoma III/i);
		expect(body).toContain('/caldas-novas/lacqua-diroma-iii/');
		expect(body).toContain('/caldas-novas/');
		expect(body).toContain('/rio-quente/');
		expect(body).toMatch(/## Como cotar/);
		expect(body).not.toMatch(/R\$\s*\d/);
	});

	it('avoids uncertain phrasing, em dashes and meta jargon in visible copy', () => {
		const body = readFileSync(contentPath('hoteis'), 'utf8');
		const visible = body.replace(/^---[\s\S]*?---\n/, '');

		expect(visible).not.toContain('—');
		expect(visible).not.toMatch(/\bsilo\b/i);
		expect(visible).not.toMatch(/\bcluster\b/i);
		expect(visible).not.toMatch(/também escrito\s+Lacqua/i);
		expect(visible).not.toMatch(/costumam|costuma|provavelmente|pode ser|em geral|tipicamente/i);
		expect(visible).not.toMatch(/não assuma|não trate como|não assumir/i);
	});
});

describe('/caldas-novas/lacqua-diroma-iii/ hotel SEO page', () => {
	it('covers structure, park access and internal links without currency values', () => {
		const body = readFileSync(contentPath('lacqua-diroma-iii'), 'utf8');
		expect(body).toMatch(/L'?acqua diRoma III/i);
		expect(body).toMatch(/Jardins Acqua Park/i);
		expect(body).toMatch(/diRoma Acqua Park/i);
		expect(body).toContain('/caldas-novas/');
		expect(body).toContain('/caldas-novas/hoteis/');
		expect(body).toMatch(/## Localização/);
		expect(body).toMatch(/## Como cotar/);
		expect(body).not.toMatch(/R\$\s*\d/);
	});

	it('avoids uncertain phrasing, em dashes and meta jargon in visible copy', () => {
		const body = readFileSync(contentPath('lacqua-diroma-iii'), 'utf8');
		const visible = body.replace(/^---[\s\S]*?---\n/, '');

		expect(visible).not.toContain('—');
		expect(visible).not.toMatch(/\bsilo\b/i);
		expect(visible).not.toMatch(/\bcluster\b/i);
		expect(visible).not.toMatch(/também escrito\s+Lacqua/i);
		expect(visible).not.toMatch(/costumam|costuma|provavelmente|pode ser|em geral|tipicamente/i);
		expect(visible).not.toMatch(/não assuma|não trate como|não assumir/i);
	});
});
