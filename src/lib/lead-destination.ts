/** Nome comercial do destino por silo ou slug de URL. */
export const SILO_DESTINATION_NAMES: Record<string, string> = {
	olimpia: 'Olímpia',
	'rio-quente': 'Rio Quente',
	'caldas-novas': 'Caldas Novas',
	nordeste: 'Nordeste',
	gramado: 'Gramado',
	'rio-de-janeiro': 'Rio de Janeiro',
};

export function resolveLeadDestination(options: {
	path?: string;
	silo?: string;
	cidade?: string;
	fallback?: string;
}): string | undefined {
	const cidade = options.cidade?.trim();
	if (cidade) return cidade;

	const silo = options.silo?.trim();
	if (silo && SILO_DESTINATION_NAMES[silo]) {
		return SILO_DESTINATION_NAMES[silo];
	}

	const firstSegment = options.path?.split('/').filter(Boolean)[0];
	if (firstSegment && SILO_DESTINATION_NAMES[firstSegment]) {
		return SILO_DESTINATION_NAMES[firstSegment];
	}

	const fallback = options.fallback?.trim();
	return fallback || undefined;
}
