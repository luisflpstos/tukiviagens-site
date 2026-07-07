import { A as sequence, V as defineMiddleware } from "./chunks/render_C4aeKM4T.mjs";
import { existsSync } from "node:fs";
import { join } from "node:path";
//#region src/lib/icons.ts
/**
* Ícones 3D da marca Tuki Viagens (`public/images/icons/`).
* Usar estes caminhos em vez de emojis ou SVGs genéricos.
*/
var TUKI_ICONS = {
	aviao: "/images/icons/icone-aviao-tuki-viagens.png",
	cadeiraPraia: "/images/icons/icone-cadeira-praia-tuki-viagens.png",
	cama: "/images/icons/icone-cama-tuki-viagens.png",
	carro: "/images/icons/icone-carro-tuki-viagens.png",
	gramado: "/images/icons/icone-gramado-tuki-viagens.png",
	hotel: "/images/icons/icone-hotel-tuki-viagens.png",
	mala: "/images/icons/icone-mala-tuki-viagens.png",
	mapa: "/images/icons/icone-mapa-tuki-viagens.png",
	nordeste: "/images/icons/icone-nordeste-tuki-viagens.png",
	oculosBoia: "/images/icons/icone-oculos-boia-tuki-viagens.png",
	olimpia: "/images/icons/icone-olimpia-tuki-viagens.png",
	pacotesBrasil: "/images/icons/icone-pacotes-brasil-tuki-viagens.png",
	passaporte: "/images/icons/icone-passaporte-tuki-viagens.png",
	piscina: "/images/icons/icone-piscina-tuki-viagens.png",
	placaFerias: "/images/icons/icone-placa-ferias-tuki-viagens.png",
	rioDeJaneiro: "/images/icons/icone-rio-de-janeiro-tuki-viagens.png",
	rioQuente: "/images/icons/icone-rio-quente-tuki-viagens.png",
	sol: "/images/icons/icone-sol-tuki-viagens.png",
	atendimento: "/images/icons/icone-atendimento-humano-tuki-viagens.png",
	seguranca: "/images/icons/icone-seguranca-tuki-viagens.png",
	pacote: "/images/icons/icone-pacote-completo-tuki-viagens.png",
	calendario: "/images/icons/icone-calendario-reservas-tuki-viagens.png",
	contePlano: "/images/icons/icone-conte-planos-tuki-viajens.png",
	recebaOpcoes: "/images/icons/icone-receba-opcoes-tuki-viajens.png",
	viajarSeguranca: "/images/icons/icone-viajar-com-seguranca-tuki-viajens.png"
};
var MARQUEE_ICON_ALTS = {
	aviao: "Avião",
	cadeiraPraia: "Cadeira de praia",
	cama: "Cama de hotel",
	carro: "Carro",
	gramado: "Gramado",
	hotel: "Hotel",
	mala: "Mala de viagem",
	mapa: "Mapa",
	nordeste: "Nordeste",
	oculosBoia: "Óculos e boia",
	olimpia: "Olímpia",
	pacotesBrasil: "Pacotes Brasil",
	passaporte: "Passaporte",
	piscina: "Piscina",
	placaFerias: "Placa de férias",
	rioDeJaneiro: "Rio de Janeiro",
	rioQuente: "Rio Quente",
	sol: "Sol",
	atendimento: "Atendimento",
	seguranca: "Segurança",
	pacote: "Pacote completo",
	calendario: "Calendário",
	contePlano: "Conte seu plano de viagem",
	recebaOpcoes: "Receba opções de hotéis",
	viajarSeguranca: "Viaje com segurança"
};
Object.entries(TUKI_ICONS).map(([key, src]) => ({
	src,
	alt: MARQUEE_ICON_ALTS[key]
}));
//#endregion
//#region src/lib/constants.ts
var INACTIVE_ROUTE_PATHS = /* @__PURE__ */ new Set(["/pacotes-de-viagem-brasil/"]);
var INACTIVE_DESTINATION_SLUGS = /* @__PURE__ */ new Set([
	"pacotes",
	"rio-de-janeiro",
	"gramado"
]);
({
	name: "Tuki Viagens",
	tagline: "Hospedagens, hotéis, resorts e parques no Brasil — segurança, rapidez e preço justo.",
	url: "https://www.tukiviagens.com.br",
	location: "Olímpia, São Paulo",
	email: "contato@tukiviagens.com.br",
	phone: "551721901358",
	phoneDisplay: "(17) 2190-1358",
	whatsappDisplay: "(17) 2190-1358",
	cnpj: "58.614.051/0001-93",
	cadastro: "CNPJ 58.614.051/0001-93"
}).name, TUKI_ICONS.aviao;
[
	{
		label: "Olímpia",
		href: "/olimpia/"
	},
	{
		label: "Rio Quente",
		href: "/rio-quente/"
	},
	{
		label: "Nordeste",
		href: "/nordeste/"
	},
	{
		label: "Pacotes",
		href: "/pacotes-de-viagem-brasil/"
	},
	{
		label: "Agência",
		href: "/agencia-de-viagens/"
	},
	{
		label: "Contato",
		href: "/contato"
	}
].filter((link) => !INACTIVE_ROUTE_PATHS.has(link.href));
[
	{
		label: "Olímpia",
		href: "/olimpia/"
	},
	{
		label: "Rio Quente",
		href: "/rio-quente/"
	},
	{
		label: "Nordeste",
		href: "/nordeste/"
	},
	{
		label: "Pacotes Brasil",
		href: "/pacotes-de-viagem-brasil/"
	}
].filter((link) => !INACTIVE_ROUTE_PATHS.has(link.href));
TUKI_ICONS.contePlano, TUKI_ICONS.recebaOpcoes, TUKI_ICONS.viajarSeguranca;
TUKI_ICONS.seguranca, TUKI_ICONS.atendimento, TUKI_ICONS.hotel, TUKI_ICONS.mapa;
TUKI_ICONS.seguranca, TUKI_ICONS.atendimento, TUKI_ICONS.calendario, TUKI_ICONS.pacote;
[
	{
		name: "Nordeste",
		slug: "nordeste",
		href: "/nordeste/",
		icon: TUKI_ICONS.nordeste,
		iconAlt: "Ícone do Nordeste"
	},
	{
		name: "Olímpia",
		slug: "olimpia",
		href: "/olimpia/",
		icon: TUKI_ICONS.olimpia,
		iconAlt: "Ícone de Olímpia — parques e resorts"
	},
	{
		name: "Rio Quente",
		slug: "rio-quente",
		href: "/rio-quente/",
		icon: TUKI_ICONS.rioQuente,
		iconAlt: "Ícone de Rio Quente"
	},
	{
		name: "Pacotes Brasil",
		slug: "pacotes",
		href: "/pacotes-de-viagem-brasil/",
		icon: TUKI_ICONS.pacotesBrasil,
		iconAlt: "Ícone de pacotes pelo Brasil"
	},
	{
		name: "Rio de Janeiro",
		slug: "rio-de-janeiro",
		href: "/pacotes-de-viagem-brasil/",
		icon: TUKI_ICONS.rioDeJaneiro,
		iconAlt: "Ícone do Rio de Janeiro"
	},
	{
		name: "Gramado",
		slug: "gramado",
		href: "/pacotes-de-viagem-brasil/",
		icon: TUKI_ICONS.gramado,
		iconAlt: "Ícone de Gramado e Serra Gaúcha"
	}
].filter((dest) => !INACTIVE_DESTINATION_SLUGS.has(dest.slug));
//#endregion
//#region src/middleware.ts
var STATIC_ASSET_PREFIXES = [
	"/images/",
	"/icons/",
	"/logotipo/",
	"/Logotipo/"
];
var STATIC_ASSET_EXTENSIONS = /\.(avif|gif|ico|jpe?g|png|svg|webp)$/i;
function isStaticAssetPath(pathname) {
	return STATIC_ASSET_PREFIXES.some((prefix) => pathname.startsWith(prefix)) || STATIC_ASSET_EXTENSIONS.test(pathname);
}
//#endregion
//#region \0virtual:astro:middleware
var onRequest = sequence(defineMiddleware(async (context, next) => {
	const { pathname } = context.url;
	if (isStaticAssetPath(pathname)) {
		if (!existsSync(join(process.cwd(), "public", pathname))) return new Response(null, { status: 404 });
	}
	return await next();
}));
//#endregion
export { onRequest };
