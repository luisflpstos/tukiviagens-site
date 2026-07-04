export const DEFAULT_COMPARISON_COLUMNS = ['Resort', 'Perfil', 'Diferencial'] as const;
export const COMPARISON_TABLE_WRAP_CLASS = 'tuki-comparison-table-wrap';
export const COMPARISON_TABLE_CLASS = 'tuki-comparison-table';

export type ComparisonColumn = (typeof DEFAULT_COMPARISON_COLUMNS)[number];

export interface ComparisonTableRow {
	cells: string[];
	links: Record<number, string>;
}

export interface ParsedComparisonTable {
	columns: string[];
	rows: ComparisonTableRow[];
}

const LINK_PATTERN = /^\[(.+?)\]\((.+?)\)$/;

function parseCell(raw: string): { text: string; href?: string } {
	const trimmed = raw.trim();
	const match = trimmed.match(LINK_PATTERN);

	if (!match) {
		return { text: trimmed };
	}

	return { text: match[1] ?? trimmed, href: match[2] };
}

function parseTableRow(line: string): string[] {
	return line
		.trim()
		.replace(/^\|/, '')
		.replace(/\|$/, '')
		.split('|')
		.map((cell) => cell.trim());
}

function isSeparatorRow(cells: string[]): boolean {
	return cells.every((cell) => /^:?-+:?$/.test(cell));
}

export function parseMarkdownTable(markdown: string): ParsedComparisonTable | null {
	const lines = markdown.split('\n').map((line) => line.trim());
	const tableLines = lines.filter((line) => line.startsWith('|') && line.endsWith('|'));

	if (tableLines.length < 2) {
		return null;
	}

	const headerCells = parseTableRow(tableLines[0] ?? '');
	const separatorCells = parseTableRow(tableLines[1] ?? '');

	if (headerCells.length < 2 || !isSeparatorRow(separatorCells)) {
		return null;
	}

	const bodyLines = tableLines.slice(2);

	if (bodyLines.length === 0) {
		return null;
	}

	const rows: ComparisonTableRow[] = bodyLines.map((line) => {
		const cells = parseTableRow(line);
		const links: Record<number, string> = {};
		const parsedCells = cells.map((cell, index) => {
			const parsed = parseCell(cell);

			if (parsed.href) {
				links[index] = parsed.href;
			}

			return parsed.text;
		});

		return { cells: parsedCells, links };
	});

	return {
		columns: headerCells,
		rows,
	};
}

export function isComparisonSectionHeading(heading: string): boolean {
	return /comparativo/i.test(heading.trim());
}
