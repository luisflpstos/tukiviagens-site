import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const CONTENT_ROOT = join(process.cwd(), 'src/content');

const FORBIDDEN_PATTERNS: RegExp[] = [
	/fonte editorial/i,
	/curadoria editorial/i,
	/segundo a fonte/i,
	/\bsegundo\b/i,
	/segundo o dicas/i,
	/segundo página oficial/i,
	/página oficial descreve/i,
	/página oficial classifica/i,
	/página oficial (informa|mostra|fala)/i,
	/central descreve/i,
	/central (cita|rio quente cita)/i,
	/\bdicas (cita|informa)\b/i,
	/\bbooking (cita|lista|informa|hotéis listou|resorts list)/i,
	/melhores destinos (cita|relata|destaca)/i,
	/quero viajar mais cita/i,
	/viajando com lívia cita/i,
	/thermas & cia descreve/i,
	/fonte cita/i,
	/na fonte\b/i,
	/segundo central/i,
	/segundo melhores destinos/i,
	/segundo quero viajar/i,
	/segundo a thermas/i,
	/referências na curadoria/i,
	/diárias de referência citadas/i,
	/pet friendly segundo/i,
];

function collectMarkdownFiles(dir: string): string[] {
	const entries = readdirSync(dir);
	const files: string[] = [];

	for (const entry of entries) {
		const fullPath = join(dir, entry);
		if (statSync(fullPath).isDirectory()) {
			files.push(...collectMarkdownFiles(fullPath));
			continue;
		}
		if (entry.endsWith('.md')) files.push(fullPath);
	}

	return files;
}

describe('editorial voice in content', () => {
	const files = collectMarkdownFiles(CONTENT_ROOT);

	it('content pages avoid third-party editorial citations', () => {
		const violations: string[] = [];

		for (const file of files) {
			const content = readFileSync(file, 'utf8');
			const relative = file.replace(`${process.cwd()}/`, '');

			for (const pattern of FORBIDDEN_PATTERNS) {
				if (pattern.test(content)) {
					violations.push(`${relative} matches ${pattern}`);
				}
			}
		}

		expect(violations).toEqual([]);
	});
});
