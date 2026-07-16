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

describe('/rio-quente/hotel-giardino-rio-quente/ SEO hotel page', () => {
	const giardinoPage = readFileSync(contentPath('hotel-giardino-rio-quente'), 'utf8');

	it('does not expose currency values or daily-rate pricing', () => {
		expect(giardinoPage).not.toMatch(/R\$\s*\d/);
		expect(giardinoPage).not.toMatch(/desde R\$/i);
		expect(giardinoPage).not.toMatch(/Diária/i);
		expect(giardinoPage).not.toMatch(/Quanto custa/i);
		expect(giardinoPage).not.toMatch(/a partir de R\$/i);
		expect(giardinoPage).not.toMatch(/preço|tarifas?/i);
	});

	it('answers the main intent early with extractable structure', () => {
		expect(giardinoPage).toMatch(/## O que é o Hotel Giardino/i);
		expect(giardinoPage).toMatch(/## Vale a pena/i);
		expect(giardinoPage).toMatch(/## Estrutura/i);
		expect(giardinoPage).toMatch(/## Localização/i);
		expect(giardinoPage).toMatch(/## O que está incluso/i);
		expect(giardinoPage).toMatch(/## Erros comuns/i);
		expect(giardinoPage).toMatch(/Hot Park/i);
		expect(giardinoPage).toMatch(/Parque das Fontes/i);
		expect(giardinoPage).toMatch(/transfer|traslado/i);
		expect(giardinoPage).toMatch(/italiana|Itália/i);
		expect(giardinoPage).toMatch(/Rio Quente Resorts|oficial/i);
		expect(giardinoPage).toMatch(/## Comparativo/i);
		expect(giardinoPage).toMatch(/\|\s*Hospedagem\s*\|/i);
		expect(giardinoPage).toMatch(/\|\s*Perfil\s*\|/i);
	});

	it('connects the Rio Quente hotel cluster with internal links', () => {
		expect(giardinoPage).toContain('/rio-quente/');
		expect(giardinoPage).toContain('/rio-quente/hoteis/');
		expect(giardinoPage).toContain('/rio-quente/hoteis-perto-hot-park/');
		expect(giardinoPage).toContain('/rio-quente/resorts/');
		expect(giardinoPage).toContain('/rio-quente/hotel-luupi-rio-quente/');
		expect(giardinoPage).toContain('/rio-quente/refugio-grand-premium/');
		expect(giardinoPage).toContain('/rio-quente/prime-hotel-aguas-da-serra/');
	});

	it('covers conversational FAQs without price answers', () => {
		expect(giardinoPage).toMatch(/Hot Park/i);
		expect(giardinoPage).toMatch(/transfer|traslado/i);
		expect(giardinoPage).toMatch(/família|grupo/i);
		expect(giardinoPage).toMatch(/dentro do complexo|fora do complexo/i);
		expect(giardinoPage).toMatch(/incluso|incluíd/i);
		expect(giardinoPage).not.toMatch(/R\$\s*\d/);
	});

	it('documents official RQR profile, suites and meal plan', () => {
		expect(giardinoPage).toMatch(/fora do complexo|fora do complexo principal/i);
		expect(giardinoPage).toMatch(/Suíte Júnior|Suíte Master|apartamento/i);
		expect(giardinoPage).toMatch(/café da manhã|jantar|La Távola/i);
		expect(giardinoPage).toMatch(/piscina/i);
		expect(giardinoPage).toMatch(/Mato Grosso|Esplanada/i);
		expect(giardinoPage).toMatch(/700|800 m|600/i);
		expect(giardinoPage).toMatch(/\|\s*Tipo\s*\|\s*Capacidade/i);
		expect(giardinoPage).toMatch(/## Como cotar/i);
	});
});

describe('/rio-quente/hotel-cristal-rio-quente/ SEO hotel page', () => {
	const cristalPage = readFileSync(contentPath('hotel-cristal-rio-quente'), 'utf8');

	it('does not expose currency values or daily-rate pricing', () => {
		expect(cristalPage).not.toMatch(/R\$\s*\d/);
		expect(cristalPage).not.toMatch(/desde R\$/i);
		expect(cristalPage).not.toMatch(/Diária/i);
		expect(cristalPage).not.toMatch(/Quanto custa/i);
		expect(cristalPage).not.toMatch(/a partir de R\$/i);
		expect(cristalPage).not.toMatch(/preço|tarifas?/i);
	});

	it('answers the main intent early with extractable structure', () => {
		expect(cristalPage).toMatch(/## O que é o Hotel Cristal/i);
		expect(cristalPage).toMatch(/## Vale a pena/i);
		expect(cristalPage).toMatch(/## Estrutura/i);
		expect(cristalPage).toMatch(/## Localização/i);
		expect(cristalPage).toMatch(/## O que está incluso/i);
		expect(cristalPage).toMatch(/## Erros comuns/i);
		expect(cristalPage).toMatch(/Hot Park/i);
		expect(cristalPage).toMatch(/Parque das Fontes/i);
		expect(cristalPage).toMatch(/borda infinita|Infinitus/i);
		expect(cristalPage).toMatch(/Benedito Abbud/i);
		expect(cristalPage).toMatch(/Rio Quente Resorts|oficial/i);
		expect(cristalPage).toMatch(/## Comparativo/i);
		expect(cristalPage).toMatch(/\|\s*Hospedagem\s*\|/i);
		expect(cristalPage).toMatch(/\|\s*Perfil\s*\|/i);
	});

	it('connects the Rio Quente hotel cluster with internal links', () => {
		expect(cristalPage).toContain('/rio-quente/');
		expect(cristalPage).toContain('/rio-quente/hoteis/');
		expect(cristalPage).toContain('/rio-quente/hoteis-perto-hot-park/');
		expect(cristalPage).toContain('/rio-quente/resorts/');
		expect(cristalPage).toContain('/rio-quente/refugio-grand-premium/');
		expect(cristalPage).toContain('/rio-quente/hotel-pousada-rio-quente/');
		expect(cristalPage).toContain('/rio-quente/hotel-giardino-rio-quente/');
	});

	it('covers conversational FAQs without price answers', () => {
		expect(cristalPage).toMatch(/Hot Park/i);
		expect(cristalPage).toMatch(/dentro do complexo/i);
		expect(cristalPage).toMatch(/família|casal|grupo/i);
		expect(cristalPage).toMatch(/incluso|incluíd/i);
		expect(cristalPage).toMatch(/Vista Grand Premium|reforma|2028/i);
		expect(cristalPage).not.toMatch(/R\$\s*\d/);
	});

	it('documents official RQR profile, suites and meal plan', () => {
		expect(cristalPage).toMatch(/dentro do complexo/i);
		expect(cristalPage).toMatch(/Suíte Cristal|Suíte Master|Suíte Premium/i);
		expect(cristalPage).toMatch(/café da manhã|almoço|meia pensão/i);
		expect(cristalPage).toMatch(/piscina/i);
		expect(cristalPage).toMatch(/284|22\.?750/i);
		expect(cristalPage).toMatch(/até 10|10 pessoas/i);
		expect(cristalPage).toMatch(/\|\s*Tipo\s*\|\s*Capacidade/i);
		expect(cristalPage).toMatch(/## Como cotar/i);
	});
});

describe('/rio-quente/hotel-pousada-rio-quente/ SEO hotel page', () => {
	const pousadaPage = readFileSync(contentPath('hotel-pousada-rio-quente'), 'utf8');

	it('does not expose currency values or daily-rate pricing', () => {
		expect(pousadaPage).not.toMatch(/R\$\s*\d/);
		expect(pousadaPage).not.toMatch(/desde R\$/i);
		expect(pousadaPage).not.toMatch(/Diária/i);
		expect(pousadaPage).not.toMatch(/Quanto custa/i);
		expect(pousadaPage).not.toMatch(/a partir de R\$/i);
		expect(pousadaPage).not.toMatch(/preço|tarifas?/i);
	});

	it('answers the main intent early with extractable structure', () => {
		expect(pousadaPage).toMatch(/## O que é o Hotel Pousada/i);
		expect(pousadaPage).toMatch(/## Vale a pena/i);
		expect(pousadaPage).toMatch(/## Estrutura/i);
		expect(pousadaPage).toMatch(/## Localização/i);
		expect(pousadaPage).toMatch(/## O que está incluso/i);
		expect(pousadaPage).toMatch(/## Erros comuns/i);
		expect(pousadaPage).toMatch(/Hot Park/i);
		expect(pousadaPage).toMatch(/Parque das Fontes/i);
		expect(pousadaPage).toMatch(/50 m|50m/i);
		expect(pousadaPage).toMatch(/1966|primeiro|tradição|histórico/i);
		expect(pousadaPage).toMatch(/Rio Quente Resorts|oficial/i);
		expect(pousadaPage).toMatch(/## Comparativo/i);
		expect(pousadaPage).toMatch(/\|\s*Hospedagem\s*\|/i);
		expect(pousadaPage).toMatch(/\|\s*Perfil\s*\|/i);
	});

	it('connects the Rio Quente hotel cluster with internal links', () => {
		expect(pousadaPage).toContain('/rio-quente/');
		expect(pousadaPage).toContain('/rio-quente/hoteis/');
		expect(pousadaPage).toContain('/rio-quente/hoteis-perto-hot-park/');
		expect(pousadaPage).toContain('/rio-quente/resorts/');
		expect(pousadaPage).toContain('/rio-quente/refugio-grand-premium/');
		expect(pousadaPage).toContain('/rio-quente/hotel-cristal-rio-quente/');
		expect(pousadaPage).toContain('/rio-quente/hotel-giardino-rio-quente/');
	});

	it('covers conversational FAQs without price answers', () => {
		expect(pousadaPage).toMatch(/Hot Park/i);
		expect(pousadaPage).toMatch(/Parque das Fontes/i);
		expect(pousadaPage).toMatch(/família|grupo|casal/i);
		expect(pousadaPage).toMatch(/dentro do complexo/i);
		expect(pousadaPage).toMatch(/incluso|incluíd/i);
		expect(pousadaPage).toMatch(/café da manhã|almoço|jantar/i);
		expect(pousadaPage).not.toMatch(/R\$\s*\d/);
	});

	it('documents official RQR profile, meal plan, family amenities and retrofit', () => {
		expect(pousadaPage).toMatch(/dentro do complexo/i);
		expect(pousadaPage).toMatch(/Casa de Cora/i);
		expect(pousadaPage).toMatch(/café da manhã|almoço/i);
		expect(pousadaPage).toMatch(/Suíte Master|Apartamento Superior|apartamento/i);
		expect(pousadaPage).toMatch(/Toca da Zooeira|brinquedoteca|espaço kids|Copa do Bebê/i);
		expect(pousadaPage).toMatch(/retrofit|reforma|moderniza/i);
		expect(pousadaPage).toMatch(/\|\s*Tipo\s*\|\s*Capacidade/i);
		expect(pousadaPage).toMatch(/## Como cotar/i);
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

describe('/rio-quente/thermas-paradise-residence/ SEO resort page', () => {
	const residencePage = readFileSync(contentPath('thermas-paradise-residence'), 'utf8');

	it('does not expose currency values or daily-rate pricing', () => {
		expect(residencePage).not.toMatch(/R\$\s*\d/);
		expect(residencePage).not.toMatch(/desde R\$/i);
		expect(residencePage).not.toMatch(/Diária/i);
		expect(residencePage).not.toMatch(/Quanto custa/i);
		expect(residencePage).not.toMatch(/a partir de R\$/i);
		expect(residencePage).not.toMatch(/preço|tarifas?/i);
	});

	it('answers the main intent early with extractable structure', () => {
		expect(residencePage).toMatch(/## O que é o Thermas Paradise Residence/i);
		expect(residencePage).toMatch(/## Para quem vale a pena|## Vale a pena/i);
		expect(residencePage).toMatch(/## Estrutura/i);
		expect(residencePage).toMatch(/## Localização/i);
		expect(residencePage).toMatch(/## O que está incluso/i);
		expect(residencePage).toMatch(/## Erros comuns/i);
		expect(residencePage).toMatch(/Hot Park/i);
		expect(residencePage).toMatch(/rio|termal|piscinas/i);
		expect(residencePage).toMatch(/apartamento|condomínio|cozinha/i);
		expect(residencePage).toMatch(/Esplanada/i);
		expect(residencePage).toMatch(/## Comparativo/i);
		expect(residencePage).toMatch(/\|\s*Hospedagem\s*\|/i);
		expect(residencePage).toMatch(/\|\s*Perfil\s*\|/i);
	});

	it('connects the Rio Quente hotel cluster with internal links', () => {
		expect(residencePage).toContain('/rio-quente/');
		expect(residencePage).toContain('/rio-quente/hoteis/');
		expect(residencePage).toContain('/rio-quente/hoteis-perto-hot-park/');
		expect(residencePage).toContain('/rio-quente/resorts/');
		expect(residencePage).toContain('/rio-quente/thermas-paradise/');
		expect(residencePage).toContain('/rio-quente/park-veredas-resort/');
		expect(residencePage).toContain('/rio-quente/aguas-da-serra-rio-quente/');
	});

	it('covers conversational FAQs without price answers', () => {
		expect(residencePage).toMatch(/Thermas Paradise Residence é o mesmo|são a mesma/i);
		expect(residencePage).toMatch(/Hot Park/i);
		expect(residencePage).toMatch(/perto|próximo|700 m|500|menos de 1 km|1 km/i);
		expect(residencePage).toMatch(/família|grupo|casal/i);
		expect(residencePage).toMatch(/rio|termal|piscinas|cozinha/i);
		expect(residencePage).toMatch(/incluso|incluíd|à parte/i);
		expect(residencePage).not.toMatch(/R\$\s*\d/);
	});

	it('documents residence profile, tipologias and condominium leisure', () => {
		expect(residencePage).toMatch(/1 quarto|2 quartos/i);
		expect(residencePage).toMatch(/cinco piscinas|5 piscinas/i);
		expect(residencePage).toMatch(/Ribeirão Água Quente|rio de águas termais|rio termal/i);
		expect(residencePage).toMatch(/independente|não.*oficial|fora do complexo/i);
		expect(residencePage).toMatch(/## Peça sua cotação|## Cotação|## Como cotar/i);
	});
});

describe('/rio-quente/hotel-luupi-rio-quente/ SEO hotel page', () => {
	const luupiPage = readFileSync(contentPath('hotel-luupi-rio-quente'), 'utf8');

	it('does not expose currency values or daily-rate pricing', () => {
		expect(luupiPage).not.toMatch(/R\$\s*\d/);
		expect(luupiPage).not.toMatch(/desde R\$/i);
		expect(luupiPage).not.toMatch(/Diária/i);
		expect(luupiPage).not.toMatch(/Quanto custa/i);
		expect(luupiPage).not.toMatch(/a partir de R\$/i);
		expect(luupiPage).not.toMatch(/preço|tarifas?/i);
	});

	it('answers the main intent early with extractable structure', () => {
		expect(luupiPage).toMatch(/## O que é o Hotel Luupi/i);
		expect(luupiPage).toMatch(/## Vale a pena/i);
		expect(luupiPage).toMatch(/## Estrutura/i);
		expect(luupiPage).toMatch(/## Localização/i);
		expect(luupiPage).toMatch(/## O que está incluso/i);
		expect(luupiPage).toMatch(/## Erros comuns/i);
		expect(luupiPage).toMatch(/Hot Park/i);
		expect(luupiPage).toMatch(/Parque das Fontes/i);
		expect(luupiPage).toMatch(/meia pensão|Casa de Cora/i);
		expect(luupiPage).toMatch(/transfer/i);
		expect(luupiPage).toMatch(/duplex|dois andares|dois ambientes/i);
		expect(luupiPage).toMatch(/## Comparativo/i);
		expect(luupiPage).toMatch(/\|\s*Hospedagem\s*\|/i);
		expect(luupiPage).toMatch(/\|\s*Perfil\s*\|/i);
	});

	it('connects the Rio Quente hotel cluster with internal links', () => {
		expect(luupiPage).toContain('/rio-quente/');
		expect(luupiPage).toContain('/rio-quente/hoteis/');
		expect(luupiPage).toContain('/rio-quente/hoteis-perto-hot-park/');
		expect(luupiPage).toContain('/rio-quente/resorts/');
		expect(luupiPage).toContain('/rio-quente/hotel-giardino-rio-quente/');
		expect(luupiPage).toContain('/rio-quente/refugio-grand-premium/');
		expect(luupiPage).toContain('/rio-quente/hotel-cristal-rio-quente/');
	});

	it('covers conversational FAQs without price answers', () => {
		expect(luupiPage).toMatch(/Hot Park/i);
		expect(luupiPage).toMatch(/meia pensão|jantar|Casa de Cora/i);
		expect(luupiPage).toMatch(/família|grupo/i);
		expect(luupiPage).toMatch(/transfer/i);
		expect(luupiPage).toMatch(/até 7|7 pessoas/i);
		expect(luupiPage).not.toMatch(/R\$\s*\d/);
	});

	it('documents official resort inclusions, typologies and half-board', () => {
		expect(luupiPage).toMatch(/Rio Quente Resorts|oficial/i);
		expect(luupiPage).toMatch(/fora do complexo/i);
		expect(luupiPage).toMatch(/Suíte Família|Suíte Júnior|Suíte Junior|Suíte Master/i);
		expect(luupiPage).toMatch(/49 m|37 m/i);
		expect(luupiPage).toMatch(/piscina/i);
		expect(luupiPage).toMatch(/Esplanada|Rua São Paulo/i);
		expect(luupiPage).toMatch(/## Como funciona a estadia/i);
		expect(luupiPage).toMatch(/\|\s*Tipo\s*\|\s*Capacidade/i);
	});
});

describe('/rio-quente/refugio-grand-premium/ SEO hotel page', () => {
	const refugioPage = readFileSync(contentPath('refugio-grand-premium'), 'utf8');

	it('does not expose currency values or daily-rate pricing', () => {
		expect(refugioPage).not.toMatch(/R\$\s*\d/);
		expect(refugioPage).not.toMatch(/desde R\$/i);
		expect(refugioPage).not.toMatch(/Diária/i);
		expect(refugioPage).not.toMatch(/Quanto custa/i);
		expect(refugioPage).not.toMatch(/a partir de R\$/i);
		expect(refugioPage).not.toMatch(/preço|tarifas?/i);
	});

	it('answers the main intent early with extractable structure', () => {
		expect(refugioPage).toMatch(/## O que é o Refúgio Grand Premium/i);
		expect(refugioPage).toMatch(/## Vale a pena/i);
		expect(refugioPage).toMatch(/## Estrutura/i);
		expect(refugioPage).toMatch(/## Localização/i);
		expect(refugioPage).toMatch(/## O que está incluso/i);
		expect(refugioPage).toMatch(/## Erros comuns/i);
		expect(refugioPage).toMatch(/Hot Park/i);
		expect(refugioPage).toMatch(/Parque das Fontes/i);
		expect(refugioPage).toMatch(/Hotel Turismo|antigo Hotel Turismo/i);
		expect(refugioPage).toMatch(/dentro do complexo|a pé/i);
		expect(refugioPage).toMatch(/Rio Quente Resorts|oficial|Grand Premium/i);
		expect(refugioPage).toMatch(/## Comparativo/i);
		expect(refugioPage).toMatch(/\|\s*Hospedagem\s*\|/i);
		expect(refugioPage).toMatch(/\|\s*Perfil\s*\|/i);
	});

	it('connects the Rio Quente hotel cluster with internal links', () => {
		expect(refugioPage).toContain('/rio-quente/');
		expect(refugioPage).toContain('/rio-quente/hoteis/');
		expect(refugioPage).toContain('/rio-quente/hoteis-perto-hot-park/');
		expect(refugioPage).toContain('/rio-quente/resorts/');
		expect(refugioPage).toContain('/rio-quente/hotel-giardino-rio-quente/');
		expect(refugioPage).toContain('/rio-quente/hotel-cristal-rio-quente/');
		expect(refugioPage).toContain('/rio-quente/hotel-pousada-rio-quente/');
	});

	it('covers conversational FAQs without price answers', () => {
		expect(refugioPage).toMatch(/Hot Park/i);
		expect(refugioPage).toMatch(/Parque das Fontes/i);
		expect(refugioPage).toMatch(/Hotel Turismo|antigo/i);
		expect(refugioPage).toMatch(/dentro do complexo|a pé/i);
		expect(refugioPage).toMatch(/família|casal/i);
		expect(refugioPage).toMatch(/incluso|incluíd/i);
		expect(refugioPage).not.toMatch(/R\$\s*\d/);
	});

	it('documents premium RQR profile, suites and meal plan', () => {
		expect(refugioPage).toMatch(/dentro do complexo/i);
		expect(refugioPage).toMatch(/Suíte Presidencial|Suíte Master|Apartamento Master/i);
		expect(refugioPage).toMatch(/café da manhã|almoço|Pequi/i);
		expect(refugioPage).toMatch(/piscina/i);
		expect(refugioPage).toMatch(/Bar das Artes/i);
		expect(refugioPage).toMatch(/Burle Marx|Cerrado/i);
		expect(refugioPage).toMatch(/\|\s*Tipo\s*\|\s*Capacidade/i);
		expect(refugioPage).toMatch(/## Como cotar/i);
	});
});

describe('/rio-quente/eco-chales-rio-quente/ SEO hotel page', () => {
	const ecoChalesPage = readFileSync(contentPath('eco-chales-rio-quente'), 'utf8');

	it('does not expose currency values or daily-rate pricing', () => {
		expect(ecoChalesPage).not.toMatch(/R\$\s*\d/);
		expect(ecoChalesPage).not.toMatch(/desde R\$/i);
		expect(ecoChalesPage).not.toMatch(/Diária/i);
		expect(ecoChalesPage).not.toMatch(/Quanto custa/i);
		expect(ecoChalesPage).not.toMatch(/a partir de R\$/i);
		expect(ecoChalesPage).not.toMatch(/preço|tarifas?/i);
		expect(ecoChalesPage).not.toMatch(/mais econômico|menor preço|barato/i);
	});

	it('answers the main intent early with extractable structure', () => {
		expect(ecoChalesPage).toMatch(/## O que é o Eco Chalés/i);
		expect(ecoChalesPage).toMatch(/## Vale a pena/i);
		expect(ecoChalesPage).toMatch(/## Estrutura/i);
		expect(ecoChalesPage).toMatch(/## Localização/i);
		expect(ecoChalesPage).toMatch(/## O que está incluso/i);
		expect(ecoChalesPage).toMatch(/## Erros comuns/i);
		expect(ecoChalesPage).toMatch(/Hot Park/i);
		expect(ecoChalesPage).toMatch(/Parque das Fontes/i);
		expect(ecoChalesPage).toMatch(/não.*transfer|sem transfer|não há transfer/i);
		expect(ecoChalesPage).toMatch(/Cerrado|natureza/i);
		expect(ecoChalesPage).toMatch(/Rio Quente Resorts|oficial/i);
		expect(ecoChalesPage).toMatch(/## Comparativo/i);
		expect(ecoChalesPage).toMatch(/\|\s*Hospedagem\s*\|/i);
		expect(ecoChalesPage).toMatch(/\|\s*Perfil\s*\|/i);
	});

	it('connects the Rio Quente hotel cluster with internal links', () => {
		expect(ecoChalesPage).toContain('/rio-quente/');
		expect(ecoChalesPage).toContain('/rio-quente/hoteis/');
		expect(ecoChalesPage).toContain('/rio-quente/hoteis-perto-hot-park/');
		expect(ecoChalesPage).toContain('/rio-quente/resorts/');
		expect(ecoChalesPage).toContain('/rio-quente/hotel-giardino-rio-quente/');
		expect(ecoChalesPage).toContain('/rio-quente/hotel-pousada-rio-quente/');
		expect(ecoChalesPage).toContain('/rio-quente/hotel-luupi-rio-quente/');
	});

	it('covers conversational FAQs without price answers', () => {
		expect(ecoChalesPage).toMatch(/Hot Park/i);
		expect(ecoChalesPage).toMatch(/transfer|carro próprio/i);
		expect(ecoChalesPage).toMatch(/família|casal/i);
		expect(ecoChalesPage).toMatch(/meia pensão|café da manhã/i);
		expect(ecoChalesPage).toMatch(/incluso|incluíd/i);
		expect(ecoChalesPage).not.toMatch(/R\$\s*\d/);
	});

	it('documents official RQR profile, typology, nature setting and car dependency', () => {
		expect(ecoChalesPage).toMatch(/fora do complexo/i);
		expect(ecoChalesPage).toMatch(/Apartamento Standard|apartamento/i);
		expect(ecoChalesPage).toMatch(/18 m|18m/i);
		expect(ecoChalesPage).toMatch(/até 3|3 pessoas|três pessoas/i);
		expect(ecoChalesPage).toMatch(/café da manhã|Kabana/i);
		expect(ecoChalesPage).toMatch(/piscina|bar molhado/i);
		expect(ecoChalesPage).toMatch(/Gardênias|Mansões do Rio Quente/i);
		expect(ecoChalesPage).toMatch(/4 km/i);
		expect(ecoChalesPage).toMatch(/\|\s*Tipo\s*\|\s*Capacidade/i);
		expect(ecoChalesPage).toMatch(/## Como cotar/i);
	});
});

describe('/rio-quente/park-veredas-resort/ SEO hotel page', () => {
	const parkVeredasPage = readFileSync(contentPath('park-veredas-resort'), 'utf8');

	it('does not expose currency values or daily-rate pricing', () => {
		expect(parkVeredasPage).not.toMatch(/R\$\s*\d/);
		expect(parkVeredasPage).not.toMatch(/desde R\$/i);
		expect(parkVeredasPage).not.toMatch(/Diária/i);
		expect(parkVeredasPage).not.toMatch(/Quanto custa/i);
		expect(parkVeredasPage).not.toMatch(/a partir de R\$/i);
		expect(parkVeredasPage).not.toMatch(/preço|tarifas?/i);
	});

	it('answers the main intent early with extractable structure', () => {
		expect(parkVeredasPage).toMatch(/## O que é o Park Veredas Resort/i);
		expect(parkVeredasPage).toMatch(/## Vale a pena/i);
		expect(parkVeredasPage).toMatch(/## Estrutura/i);
		expect(parkVeredasPage).toMatch(/## Localização/i);
		expect(parkVeredasPage).toMatch(/## O que está incluso/i);
		expect(parkVeredasPage).toMatch(/## Erros comuns/i);
		expect(parkVeredasPage).toMatch(/Hot Park/i);
		expect(parkVeredasPage).toMatch(/Esplanada/i);
		expect(parkVeredasPage).toMatch(/rio|águas quentes|termal/i);
		expect(parkVeredasPage).toMatch(/apart-hotel|apartamento|condomínio/i);
		expect(parkVeredasPage).toMatch(/## Comparativo/i);
		expect(parkVeredasPage).toMatch(/\|\s*Hospedagem\s*\|/i);
		expect(parkVeredasPage).toMatch(/\|\s*Perfil\s*\|/i);
	});

	it('connects the Rio Quente hotel cluster with internal links', () => {
		expect(parkVeredasPage).toContain('/rio-quente/');
		expect(parkVeredasPage).toContain('/rio-quente/hoteis/');
		expect(parkVeredasPage).toContain('/rio-quente/hoteis-perto-hot-park/');
		expect(parkVeredasPage).toContain('/rio-quente/resorts/');
		expect(parkVeredasPage).toContain('/rio-quente/thermas-paradise/');
		expect(parkVeredasPage).toContain('/rio-quente/img-hotel-rio-quente/');
		expect(parkVeredasPage).toContain('/rio-quente/hotel-luupi-rio-quente/');
		expect(parkVeredasPage).toContain('/rio-quente/hotel-giardino-rio-quente/');
	});

	it('covers conversational FAQs without price answers', () => {
		expect(parkVeredasPage).toMatch(/Hot Park/i);
		expect(parkVeredasPage).toMatch(/perto|próximo|800|900 m|1,?1 km|a pé/i);
		expect(parkVeredasPage).toMatch(/família|grupo/i);
		expect(parkVeredasPage).toMatch(/rio|águas quentes|termal|piscinas/i);
		expect(parkVeredasPage).toMatch(/não.*incluso|à parte|adquiridos? à parte/i);
		expect(parkVeredasPage).not.toMatch(/R\$\s*\d/);
	});

	it('documents typologies, leisure and independence from Rio Quente Resorts', () => {
		expect(parkVeredasPage).toMatch(/apart-hotel|condomínio|flat/i);
		expect(parkVeredasPage).toMatch(/fora do complexo|independente/i);
		expect(parkVeredasPage).toMatch(/cozinha|kitchenette|copa/i);
		expect(parkVeredasPage).toMatch(/piscina/i);
		expect(parkVeredasPage).toMatch(/sauna|espaço kids|brinquedoteca/i);
		expect(parkVeredasPage).toMatch(/Guanabara/i);
		expect(parkVeredasPage).toMatch(/## Como funciona a estadia/i);
	});
});
