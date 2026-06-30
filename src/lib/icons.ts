/**
 * Ícones 3D da marca Tuki Viagens (`public/images/icons/`).
 * Usar estes caminhos em vez de emojis ou SVGs genéricos.
 */
export const TUKI_ICONS = {
	aviao: '/images/icons/icone-aviao-tuki-viagens.png',
	cadeiraPraia: '/images/icons/icone-cadeira-praia-tuki-viagens.png',
	cama: '/images/icons/icone-cama-tuki-viagens.png',
	carro: '/images/icons/icone-carro-tuki-viagens.png',
	gramado: '/images/icons/icone-gramado-tuki-viagens.png',
	hotel: '/images/icons/icone-hotel-tuki-viagens.png',
	mala: '/images/icons/icone-mala-tuki-viagens.png',
	mapa: '/images/icons/icone-mapa-tuki-viagens.png',
	nordeste: '/images/icons/icone-nordeste-tuki-viagens.png',
	oculosBoia: '/images/icons/icone-oculos-boia-tuki-viagens.png',
	olimpia: '/images/icons/icone-olimpia-tuki-viagens.png',
	pacotesBrasil: '/images/icons/icone-pacotes-brasil-tuki-viagens.png',
	passaporte: '/images/icons/icone-passaporte-tuki-viagens.png',
	piscina: '/images/icons/icone-piscina-tuki-viagens.png',
	placaFerias: '/images/icons/icone-placa-ferias-tuki-viagens.png',
	rioDeJaneiro: '/images/icons/icone-rio-de-janeiro-tuki-viagens.png',
	rioQuente: '/images/icons/icone-rio-quente-tuki-viagens.png',
	sol: '/images/icons/icone-sol-tuki-viagens.png',
} as const;

export type TukiIconKey = keyof typeof TUKI_ICONS;
