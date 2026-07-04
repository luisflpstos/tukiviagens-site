import type { Element, Root } from 'hast';
import { COMPARISON_TABLE_CLASS, COMPARISON_TABLE_WRAP_CLASS } from './comparison-table';

export { COMPARISON_TABLE_CLASS, COMPARISON_TABLE_WRAP_CLASS };

function isElement(node: unknown): node is Element {
	return typeof node === 'object' && node !== null && 'type' in node && node.type === 'element';
}

function getHeaderLabels(table: Element): string[] {
	const thead = table.children.find(
		(child): child is Element => isElement(child) && child.tagName === 'thead',
	);

	if (!thead) {
		return [];
	}

	const headerRow = thead.children.find(
		(child): child is Element => isElement(child) && child.tagName === 'tr',
	);

	if (!headerRow) {
		return [];
	}

	return headerRow.children
		.filter((child): child is Element => isElement(child) && child.tagName === 'th')
		.map((cell) => getTextContent(cell));
}

function getTextContent(node: Element): string {
	return node.children
		.map((child) => {
			if (child.type === 'text') {
				return child.value;
			}

			if (isElement(child)) {
				return getTextContent(child);
			}

			return '';
		})
		.join('')
		.trim();
}

export function enrichComparisonTable(table: Element): Element {
	const labels = getHeaderLabels(table);

	const tbody = table.children.find(
		(child): child is Element => isElement(child) && child.tagName === 'tbody',
	);

	if (tbody && labels.length > 0) {
		for (const row of tbody.children) {
			if (!isElement(row) || row.tagName !== 'tr') {
				continue;
			}

			let cellIndex = 0;

			for (const cell of row.children) {
				if (!isElement(cell) || cell.tagName !== 'td') {
					continue;
				}

				const label = labels[cellIndex];

				if (label) {
					cell.properties = {
						...cell.properties,
						dataLabel: label,
					};
				}

				cellIndex += 1;
			}
		}
	}

	table.properties = {
		...table.properties,
		className: [COMPARISON_TABLE_CLASS],
	};

	return {
		type: 'element',
		tagName: 'div',
		properties: {
			className: [COMPARISON_TABLE_WRAP_CLASS],
		},
		children: [table],
	};
}

export function enrichComparisonTables(tree: Root): Root {
	const visit = (parent: Element | Root) => {
		const children = parent.children ?? [];

		for (let index = 0; index < children.length; index += 1) {
			const child = children[index];

			if (!isElement(child)) {
				continue;
			}

			if (child.tagName === 'table') {
				children[index] = enrichComparisonTable(child);
				continue;
			}

			visit(child);
		}
	};

	visit(tree);
	return tree;
}

export function rehypeComparisonTables() {
	return (tree: Root) => enrichComparisonTables(tree);
}
