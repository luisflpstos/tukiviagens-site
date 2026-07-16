import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { IMAGE_PATHS } from './image-paths';
import { SITE_ROUTES } from './site-routes';

const RIO_QUENTE_HOTELS = [
	'prime-hotel-aguas-da-serra',
	'serra-madre-hotel',
	'thermas-paradise',
	'aguas-da-serra-rio-quente',
	'hotel-giardino-rio-quente',
	'img-hotel-rio-quente',
	'park-veredas-resort',
	'hotel-luupi-rio-quente',
	'refugio-grand-premium',
] as const;

const REMOVED_RIO_QUENTE_SLUG = 'apartamentos-em-rio-quente';

const RIO_QUENTE_RESORTS = [
	'hotel-cristal-rio-quente',
	'refugio-grand-premium',
	'hotel-pousada-rio-quente',
	'hotel-giardino-rio-quente',
	'hotel-luupi-rio-quente',
	'eco-chales-rio-quente',
	'park-veredas-resort',
	'img-hotel-rio-quente',
	'prime-hotel-aguas-da-serra',
	'thermas-paradise-residence',
] as const;

const RIO_QUENTE_PROPERTIES = [...new Set([...RIO_QUENTE_HOTELS, ...RIO_QUENTE_RESORTS])] as const;

function routePath(slug: string): string {
	return `/rio-quente/${slug}/`;
}

function contentPath(slug: string): string {
	return join(process.cwd(), 'src/content/paginas/rio-quente', `${slug}.md`);
}

function imageFolderPath(slug: string): string {
	return join(process.cwd(), 'public/images/hoteis', slug);
}

describe('Rio Quente content coverage', () => {
	it('registers all hotel and resort property routes', () => {
		const paths = new Set(SITE_ROUTES.map((route) => route.path));

		for (const slug of RIO_QUENTE_PROPERTIES) {
			expect(paths.has(routePath(slug)), `missing route ${routePath(slug)}`).toBe(true);
		}
	});

	it('has markdown content for every Rio Quente property', () => {
		for (const slug of RIO_QUENTE_PROPERTIES) {
			expect(existsSync(contentPath(slug)), `missing content ${slug}.md`).toBe(true);
		}
	});

	it('maps every Rio Quente property slug to an image folder', () => {
		for (const slug of RIO_QUENTE_PROPERTIES) {
			expect(slug in IMAGE_PATHS.hoteis, `missing image path for ${slug}`).toBe(true);
			expect(existsSync(imageFolderPath(slug)), `missing image folder ${slug}`).toBe(true);
		}
	});

	it('fully removes apartamentos-em-rio-quente from routes, content and citations', () => {
		const removedPath = routePath(REMOVED_RIO_QUENTE_SLUG);
		const paths = new Set(SITE_ROUTES.map((route) => route.path));
		const citationPages = [
			'hoteis',
			'hoteis-perto-hot-park',
			'prime-hotel-aguas-da-serra',
			'thermas-paradise',
			'../rio-quente',
		] as const;

		expect(paths.has(removedPath)).toBe(false);
		expect(existsSync(contentPath(REMOVED_RIO_QUENTE_SLUG))).toBe(false);
		expect(REMOVED_RIO_QUENTE_SLUG in IMAGE_PATHS.hoteis).toBe(false);

		for (const page of citationPages) {
			const file =
				page === '../rio-quente'
					? join(process.cwd(), 'src/content/paginas/rio-quente.md')
					: contentPath(page);
			const body = readFileSync(file, 'utf8');
			expect(body).not.toContain(removedPath);
			expect(body).not.toMatch(/Apartamentos em Rio Quente/i);
		}
	});
});

describe('/rio-quente/hoteis/ SEO listing page', () => {
	const hoteisPage = readFileSync(contentPath('hoteis'), 'utf8');

	it('does not expose diária ref. or currency values', () => {
		expect(hoteisPage).not.toMatch(/Diária ref\.?/i);
		expect(hoteisPage).not.toMatch(/R\$\s*\d/);
		expect(hoteisPage).not.toMatch(/desde R\$/i);
		expect(hoteisPage).not.toMatch(/Quanto custa a diária/i);
	});

	it('answers the main intent early and keeps extractable comparison structure', () => {
		expect(hoteisPage).toMatch(/## Qual hotel escolher em Rio Quente\?/i);
		expect(hoteisPage).toMatch(/## Comparativo dos \d+ hotéis/i);
		expect(hoteisPage).toMatch(/Hot Park/i);
		expect(hoteisPage).toMatch(/\|\s*Hotel\s*\|\s*Nota\s*\|/i);
		expect(hoteisPage).not.toMatch(/\|\s*Diária/i);
	});

	it('connects the Rio Quente hotel cluster with internal links', () => {
		expect(hoteisPage).toContain('/rio-quente/');
		expect(hoteisPage).toContain('/rio-quente/resorts/');
		expect(hoteisPage).toContain('/rio-quente/hoteis-perto-hot-park/');
		for (const slug of RIO_QUENTE_HOTELS) {
			expect(hoteisPage).toContain(routePath(slug));
		}
	});

	it('covers conversational FAQs without price answers', () => {
		expect(hoteisPage).toMatch(/melhor hotel.*família/i);
		expect(hoteisPage).toMatch(/Hot Park.*inclus/i);
		expect(hoteisPage).toMatch(/oficial|Rio Quente Resorts/i);
		expect(hoteisPage).not.toMatch(/R\$\s*\d/);
	});
});

describe('/rio-quente/prime-hotel-aguas-da-serra/ SEO hotel page', () => {
	const primePage = readFileSync(contentPath('prime-hotel-aguas-da-serra'), 'utf8');

	it('does not expose currency values or daily-rate pricing', () => {
		expect(primePage).not.toMatch(/R\$\s*\d/);
		expect(primePage).not.toMatch(/desde R\$/i);
		expect(primePage).not.toMatch(/Diária/i);
		expect(primePage).not.toMatch(/Quanto custa/i);
	});

	it('answers the main intent early with extractable structure', () => {
		expect(primePage).toMatch(/## O que é o Prime Hotel Águas da Serra/i);
		expect(primePage).toMatch(/Hot Park/i);
		expect(primePage).toMatch(/apart-hotel|apartamento/i);
		expect(primePage).toMatch(/## Comparativo/i);
		expect(primePage).toMatch(/\|\s*Hospedagem\s*\|/i);
	});

	it('connects the Rio Quente hotel cluster with internal links', () => {
		expect(primePage).toContain('/rio-quente/');
		expect(primePage).toContain('/rio-quente/hoteis/');
		expect(primePage).toContain('/rio-quente/hoteis-perto-hot-park/');
		expect(primePage).toContain('/rio-quente/hotel-giardino-rio-quente/');
	});

	it('covers conversational FAQs without price answers', () => {
		expect(primePage).toMatch(/Hot Park/i);
		expect(primePage).toMatch(/rio|águas quentes|termal/i);
		expect(primePage).toMatch(/família|grupo/i);
		expect(primePage).not.toMatch(/R\$\s*\d/);
	});
});

describe('/rio-quente/serra-madre-hotel/ SEO hotel page', () => {
	const serraMadrePage = readFileSync(contentPath('serra-madre-hotel'), 'utf8');

	it('does not expose currency values or daily-rate pricing', () => {
		expect(serraMadrePage).not.toMatch(/R\$\s*\d/);
		expect(serraMadrePage).not.toMatch(/desde R\$/i);
		expect(serraMadrePage).not.toMatch(/Diária/i);
		expect(serraMadrePage).not.toMatch(/Quanto custa/i);
	});

	it('answers the main intent early with extractable structure', () => {
		expect(serraMadrePage).toMatch(/## O que é o Serra Madre Hotel/i);
		expect(serraMadrePage).toMatch(/Hot Park/i);
		expect(serraMadrePage).toMatch(/cozinha|apartamento|hidromassagem/i);
		expect(serraMadrePage).toMatch(/## Comparativo/i);
		expect(serraMadrePage).toMatch(/\|\s*Hospedagem\s*\|/i);
	});

	it('connects the Rio Quente hotel cluster with internal links', () => {
		expect(serraMadrePage).toContain('/rio-quente/');
		expect(serraMadrePage).toContain('/rio-quente/hoteis/');
		expect(serraMadrePage).toContain('/rio-quente/hoteis-perto-hot-park/');
		expect(serraMadrePage).toContain('/rio-quente/prime-hotel-aguas-da-serra/');
	});

	it('covers conversational FAQs without price answers', () => {
		expect(serraMadrePage).toMatch(/Hot Park/i);
		expect(serraMadrePage).toMatch(/perto|próximo|650 m|menos de 1 km/i);
		expect(serraMadrePage).toMatch(/família|casal/i);
		expect(serraMadrePage).not.toMatch(/R\$\s*\d/);
	});
});

describe('/rio-quente/img-hotel-rio-quente/ SEO hotel page', () => {
	const imgPage = readFileSync(contentPath('img-hotel-rio-quente'), 'utf8');

	it('does not expose currency values or daily-rate pricing', () => {
		expect(imgPage).not.toMatch(/R\$\s*\d/);
		expect(imgPage).not.toMatch(/desde R\$/i);
		expect(imgPage).not.toMatch(/Diária/i);
		expect(imgPage).not.toMatch(/Quanto custa/i);
	});

	it('answers the main intent early with extractable structure', () => {
		expect(imgPage).toMatch(/## O que é o IMG Hotel Rio Quente/i);
		expect(imgPage).toMatch(/Hot Park/i);
		expect(imgPage).toMatch(/rio|águas quentes|termal/i);
		expect(imgPage).toMatch(/piscina/i);
		expect(imgPage).toMatch(/## Comparativo/i);
		expect(imgPage).toMatch(/\|\s*Hospedagem\s*\|/i);
	});

	it('connects the Rio Quente hotel cluster with internal links', () => {
		expect(imgPage).toContain('/rio-quente/');
		expect(imgPage).toContain('/rio-quente/hoteis/');
		expect(imgPage).toContain('/rio-quente/hoteis-perto-hot-park/');
		expect(imgPage).toContain('/rio-quente/prime-hotel-aguas-da-serra/');
	});

	it('covers conversational FAQs without price answers', () => {
		expect(imgPage).toMatch(/Hot Park/i);
		expect(imgPage).toMatch(/rio|águas quentes|parque aquático/i);
		expect(imgPage).toMatch(/família|grupo/i);
		expect(imgPage).not.toMatch(/R\$\s*\d/);
	});
});

describe('/rio-quente/aguas-da-serra-rio-quente/ SEO hotel page', () => {
	const aguasDaSerraPage = readFileSync(contentPath('aguas-da-serra-rio-quente'), 'utf8');

	it('does not expose currency values or daily-rate pricing', () => {
		expect(aguasDaSerraPage).not.toMatch(/R\$\s*\d/);
		expect(aguasDaSerraPage).not.toMatch(/desde R\$/i);
		expect(aguasDaSerraPage).not.toMatch(/Diária/i);
		expect(aguasDaSerraPage).not.toMatch(/Quanto custa/i);
		expect(aguasDaSerraPage).not.toMatch(/a partir de R\$/i);
		expect(aguasDaSerraPage).not.toMatch(/preço|tarifas?/i);
	});

	it('answers the main intent early with extractable structure', () => {
		expect(aguasDaSerraPage).toMatch(/## O que é o Águas da Serra/i);
		expect(aguasDaSerraPage).toMatch(/## Vale a pena/i);
		expect(aguasDaSerraPage).toMatch(/## Estrutura/i);
		expect(aguasDaSerraPage).toMatch(/## Localização/i);
		expect(aguasDaSerraPage).toMatch(/## O que está incluso/i);
		expect(aguasDaSerraPage).toMatch(/## Erros comuns/i);
		expect(aguasDaSerraPage).toMatch(/Hot Park/i);
		expect(aguasDaSerraPage).toMatch(/Esplanada/i);
		expect(aguasDaSerraPage).toMatch(/Ribeirão Água Quente/i);
		expect(aguasDaSerraPage).toMatch(/apart-hotel|apartamento|condomínio/i);
		expect(aguasDaSerraPage).toMatch(/## Comparativo/i);
		expect(aguasDaSerraPage).toMatch(/\|\s*Hospedagem\s*\|/i);
		expect(aguasDaSerraPage).toMatch(/\|\s*Perfil\s*\|/i);
	});

	it('connects the Rio Quente hotel cluster with internal links', () => {
		expect(aguasDaSerraPage).toContain('/rio-quente/');
		expect(aguasDaSerraPage).toContain('/rio-quente/hoteis/');
		expect(aguasDaSerraPage).toContain('/rio-quente/hoteis-perto-hot-park/');
		expect(aguasDaSerraPage).toContain('/rio-quente/prime-hotel-aguas-da-serra/');
		expect(aguasDaSerraPage).toContain('/rio-quente/thermas-paradise/');
		expect(aguasDaSerraPage).toContain('/rio-quente/img-hotel-rio-quente/');
		expect(aguasDaSerraPage).toContain('/rio-quente/hotel-giardino-rio-quente/');
		expect(aguasDaSerraPage).not.toContain('/rio-quente/apartamentos-em-rio-quente/');
	});

	it('covers conversational FAQs without price answers', () => {
		expect(aguasDaSerraPage).toMatch(/Hot Park/i);
		expect(aguasDaSerraPage).toMatch(/perto|próximo|300|650 m|a pé/i);
		expect(aguasDaSerraPage).toMatch(/família|grupo/i);
		expect(aguasDaSerraPage).toMatch(/rio|águas quentes|termal|Ribeirão/i);
		expect(aguasDaSerraPage).toMatch(/Prime Hotel Águas da Serra/i);
		expect(aguasDaSerraPage).toMatch(/não.*incluso|à parte|adquiridos? à parte/i);
		expect(aguasDaSerraPage).not.toMatch(/R\$\s*\d/);
	});

	it('documents typologies, leisure and independence from Rio Quente Resorts', () => {
		expect(aguasDaSerraPage).toMatch(/Apart Service|condomínio de flats|apart-hotel/i);
		expect(aguasDaSerraPage).toMatch(/fora do complexo|independente/i);
		expect(aguasDaSerraPage).toMatch(/1 quarto|um quarto/i);
		expect(aguasDaSerraPage).toMatch(/2 quartos|dois quartos/i);
		expect(aguasDaSerraPage).toMatch(/mini-copa|cozinha compacta|copa/i);
		expect(aguasDaSerraPage).toMatch(/piscina/i);
		expect(aguasDaSerraPage).toMatch(/sauna/i);
		expect(aguasDaSerraPage).toMatch(/playground|academia/i);
		expect(aguasDaSerraPage).toMatch(/Av\. Brasil|Avenida Brasil/i);
		expect(aguasDaSerraPage).toMatch(/Qual a diferença entre Águas da Serra e Prime/i);
		expect(aguasDaSerraPage).toMatch(/\|\s*Tipo\s*\|\s*Capacidade/i);
		expect(aguasDaSerraPage).toMatch(/## Como funciona a estadia/i);
	});
});

describe('/rio-quente/thermas-paradise/ SEO hotel page', () => {
	const thermasParadisePage = readFileSync(contentPath('thermas-paradise'), 'utf8');

	it('does not expose currency values or daily-rate pricing', () => {
		expect(thermasParadisePage).not.toMatch(/R\$\s*\d/);
		expect(thermasParadisePage).not.toMatch(/desde R\$/i);
		expect(thermasParadisePage).not.toMatch(/Diária/i);
		expect(thermasParadisePage).not.toMatch(/Quanto custa/i);
	});

	it('answers the main intent early with extractable structure', () => {
		expect(thermasParadisePage).toMatch(/## O que é o Thermas Paradise/i);
		expect(thermasParadisePage).toMatch(/Hot Park/i);
		expect(thermasParadisePage).toMatch(/rio|termal|piscinas/i);
		expect(thermasParadisePage).toMatch(/apartamento|condomínio|cozinha/i);
		expect(thermasParadisePage).toMatch(/## Comparativo/i);
		expect(thermasParadisePage).toMatch(/\|\s*Hospedagem\s*\|/i);
	});

	it('connects the Rio Quente hotel cluster with internal links', () => {
		expect(thermasParadisePage).toContain('/rio-quente/');
		expect(thermasParadisePage).toContain('/rio-quente/hoteis/');
		expect(thermasParadisePage).toContain('/rio-quente/hoteis-perto-hot-park/');
		expect(thermasParadisePage).toContain('/rio-quente/serra-madre-hotel/');
		expect(thermasParadisePage).toContain('/rio-quente/thermas-paradise-residence/');
	});

	it('covers conversational FAQs without price answers', () => {
		expect(thermasParadisePage).toMatch(/Hot Park/i);
		expect(thermasParadisePage).toMatch(/perto|próximo|700 m|500|menos de 1 km/i);
		expect(thermasParadisePage).toMatch(/família|grupo|casal/i);
		expect(thermasParadisePage).toMatch(/rio|termal|piscinas/i);
		expect(thermasParadisePage).not.toMatch(/R\$\s*\d/);
	});
});
