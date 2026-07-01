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
	atendimento: '/images/icons/icone-atendimento-humano-tuki-viagens.png',
	seguranca: '/images/icons/icone-seguranca-tuki-viagens.png',
	pacote: '/images/icons/icone-pacote-completo-tuki-viagens.png',
	calendario: '/images/icons/icone-calendario-reservas-tuki-viagens.png',
	contePlano: '/images/icons/icone-conte-planos-tuki-viajens.png',
	recebaOpcoes: '/images/icons/icone-receba-opcoes-tuki-viajens.png',
	viajarSeguranca: '/images/icons/icone-viajar-com-seguranca-tuki-viajens.png',
} as const;

export type TukiIconKey = keyof typeof TUKI_ICONS;

const MARQUEE_ICON_ALTS: Record<TukiIconKey, string> = {
	aviao: 'Avião',
	cadeiraPraia: 'Cadeira de praia',
	cama: 'Cama de hotel',
	carro: 'Carro',
	gramado: 'Gramado',
	hotel: 'Hotel',
	mala: 'Mala de viagem',
	mapa: 'Mapa',
	nordeste: 'Nordeste',
	oculosBoia: 'Óculos e boia',
	olimpia: 'Olímpia',
	pacotesBrasil: 'Pacotes Brasil',
	passaporte: 'Passaporte',
	piscina: 'Piscina',
	placaFerias: 'Placa de férias',
	rioDeJaneiro: 'Rio de Janeiro',
	rioQuente: 'Rio Quente',
	sol: 'Sol',
	atendimento: 'Atendimento',
	seguranca: 'Segurança',
	pacote: 'Pacote completo',
	calendario: 'Calendário',
	contePlano: 'Conte seu plano de viagem',
	recebaOpcoes: 'Receba opções de hotéis',
	viajarSeguranca: 'Viaje com segurança',
};

/** Todos os ícones da marca para a faixa marquee da home. */
export const MARQUEE_ICONS = (Object.entries(TUKI_ICONS) as [TukiIconKey, string][]).map(
	([key, src]) => ({
		src,
		alt: MARQUEE_ICON_ALTS[key],
	}),
);
