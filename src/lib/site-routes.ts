/**
 * Arquitetura de URLs baseada no levantamento SEO/GEO (2026-06-30).
 * status: published = conteúdo ativo; planned = rota reservada na estrutura.
 */

export type PageType = 'hub' | 'venda' | 'atracao' | 'propriedade' | 'institucional';
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

/** Todas as rotas planejadas — hubs, venda, atrações e propriedades. */
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
		'propriedade',
		'published',
		['wyndham olimpia royal hotels', 'hotel wyndham olimpia'],
		{ silo: 'olimpia', parent: '/olimpia/resorts/' },
	),
	route(
		'/olimpia/enjoy-olimpia-park-resort/',
		'Enjoy Olímpia Park Resort',
		'propriedade',
		'published',
		['enjoy olimpia park resort', 'olimpia park resort'],
		{ silo: 'olimpia', parent: '/olimpia/resorts/' },
	),
	route(
		'/olimpia/enjoy-solar-das-aguas/',
		'Enjoy Solar das Águas',
		'propriedade',
		'published',
		['enjoy solar das aguas', 'solar das aguas olimpia'],
		{ silo: 'olimpia', parent: '/olimpia/resorts/' },
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
