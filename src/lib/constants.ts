export const SITE = {
	name: 'Tuki Viagens',
	tagline: 'O Brasil que você sonha, com a leveza do Tuki.',
	url: import.meta.env.PUBLIC_SITE_URL ?? 'http://localhost:4321',
	email: 'contato@tukiviagens.com.br',
	phone: '5517999999999',
	phoneDisplay: '(17) 99999-9999',
} as const;

export const NAV_LINKS = [
	{ label: 'Destinos', href: '/#destinos' },
	{ label: 'Hotéis & Resorts', href: '/#hoteis' },
	{ label: 'Por que Tuki', href: '/#por-que-tuki' },
	{ label: 'Depoimentos', href: '/#depoimentos' },
	{ label: 'Contato', href: '/contato' },
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
	{ name: 'Nordeste', slug: 'nordeste', emoji: '🌴' },
	{ name: 'Fernando de Noronha', slug: 'fernando-de-noronha', emoji: '🏝️' },
	{ name: 'Rio de Janeiro', slug: 'rio-de-janeiro', emoji: '🏖️' },
	{ name: 'Olímpia', slug: 'olimpia', emoji: '♨️' },
	{ name: 'Gramado', slug: 'gramado', emoji: '🍫' },
	{ name: 'Bonito', slug: 'bonito', emoji: '💧' },
] as const;
