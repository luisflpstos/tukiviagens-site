#!/usr/bin/env node
/**
 * Consulta a Dataset Quality API da Meta e exibe métricas de qualidade
 * da integração (EMQ — Event Match Quality, cobertura de match keys,
 * deduplicação e diagnósticos).
 *
 * Uso:
 *   pnpm meta:quality                 # usa PUBLIC_META_PIXEL_ID do .env
 *   pnpm meta:quality -- <dataset_id> # consulta um dataset específico
 *
 * Requer META_CAPI_TOKEN no .env (token com permissão read_ads_dataset_quality).
 */
import 'dotenv/config';

const GRAPH_VERSION = 'v25.0';

const token = process.env.META_CAPI_TOKEN;
const datasetId = process.argv[2] || process.env.PUBLIC_META_PIXEL_ID;

if (!token || !datasetId) {
	console.error(
		'Configure META_CAPI_TOKEN e PUBLIC_META_PIXEL_ID no .env (ou passe o dataset_id como argumento).',
	);
	process.exit(1);
}

const fields = [
	'web{event_name,event_match_quality{composite_score,match_key_feedback{identifier,coverage{percentage}},diagnostics{name,description,solution,percentage}}}',
].join(',');

const url = new URL(`https://graph.facebook.com/${GRAPH_VERSION}/dataset_quality`);
url.searchParams.set('dataset_id', datasetId);
url.searchParams.set('access_token', token);
url.searchParams.set('fields', fields);

const response = await fetch(url);
const payload = await response.json();

if (payload.error) {
	console.error('Erro da API:', payload.error.message);
	process.exit(1);
}

const events = payload.web ?? [];

console.log(`Dataset ${datasetId} — qualidade dos eventos web\n`);

if (events.length === 0) {
	console.log(
		'Nenhum dado de qualidade disponível ainda. As métricas aparecem depois que a CAPI começa a receber eventos (pode levar até 48h).',
	);
	process.exit(0);
}

for (const item of events) {
	const emq = item.event_match_quality ?? {};
	console.log(`Evento: ${item.event_name}`);
	console.log(`  EMQ (score composto): ${emq.composite_score ?? 'n/d'} / 10`);

	for (const key of emq.match_key_feedback ?? []) {
		const pct = key.coverage?.percentage;
		console.log(`  - ${key.identifier}: cobertura ${pct != null ? `${pct}%` : 'n/d'}`);
	}

	for (const diag of emq.diagnostics ?? []) {
		console.log(`  ⚠ ${diag.name} (${diag.percentage ?? '?'}% dos eventos)`);
		if (diag.solution) console.log(`    Solução: ${diag.solution}`);
	}

	console.log('');
}
