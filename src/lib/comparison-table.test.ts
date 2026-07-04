import { describe, expect, it } from 'vitest';
import {
	DEFAULT_COMPARISON_COLUMNS,
	isComparisonSectionHeading,
	parseMarkdownTable,
} from './comparison-table';

describe('parseMarkdownTable', () => {
	it('parses a standard three-column markdown table', () => {
		const markdown = `| Resort | Perfil | Diferencial |
| --- | --- | --- |
| Enjoy Olímpia Park Resort | Família, parque integrado | Parque aquático no resort |
| [Wyndham](/olimpia/wyndham/) | Premium, all inclusive | Spa, kids club |`;

		const result = parseMarkdownTable(markdown);

		expect(result).toEqual({
			columns: ['Resort', 'Perfil', 'Diferencial'],
			rows: [
				{
					cells: ['Enjoy Olímpia Park Resort', 'Família, parque integrado', 'Parque aquático no resort'],
					links: {},
				},
				{
					cells: ['Wyndham', 'Premium, all inclusive', 'Spa, kids club'],
					links: { 0: '/olimpia/wyndham/' },
				},
			],
		});
	});

	it('returns null when markdown has no table', () => {
		expect(parseMarkdownTable('## Comparativo\n\nTexto sem tabela.')).toBeNull();
	});

	it('returns null for malformed tables', () => {
		expect(parseMarkdownTable('| A | B |\n| --- | --- |')).toBeNull();
	});
});

describe('isComparisonSectionHeading', () => {
	it('matches comparativo headings', () => {
		expect(isComparisonSectionHeading('Comparativo com outros resorts')).toBe(true);
		expect(isComparisonSectionHeading('Comparativo dos principais resorts')).toBe(true);
		expect(isComparisonSectionHeading('Comparativo rápido')).toBe(true);
	});

	it('rejects unrelated headings', () => {
		expect(isComparisonSectionHeading('Localização')).toBe(false);
		expect(isComparisonSectionHeading('Sobre o resort')).toBe(false);
	});
});

describe('DEFAULT_COMPARISON_COLUMNS', () => {
	it('uses resort comparison labels', () => {
		expect(DEFAULT_COMPARISON_COLUMNS).toEqual(['Resort', 'Perfil', 'Diferencial']);
	});
});
