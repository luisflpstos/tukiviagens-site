export const SITE = {
	name: 'Tuki Viagens',
	tagline: 'O Brasil que você sonha, com a leveza do Tuki.',
	url: import.meta.env.PUBLIC_SITE_URL ?? 'http://localhost:4321',
	email: 'contato@tukiviagens.com.br',
	phone: '5517999999999',
	phoneDisplay: '(17) 99999-9999',
} as const;

export const NAV_LINKS = [
	{ label: 'Olímpia', href: '/olimpia/' },
	{ label: 'Rio Quente', href: '/rio-quente/' },
	{ label: 'Nordeste', href: '/nordeste/' },
	{ label: 'Pacotes', href: '/pacotes-de-viagem-brasil/' },
	{ label: 'Agência', href: '/agencia-de-viagens/' },
	{ label: 'Contato', href: '/contato' },
] as const;

export const FOOTER_DESTINATIONS = [
	{ label: 'Olímpia', href: '/olimpia/' },
	{ label: 'Rio Quente', href: '/rio-quente/' },
	{ label: 'Nordeste', href: '/nordeste/' },
	{ label: 'Pacotes Brasil', href: '/pacotes-de-viagem-brasil/' },
] as const;

export const HERO_STATS = [
	{ value: '+12 mil', label: 'viagens feitas' },
	{ value: '4.9★', label: 'avaliação média' },
	{ value: '120+', label: 'hotéis parceiros' },
] as const;

export const TRUST_ITEMS = [
	{ title: 'Pagamento protegido', description: 'Transações seguras e confiáveis.' },
	{ title: 'Suporte 24h', description: 'Atendimento humano quando você precisar.' },
	{ title: 'Curadoria Tuki', description: 'Hotéis selecionados a dedo para você.' },
	{ title: 'Guia de pagamentos', description: 'Parcelamento e opções claras.' },
] as const;

export const WHY_TUKI_BENEFITS = [
	'Hotéis e resorts selecionados com critério',
	'Atendimento humano do início ao fim',
	'Pagamento seguro e transparente',
	'Suporte durante toda a viagem',
] as const;

export const WHY_TUKI_CARDS = [
	{
		title: 'Segurança em primeiro lugar',
		description: 'Pagamentos protegidos e parceiros confiáveis.',
	},
	{
		title: 'Atendimento humano',
		description: 'Pessoas reais prontas para ajudar na sua viagem.',
	},
	{
		title: 'Facilidade de reserva',
		description: 'Processo simples, rápido e sem burocracia.',
	},
	{
		title: 'Pacote completo',
		description: 'Hospedagem, suporte e orientação em um só lugar.',
	},
] as const;

export const TESTIMONIALS = [
	{
		name: 'Mariana S.',
		location: 'São Paulo, SP',
		rating: 5,
		text: 'Viajei para Olímpia com a família e a experiência foi impecável. Atendimento rápido e hotel excelente!',
	},
	{
		name: 'Carlos R.',
		location: 'Campinas, SP',
		rating: 5,
		text: 'Encontrei o resort perfeito pelo Tuki. Tudo organizado, sem stress e com preço justo.',
	},
	{
		name: 'Juliana M.',
		location: 'Ribeirão Preto, SP',
		rating: 5,
		text: 'Adorei a curadoria! Me indicaram opções que realmente faziam sentido para o que eu buscava.',
	},
] as const;

export const PARTNERS = [
	'Enjoy',
	'Wyndham',
	'Pratagy',
	'Thermas',
	'Blue Tree',
	'Nacional Inn',
] as const;

export const HOME_DESTINATIONS = [
	{ name: 'Nordeste', slug: 'nordeste', href: '/nordeste/', emoji: '🌴' },
	{ name: 'Olímpia', slug: 'olimpia', href: '/olimpia/', emoji: '♨️' },
	{ name: 'Rio Quente', slug: 'rio-quente', href: '/rio-quente/', emoji: '💦' },
	{ name: 'Pacotes Brasil', slug: 'pacotes', href: '/pacotes-de-viagem-brasil/', emoji: '✈️' },
	{ name: 'Rio de Janeiro', slug: 'rio-de-janeiro', href: '/pacotes-de-viagem-brasil/', emoji: '🏖️' },
	{ name: 'Gramado', slug: 'gramado', href: '/pacotes-de-viagem-brasil/', emoji: '🍫' },
] as const;
