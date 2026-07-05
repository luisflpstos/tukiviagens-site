/**
 * Arquitetura de URLs baseada no levantamento SEO/GEO (2026-06-30).
 * status: published = conteúdo ativo; planned = rota reservada na estrutura.
 */

export type PageType = 'hub' | 'venda' | 'atracao' | 'hotel' | 'resort' | 'institucional';
export type PageStatus = 'published' | 'planned';
export type Silo = 'olimpia' | 'rio-quente' | 'nordeste' | 'pacotes' | 'agencia';

export interface SiteRoute {
	path: string;
	title: string;
	pageType: PageType;
	silo?: Silo;
	status: PageStatus;
	keywords: string[];
	parent?: string;
}

function route(
	path: string,
	title: string,
	pageType: PageType,
	status: PageStatus,
	keywords: string[],
	options?: { silo?: Silo; parent?: string },
): SiteRoute {
	return {
		path,
		title,
		pageType,
		status,
		keywords,
		silo: options?.silo,
		parent: options?.parent,
	};
}

/** Todas as rotas planejadas — hubs, venda, atrações, hotéis e resorts. */
export const SITE_ROUTES: SiteRoute[] = [
	// Olímpia
	route('/olimpia/', 'Guia de Olímpia', 'hub', 'published', [
		'thermas dos laranjais',
		'hotel em olimpia',
		'resort olimpia',
	], { silo: 'olimpia' }),
	route('/olimpia/hoteis/', 'Hotéis em Olímpia', 'venda', 'published', [
		'hotel em olimpia',
		'hoteis em olimpia',
		'hotel olimpia sp',
	], { silo: 'olimpia', parent: '/olimpia/' }),
	route('/olimpia/resorts/', 'Resorts em Olímpia', 'venda', 'published', [
		'resort olimpia',
		'resorts em olimpia',
	], { silo: 'olimpia', parent: '/olimpia/' }),
	route(
		'/olimpia/hoteis-perto-thermas-dos-laranjais/',
		'Hotéis perto do Thermas dos Laranjais',
		'venda',
		'published',
		['hotel perto thermas dos laranjais', 'hospedagem thermas dos laranjais'],
		{ silo: 'olimpia', parent: '/olimpia/' },
	),
	route(
		'/olimpia/thermas-dos-laranjais/',
		'Thermas dos Laranjais',
		'atracao',
		'published',
		['thermas dos laranjais', 'thermas dos laranjais olimpia'],
		{ silo: 'olimpia', parent: '/olimpia/' },
	),
	route('/olimpia/hot-beach/', 'Hot Beach Olímpia', 'atracao', 'published', [
		'hot beach olimpia',
		'hot beach resort olimpia',
	], { silo: 'olimpia', parent: '/olimpia/' }),
	route(
		'/olimpia/wyndham-olimpia-royal-hotels/',
		'Wyndham Olímpia Royal Hotels',
		'hotel',
		'published',
		['wyndham olimpia royal hotels', 'hotel wyndham olimpia'],
		{ silo: 'olimpia', parent: '/olimpia/resorts/' },
	),
	route(
		'/olimpia/enjoy-olimpia-park-resort/',
		'Enjoy Olímpia Park Resort',
		'hotel',
		'published',
		['enjoy olimpia park resort', 'olimpia park resort'],
		{ silo: 'olimpia', parent: '/olimpia/resorts/' },
	),
	route(
		'/olimpia/enjoy-solar-das-aguas/',
		'Enjoy Solar das Águas',
		'hotel',
		'published',
		['enjoy solar das aguas', 'solar das aguas olimpia'],
		{ silo: 'olimpia', parent: '/olimpia/resorts/' },
	),
	route(
		'/olimpia/thermas-park-resort-hot-beach-raizes/',
		'Thermas Park Resort & Spa',
		'hotel',
		'published',
		['thermas park resort olimpia', 'hot beach raizes'],
		{ silo: 'olimpia', parent: '/olimpia/resorts/' },
	),
	route(
		'/olimpia/celebration-resort-olimpia/',
		'Celebration Resort Olímpia',
		'hotel',
		'published',
		['celebration resort olimpia', 'resort celebration olimpia'],
		{ silo: 'olimpia', parent: '/olimpia/resorts/' },
	),
	route(
		'/olimpia/hot-beach-resort/',
		'Hot Beach Resort',
		'hotel',
		'published',
		['hot beach resort olimpia', 'resort hot beach'],
		{ silo: 'olimpia', parent: '/olimpia/resorts/' },
	),
	route(
		'/olimpia/carpe-diem-eco-resort-olimpia/',
		'Carpe Diem Eco Resort Olímpia',
		'hotel',
		'published',
		['carpe diem eco resort olimpia', 'carpe diem resort olimpia'],
		{ silo: 'olimpia', parent: '/olimpia/resorts/' },
	),
	route(
		'/olimpia/thermas-olimpia-resorts-mercure/',
		'Thermas de Olímpia Resorts by Mercure',
		'hotel',
		'published',
		['mercure olimpia', 'thermas olimpia resorts mercure'],
		{ silo: 'olimpia', parent: '/olimpia/resorts/' },
	),
	route(
		'/olimpia/hot-beach-suites/',
		'Hot Beach Suites',
		'hotel',
		'published',
		['hot beach suites olimpia', 'suites hot beach'],
		{ silo: 'olimpia', parent: '/olimpia/resorts/' },
	),
	route(
		'/olimpia/wyndham-royal-star-thermas-resort/',
		'Wyndham Royal Star Thermas Resort',
		'hotel',
		'published',
		['wyndham royal star olimpia', 'royal star thermas resort'],
		{ silo: 'olimpia', parent: '/olimpia/resorts/' },
	),
	route(
		'/olimpia/villa-italia-olimpia/',
		'Hotel Pousada Villa Itália Olímpia',
		'hotel',
		'published',
		['villa italia olimpia', 'hotel pousada villa italia'],
		{ silo: 'olimpia', parent: '/olimpia/hoteis/' },
	),
	route(
		'/olimpia/parque-das-aguas/',
		'Hotel Pousada Parque das Águas',
		'hotel',
		'published',
		['parque das aguas olimpia', 'hotel pousada parque das aguas'],
		{ silo: 'olimpia', parent: '/olimpia/hoteis/' },
	),
	route(
		'/olimpia/hotel-fazenda-haras/',
		'Hotel Fazenda Haras',
		'hotel',
		'published',
		['hotel fazenda haras olimpia', 'fazenda haras olimpia'],
		{ silo: 'olimpia', parent: '/olimpia/hoteis/' },
	),
	route(
		'/olimpia/hotel-dolce-dulce/',
		'Hotel Dolce Dulce',
		'hotel',
		'published',
		['hotel dolce dulce olimpia', 'dolce dulce olimpia'],
		{ silo: 'olimpia', parent: '/olimpia/hoteis/' },
	),
	route(
		'/olimpia/agua-viva-hotel/',
		'Água Viva Hotel',
		'hotel',
		'published',
		['agua viva hotel olimpia', 'hotel perto thermas dos laranjais'],
		{ silo: 'olimpia', parent: '/olimpia/hoteis/' },
	),
	route(
		'/olimpia/tiffany-hotel/',
		'Tiffany Hotel',
		'hotel',
		'published',
		['tiffany hotel olimpia', 'hotel tiffany olimpia'],
		{ silo: 'olimpia', parent: '/olimpia/hoteis/' },
	),
	route(
		'/olimpia/villa-rebellato/',
		'Hotel Villa Rebellato',
		'hotel',
		'published',
		['villa rebellato olimpia', 'hotel villa rebellato'],
		{ silo: 'olimpia', parent: '/olimpia/hoteis/' },
	),
	route(
		'/olimpia/gloria-hotel/',
		'Glória Hotel',
		'hotel',
		'published',
		['gloria hotel olimpia', 'hotel gloria olimpia'],
		{ silo: 'olimpia', parent: '/olimpia/hoteis/' },
	),
	route(
		'/olimpia/js-thermas-hotel/',
		'JS Thermas Hotel',
		'hotel',
		'published',
		['js thermas hotel olimpia', 'hotel barato olimpia'],
		{ silo: 'olimpia', parent: '/olimpia/hoteis/' },
	),

	// Rio Quente
	route('/rio-quente/', 'Rio Quente e Hot Park', 'hub', 'published', [
		'rio quente',
		'hot park',
	], { silo: 'rio-quente' }),
	route('/rio-quente/hoteis/', 'Hotéis no Rio Quente', 'venda', 'published', [
		'hoteis rio quente',
		'hotel em rio quente',
	], { silo: 'rio-quente', parent: '/rio-quente/' }),
	route('/rio-quente/resorts/', 'Resorts no Rio Quente', 'venda', 'published', [
		'resort rio quente',
		'rio quente resorts',
	], { silo: 'rio-quente', parent: '/rio-quente/' }),
	route(
		'/rio-quente/hoteis-perto-hot-park/',
		'Hotéis perto do Hot Park',
		'venda',
		'published',
		['hotel perto hot park', 'hospedagem rio quente'],
		{ silo: 'rio-quente', parent: '/rio-quente/' },
	),
	route(
		'/rio-quente/prime-hotel-aguas-da-serra/',
		'Prime Hotel Águas da Serra',
		'hotel',
		'published',
		['prime hotel aguas da serra', 'prime hotel rio quente'],
		{ silo: 'rio-quente', parent: '/rio-quente/hoteis/' },
	),
	route(
		'/rio-quente/serra-madre-hotel/',
		'Serra Madre Hotel',
		'hotel',
		'published',
		['serra madre hotel rio quente', 'serra madre hotel'],
		{ silo: 'rio-quente', parent: '/rio-quente/hoteis/' },
	),
	route(
		'/rio-quente/thermas-paradise/',
		'Thermas Paradise',
		'hotel',
		'published',
		['thermas paradise rio quente', 'thermas paradise'],
		{ silo: 'rio-quente', parent: '/rio-quente/hoteis/' },
	),
	route(
		'/rio-quente/aguas-da-serra-rio-quente/',
		'Águas da Serra',
		'hotel',
		'published',
		['aguas da serra rio quente', 'aguas da serra apart hotel'],
		{ silo: 'rio-quente', parent: '/rio-quente/hoteis/' },
	),
	route(
		'/rio-quente/hotel-giardino-rio-quente/',
		'Hotel Giardino, Rio Quente Resorts',
		'hotel',
		'published',
		['hotel giardino rio quente', 'rio quente resorts hotel giardino'],
		{ silo: 'rio-quente', parent: '/rio-quente/resorts/' },
	),
	route(
		'/rio-quente/img-hotel-rio-quente/',
		'IMG Hotel Rio Quente',
		'hotel',
		'published',
		['img hotel rio quente', 'img rio quente'],
		{ silo: 'rio-quente', parent: '/rio-quente/hoteis/' },
	),
	route(
		'/rio-quente/park-veredas-resort/',
		'Park Veredas Resort',
		'hotel',
		'published',
		['park veredas resort rio quente', 'park veredas resort'],
		{ silo: 'rio-quente', parent: '/rio-quente/resorts/' },
	),
	route(
		'/rio-quente/apartamentos-em-rio-quente/',
		'Apartamentos em Rio Quente',
		'hotel',
		'published',
		['apartamentos em rio quente', 'apartamento rio quente'],
		{ silo: 'rio-quente', parent: '/rio-quente/hoteis/' },
	),
	route(
		'/rio-quente/hotel-luupi-rio-quente/',
		'Hotel Luupi, Rio Quente Resorts',
		'hotel',
		'published',
		['hotel luupi rio quente', 'rio quente resorts hotel luupi'],
		{ silo: 'rio-quente', parent: '/rio-quente/resorts/' },
	),
	route(
		'/rio-quente/refugio-grand-premium/',
		'Refúgio Grand Premium',
		'hotel',
		'published',
		['refugio grand premium rio quente', 'hotel turismo rio quente'],
		{ silo: 'rio-quente', parent: '/rio-quente/resorts/' },
	),
	route(
		'/rio-quente/hotel-cristal-rio-quente/',
		'Hotel Cristal, Rio Quente Resorts',
		'hotel',
		'published',
		['hotel cristal rio quente', 'rio quente resorts hotel cristal'],
		{ silo: 'rio-quente', parent: '/rio-quente/resorts/' },
	),
	route(
		'/rio-quente/hotel-pousada-rio-quente/',
		'Hotel Pousada, Rio Quente Resorts',
		'hotel',
		'published',
		['hotel pousada rio quente', 'pousada do rio quente'],
		{ silo: 'rio-quente', parent: '/rio-quente/resorts/' },
	),
	route(
		'/rio-quente/eco-chales-rio-quente/',
		'Eco Chalés, Rio Quente Resorts',
		'hotel',
		'published',
		['eco chales rio quente', 'rio quente resorts eco chales'],
		{ silo: 'rio-quente', parent: '/rio-quente/resorts/' },
	),
	route(
		'/rio-quente/thermas-paradise-residence/',
		'Thermas Paradise Residence',
		'hotel',
		'published',
		['thermas paradise residence', 'thermas paradise residence rio quente'],
		{ silo: 'rio-quente', parent: '/rio-quente/resorts/' },
	),

	// Nordeste
	route('/nordeste/', 'Resorts e hotéis no Nordeste', 'hub', 'published', [
		'resort nordeste',
		'hoteis no nordeste',
	], { silo: 'nordeste' }),
	route(
		'/nordeste/resorts-all-inclusive/',
		'Resorts all inclusive no Nordeste',
		'venda',
		'published',
		['resort all inclusive nordeste', 'hotel all inclusive nordeste'],
		{ silo: 'nordeste', parent: '/nordeste/' },
	),

	// Pacotes e institucional
	route('/pacotes-de-viagem-brasil/', 'Pacotes de viagem no Brasil', 'hub', 'published', [
		'pacotes de viagem brasil',
		'pacotes de viagem nacionais',
	], { silo: 'pacotes' }),
	route('/agencia-de-viagens/', 'Agência de viagens', 'institucional', 'published', [
		'agência de viagens',
		'reserva de hotel',
		'consultor de viagens',
	], { silo: 'agencia' }),
];

export function normalizePath(path: string): string {
	const trimmed = path.replace(/\/+$/, '') || '/';
	return trimmed === '/' ? '/' : `${trimmed}/`;
}

export function pathToSlug(path: string): string {
	return normalizePath(path).replace(/^\/|\/$/g, '');
}

export function slugToPath(slug: string): string {
	return slug ? `/${slug}/` : '/';
}

export function getRouteByPath(path: string): SiteRoute | undefined {
	const normalized = normalizePath(path);
	return SITE_ROUTES.find((r) => normalizePath(r.path) === normalized);
}

export function getChildRoutes(parentPath: string): SiteRoute[] {
	const normalized = normalizePath(parentPath);
	return SITE_ROUTES.filter((r) => r.parent && normalizePath(r.parent) === normalized);
}

export function getPublishedHubs(): SiteRoute[] {
	return SITE_ROUTES.filter((r) => r.pageType === 'hub' && r.status === 'published');
}

export function getRoutesBySilo(silo: Silo): SiteRoute[] {
	return SITE_ROUTES.filter((r) => r.silo === silo);
}
