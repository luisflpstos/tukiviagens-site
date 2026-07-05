export interface LeadGeoData {
	cidade: string | null;
	regiao: string | null;
	pais: string | null;
	cep: string | null;
	latitude: string | null;
	longitude: string | null;
}

/** Captura dados geográficos a partir dos headers da Vercel (somente servidor). */
export function extractGeoFromRequest(request: Request): LeadGeoData {
	const get = (name: string) => request.headers.get(name)?.trim() || null;

	const cidade = get('x-vercel-ip-city');
	const regiao = get('x-vercel-ip-country-region');
	const pais = get('x-vercel-ip-country');
	const latitude = get('x-vercel-ip-latitude');
	const longitude = get('x-vercel-ip-longitude');

	// CEP exato não está disponível via IP; mantemos região/cidade para enriquecimento.
	const cep = regiao && cidade ? `${regiao}-${cidade}` : regiao;

	return { cidade, regiao, pais, cep, latitude, longitude };
}
