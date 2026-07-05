import { describe, expect, it } from 'vitest';
import { resolveLeadDestination } from './lead-destination';

describe('resolveLeadDestination', () => {
	it('prioriza cidade do conteúdo', () => {
		expect(resolveLeadDestination({ cidade: 'Olímpia', path: '/rio-quente/hoteis/' })).toBe('Olímpia');
	});

	it('resolve destino pelo silo', () => {
		expect(resolveLeadDestination({ silo: 'rio-quente' })).toBe('Rio Quente');
	});

	it('resolve destino pelo primeiro segmento da URL', () => {
		expect(resolveLeadDestination({ path: '/olimpia/hot-beach-resort/' })).toBe('Olímpia');
		expect(resolveLeadDestination({ path: '/rio-quente/hotel-giardino-rio-quente/' })).toBe('Rio Quente');
	});
});
