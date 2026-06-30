import { TUKI_ICONS } from './icons';

export const SITE = {
	name: 'Tuki Viagens',
	tagline: 'O Brasil que você sonha, com a leveza do Tuki.',
	url: import.meta.env.PUBLIC_SITE_URL ?? 'http://localhost:4321',
	location: 'Olímpia, São Paulo',
	email: 'contato@tukiviagens.com.br',
	phone: '551721901358',
	phoneDisplay: '(17) 2190-1358',
	whatsappDisplay: '(17) 2190-1358',
	cnpj: '58.614.051/0001-93',
	cadastro: 'CNPJ 58.614.051/0001-93',
} as const;

export const BRAND = {
	name: SITE.name,
	logoColor: '/logotipo/logo-color.svg',
	logoWhite: '/logotipo/logo-white.svg',
	logoDark: '/logotipo/logo-dark.svg',
	logoColorPng: '/logotipo/logo-color.png',
	favicon: '/icons/favicon.ico',
	faviconSvg: '/icons/favicon.svg',
	appleTouchIcon: '/icons/apple-touch-icon.jpg',
	ogImage: '/images/og/og-default.png',
	planeIcon: TUKI_ICONS.aviao,
	cadastur: '/images/cadastur-01.png',
	mascot: {
		hero: '/images/mascot/tuki-frente-mala.png',
		profile: '/images/mascot/tuki-perfil.png',
		selfie: '/images/mascot/tuki-celular-selfie.png',
	},
} as const;

export const NAV_LINKS = [
	{ label: 'Olímpia', href: '/olimpia/' },
	{ label: 'Rio Quente', href: '/rio-quente/' },
	{ label: 'Nordeste', href: '/nordeste/' },
	{ label: 'Pacotes', href: '/pacotes-de-viagem-brasil/' },
	{ label: 'Agência', href: '/agencia-de-viagens/' },
	{ label: 'Contato', href: '/contato' },
] as const;

export const HOME_NAV_LINKS = [
	{ label: 'Destinos', href: '/#destinos' },
	{ label: 'Hotéis & Resorts', href: '/#hoteis' },
	{ label: 'Por que Tuki', href: '/#por-que-tuki' },
	{ label: 'Depoimentos', href: '/#depoimentos' },
	{ label: 'Contato', href: '/contato' },
] as const;

export const HERO_EYEBROW = 'Cadastro ativo · Pagamento protegido';

export const HOTELS_PRICE_NOTE = '12x sem juros · consulte disponibilidade';

export const HOME_FEATURED_PROPERTIES = [
	{
		id: 'enjoy-olimpia-park',
		title: 'Enjoy Olímpia Park Resort',
		cidade: 'Olímpia',
		estado: 'SP',
		categoria: 'Resort',
		href: '/olimpia/enjoy-olimpia-park-resort/',
		priceFrom: 'R$ 2.190',
	},
	{
		id: 'wyndham-olimpia',
		title: 'Wyndham Olímpia Royal Hotels',
		cidade: 'Olímpia',
		estado: 'SP',
		categoria: 'All-inclusive',
		href: '/olimpia/wyndham-olimpia-royal-hotels/',
		priceFrom: 'R$ 2.340',
	},
	{
		id: 'enjoy-solar',
		title: 'Enjoy Solar das Águas',
		cidade: 'Olímpia',
		estado: 'SP',
		categoria: 'Resort',
		href: '/olimpia/enjoy-solar-das-aguas/',
		priceFrom: 'R$ 1.890',
	},
	{
		id: 'hot-beach',
		title: 'Hot Beach Olímpia',
		cidade: 'Olímpia',
		estado: 'SP',
		categoria: 'Resort',
		href: '/olimpia/hot-beach/',
		priceFrom: 'R$ 1.690',
	},
	{
		id: 'rio-quente-resorts',
		title: 'Resorts Rio Quente',
		cidade: 'Rio Quente',
		estado: 'GO',
		categoria: 'Resort',
		href: '/rio-quente/resorts/',
		priceFrom: 'R$ 1.520',
	},
	{
		id: 'nordeste-all-inclusive',
		title: 'Resorts All-Inclusive Nordeste',
		cidade: 'Nordeste',
		estado: 'BR',
		categoria: 'All-inclusive',
		href: '/nordeste/resorts-all-inclusive/',
		priceFrom: 'R$ 2.340',
	},
] as const;

export const HERO_BACKGROUND =
	'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2000&q=80';

export const HOTEL_FALLBACK_IMAGES = [
	'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80',
	'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
	'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80',
	'https://images.unsplash.com/photo-1571008887538-b36bb32f4571?auto=format&fit=crop&w=1200&q=80',
	'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1200&q=80',
	'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1200&q=80',
] as const;

export const WHY_TUKI_INTRO =
	'Somos uma agência brasileira apaixonada por mostrar o nosso país. Construímos relações com hotéis e resorts para garantir tarifas justas, conforto e o melhor da experiência — sem abrir mão da segurança.';

export const HERO_FLOATING_BADGES = [
	{ text: 'Olímpia', class: 'left-0 top-2 -rotate-6 md:-left-8', variant: 'white' as const },
	{ text: 'Rio Quente', class: 'right-0 top-10 rotate-3 md:-right-6', variant: 'white' as const },
	{ text: 'Nordeste', class: 'bottom-8 left-4 -rotate-3 md:left-0', variant: 'white' as const },
	{ text: 'Pagamento protegido', class: 'bottom-2 right-0 rotate-2 md:-right-4', variant: 'orange' as const },
] as const;

export const HOTELS_DESCRIPTION =
	'Visitamos, avaliamos e negociamos as melhores tarifas para você. Tudo o que você vê aqui passou pelo crivo Tuki.';

export const DESTINATIONS_EYEBROW = 'Viagem de ponta a ponta';

export const PARTNERS_TITLE = 'Autoridades e empresas que confiam na Tuki';

export const FOOTER_DESTINATIONS = [
	{ label: 'Olímpia', href: '/olimpia/' },
	{ label: 'Rio Quente', href: '/rio-quente/' },
	{ label: 'Nordeste', href: '/nordeste/' },
	{ label: 'Pacotes Brasil', href: '/pacotes-de-viagem-brasil/' },
] as const;

export const HERO_STATS = [
	{ value: '+12 mil', label: 'viagens feitas' },
	{ value: '120+', label: 'hotéis parceiros' },
	{ value: '24h', label: 'atendimento humano' },
] as const;

export const TRUST_ITEMS = [
	{
		title: 'Pagamento protegido',
		description: 'Transações seguras e confiáveis.',
		icon: TUKI_ICONS.passaporte,
		iconAlt: 'Passaporte e documentação de viagem',
	},
	{
		title: 'Suporte 24h',
		description: 'Atendimento humano quando você precisar.',
		icon: TUKI_ICONS.placaFerias,
		iconAlt: 'Placa de férias — suporte durante a viagem',
	},
	{
		title: 'Curadoria Tuki',
		description: 'Hotéis selecionados a dedo para você.',
		icon: TUKI_ICONS.hotel,
		iconAlt: 'Hotel selecionado pela curadoria Tuki',
	},
	{
		title: 'Guia de pagamentos',
		description: 'Parcelamento e opções claras.',
		icon: TUKI_ICONS.mapa,
		iconAlt: 'Mapa e orientação de pagamento',
	},
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
		icon: TUKI_ICONS.passaporte,
		iconAlt: 'Segurança e documentação de viagem',
	},
	{
		title: 'Atendimento humano',
		description: 'Pessoas reais prontas para ajudar na sua viagem.',
		icon: TUKI_ICONS.mala,
		iconAlt: 'Mala de viagem com atendimento Tuki',
	},
	{
		title: 'Facilidade de reserva',
		description: 'Processo simples, rápido e sem burocracia.',
		icon: TUKI_ICONS.aviao,
		iconAlt: 'Avião — reserva descomplicada',
	},
	{
		title: 'Pacote completo',
		description: 'Hospedagem, suporte e orientação em um só lugar.',
		icon: TUKI_ICONS.cama,
		iconAlt: 'Hospedagem confortável em pacote completo',
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
	{ name: 'Enjoy', href: '/olimpia/enjoy-olimpia-park-resort/' },
	{ name: 'Wyndham', href: '/olimpia/wyndham-olimpia-royal-hotels/' },
	{ name: 'Hot Beach', href: '/olimpia/hot-beach/' },
	{ name: 'Thermas', href: '/olimpia/thermas-dos-laranjais/' },
	{ name: 'Solar das Águas', href: '/olimpia/enjoy-solar-das-aguas/' },
	{ name: 'Rio Quente', href: '/rio-quente/' },
] as const;

export const HOME_DESTINATIONS = [
	{
		name: 'Nordeste',
		slug: 'nordeste',
		href: '/nordeste/',
		icon: TUKI_ICONS.nordeste,
		iconAlt: 'Ícone do Nordeste',
	},
	{
		name: 'Olímpia',
		slug: 'olimpia',
		href: '/olimpia/',
		icon: TUKI_ICONS.olimpia,
		iconAlt: 'Ícone de Olímpia — parques e resorts',
	},
	{
		name: 'Rio Quente',
		slug: 'rio-quente',
		href: '/rio-quente/',
		icon: TUKI_ICONS.rioQuente,
		iconAlt: 'Ícone de Rio Quente',
	},
	{
		name: 'Pacotes Brasil',
		slug: 'pacotes',
		href: '/pacotes-de-viagem-brasil/',
		icon: TUKI_ICONS.pacotesBrasil,
		iconAlt: 'Ícone de pacotes pelo Brasil',
	},
	{
		name: 'Rio de Janeiro',
		slug: 'rio-de-janeiro',
		href: '/pacotes-de-viagem-brasil/',
		icon: TUKI_ICONS.rioDeJaneiro,
		iconAlt: 'Ícone do Rio de Janeiro',
	},
	{
		name: 'Gramado',
		slug: 'gramado',
		href: '/pacotes-de-viagem-brasil/',
		icon: TUKI_ICONS.gramado,
		iconAlt: 'Ícone de Gramado e Serra Gaúcha',
	},
] as const;
