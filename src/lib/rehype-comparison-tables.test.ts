import { describe, expect, it } from 'vitest';
import {
	COMPARISON_TABLE_CLASS,
	COMPARISON_TABLE_WRAP_CLASS,
	enrichComparisonTable,
	enrichComparisonTables,
} from './rehype-comparison-tables';
import type { Element, Root } from 'hast';

function createTable(): Element {
	return {
		type: 'element',
		tagName: 'table',
		properties: {},
		children: [
			{
				type: 'element',
				tagName: 'thead',
				properties: {},
				children: [
					{
						type: 'element',
						tagName: 'tr',
						properties: {},
						children: [
							{
								type: 'element',
								tagName: 'th',
								properties: {},
								children: [{ type: 'text', value: 'Resort' }],
							},
							{
								type: 'element',
								tagName: 'th',
								properties: {},
								children: [{ type: 'text', value: 'Perfil' }],
							},
						],
					},
				],
			},
			{
				type: 'element',
				tagName: 'tbody',
				properties: {},
				children: [
					{
						type: 'element',
						tagName: 'tr',
						properties: {},
						children: [
							{
								type: 'element',
								tagName: 'td',
								properties: {},
								children: [{ type: 'text', value: 'Enjoy Olímpia Park Resort' }],
							},
							{
								type: 'element',
								tagName: 'td',
								properties: {},
								children: [{ type: 'text', value: 'Família' }],
							},
						],
					},
				],
			},
		],
	};
}

describe('enrichComparisonTable', () => {
	it('wraps table and adds comparison classes', () => {
		const result = enrichComparisonTable(createTable());

		expect(result.tagName).toBe('div');
		expect(result.properties?.className).toEqual([COMPARISON_TABLE_WRAP_CLASS]);

		const table = result.children[0] as Element;
		expect(table.tagName).toBe('table');
		expect(table.properties?.className).toEqual([COMPARISON_TABLE_CLASS]);
	});

	it('adds data-label attributes from header cells', () => {
		const result = enrichComparisonTable(createTable());
		const table = result.children[0] as Element;
		const tbody = table.children.find((child) => child.type === 'element' && child.tagName === 'tbody') as Element;
		const row = tbody.children[0] as Element;
		const cells = row.children.filter(
			(child): child is Element => child.type === 'element' && child.tagName === 'td',
		);

		expect(cells).toHaveLength(2);
		expect(cells[0]?.properties?.dataLabel).toBe('Resort');
		expect(cells[1]?.properties?.dataLabel).toBe('Perfil');
	});
});

describe('enrichComparisonTables', () => {
	it('transforms tables anywhere in the tree', () => {
		const tree: Root = {
			type: 'root',
			children: [
				{
					type: 'element',
					tagName: 'article',
					properties: {},
					children: [createTable()],
				},
			],
		};

		const result = enrichComparisonTables(tree);
		const article = result.children[0] as Element;
		const wrapper = article.children[0] as Element;

		expect(wrapper.tagName).toBe('div');
		expect(wrapper.properties?.className).toEqual([COMPARISON_TABLE_WRAP_CLASS]);
	});
});
