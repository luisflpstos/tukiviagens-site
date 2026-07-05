import { r as __exportAll } from "./rolldown-runtime_DWOOXAbm.mjs";
import { z } from "zod";
//#region src/lib/lead-config.ts
function getLeadWebhookUrl() {
	return "https://flow-webhook-prd.kortex.app.br/webhook/olimtour/campanhas";
}
function getLeadWebhookSecret() {
	return "d11bddcb337963161e5d40ede1742b141d70950fdc0699903e2d91a124d958f1";
}
//#endregion
//#region src/lib/lead-geo.ts
/** Captura dados geográficos a partir dos headers da Vercel (somente servidor). */
function extractGeoFromRequest(request) {
	const get = (name) => request.headers.get(name)?.trim() || null;
	const cidade = get("x-vercel-ip-city");
	const regiao = get("x-vercel-ip-country-region");
	const pais = get("x-vercel-ip-country");
	const latitude = get("x-vercel-ip-latitude");
	const longitude = get("x-vercel-ip-longitude");
	return {
		cidade,
		regiao,
		pais,
		cep: regiao && cidade ? `${regiao}-${cidade}` : regiao,
		latitude,
		longitude
	};
}
//#endregion
//#region src/lib/lead-security.ts
var LOCAL_ORIGINS = /* @__PURE__ */ new Set(["http://localhost:4321", "http://127.0.0.1:4321"]);
function isAllowedOrigin(request) {
	const origin = request.headers.get("origin");
	if (!origin) return true;
	if (LOCAL_ORIGINS.has(origin)) return true;
	const siteUrl = "http://localhost:4321";
	try {
		return new URL(origin).origin === new URL(siteUrl).origin;
	} catch {
		return false;
	}
}
function jsonResponse(body, status = 200) {
	return new Response(JSON.stringify(body), {
		status,
		headers: {
			"Content-Type": "application/json",
			"Cache-Control": "no-store",
			"X-Content-Type-Options": "nosniff"
		}
	});
}
//#endregion
//#region src/lib/date-rules.ts
function startOfDay(date) {
	const value = new Date(date);
	value.setHours(0, 0, 0, 0);
	return value;
}
function addDays(date, days) {
	const value = new Date(date);
	value.setDate(value.getDate() + days);
	return startOfDay(value);
}
/** Primeira data permitida para check-in: amanhã. */
function getMinCheckInDate(reference = /* @__PURE__ */ new Date()) {
	return addDays(startOfDay(reference), 1);
}
function parseDateISO(value) {
	const [year, month, day] = value.split("-").map(Number);
	return startOfDay(new Date(year, month - 1, day));
}
function daysBetween(start, end) {
	return Math.round((startOfDay(end).getTime() - startOfDay(start).getTime()) / 864e5);
}
//#endregion
//#region src/lib/lead-schema.ts
var dateString = z.string().trim().max(120).regex(/^\d{4}-\d{2}-\d{2}$/, "Data inválida.");
function parseDateOnly(value) {
	return parseDateISO(value);
}
function phoneDigits(phone) {
	return phone.replace(/\D/g, "");
}
var leadAttributionSchema = z.object({
	utm_source: z.string().max(120).optional(),
	utm_medium: z.string().max(120).optional(),
	utm_campaign: z.string().max(120).optional(),
	utm_content: z.string().max(120).optional(),
	utm_term: z.string().max(120).optional(),
	gclid: z.string().max(120).optional(),
	gbraid: z.string().max(120).optional(),
	wbraid: z.string().max(120).optional(),
	fbclid: z.string().max(120).optional(),
	msclkid: z.string().max(120).optional(),
	referrer: z.string().max(120).optional(),
	landing_page: z.string().max(120).optional(),
	first_landing_page: z.string().max(120).optional(),
	current_url: z.string().max(120).optional(),
	timestamp: z.string().max(120).optional()
}).strict();
var pageUrlString = z.string().max(2048);
var pageMetaString = z.string().max(512);
var leadContextSchema = z.object({
	hotel: z.string().max(120).optional(),
	resort: z.string().max(120).optional(),
	destination: z.string().max(120).optional(),
	campaign: z.string().max(120).optional(),
	form_id: z.string().max(120).optional(),
	landing_slug: z.string().max(120).optional(),
	h1: pageMetaString.optional(),
	page_url: pageUrlString.optional(),
	page_title: pageMetaString.optional()
}).strict();
var leadFormFieldsSchema = z.object({
	nome: z.string().trim().min(2, "Informe seu nome completo.").max(120, "Nome muito longo."),
	telefone: z.string().trim().min(1, "Informe seu telefone (WhatsApp).").max(120, "Telefone muito longo.").refine((value) => phoneDigits(value).length >= 10, "Informe um telefone válido com DDD."),
	email: z.string().trim().min(1, "Informe seu e-mail.").max(120, "E-mail muito longo.").email("Informe um e-mail válido."),
	data_entrada: dateString,
	data_saida: dateString,
	adultos: z.coerce.number({ error: "Informe a quantidade de adultos." }).int("Informe a quantidade de adultos.").min(1, "Informe pelo menos 1 adulto.").max(7, `Máximo de 7 adultos.`),
	criancas: z.coerce.number({ error: "Informe a quantidade de crianças." }).int("Informe a quantidade de crianças.").min(0, "Quantidade de crianças inválida.").max(4, `Máximo de 4 crianças.`)
}).superRefine((data, ctx) => {
	const entrada = parseDateOnly(data.data_entrada);
	const saida = parseDateOnly(data.data_saida);
	if (Number.isNaN(entrada.getTime())) ctx.addIssue({
		code: "custom",
		message: "Data de entrada inválida.",
		path: ["data_entrada"]
	});
	if (Number.isNaN(saida.getTime())) ctx.addIssue({
		code: "custom",
		message: "Data de saída inválida.",
		path: ["data_saida"]
	});
	if (!Number.isNaN(entrada.getTime()) && !Number.isNaN(saida.getTime()) && saida <= entrada) ctx.addIssue({
		code: "custom",
		message: "A data de saída deve ser posterior à data de entrada.",
		path: ["data_saida"]
	});
	const minCheckIn = getMinCheckInDate();
	if (!Number.isNaN(entrada.getTime()) && entrada < minCheckIn) ctx.addIssue({
		code: "custom",
		message: "A data de entrada deve ser a partir de amanhã.",
		path: ["data_entrada"]
	});
	if (!Number.isNaN(entrada.getTime()) && !Number.isNaN(saida.getTime()) && daysBetween(entrada, saida) < 2) ctx.addIssue({
		code: "custom",
		message: `Selecione no mínimo 2 dias de hospedagem.`,
		path: ["data_saida"]
	});
});
var leadSubmissionSchema = z.object({
	nome: z.string(),
	telefone: z.string(),
	email: z.string(),
	data_entrada: z.string(),
	data_saida: z.string(),
	adultos: z.union([z.string(), z.number()]),
	criancas: z.union([z.string(), z.number()]),
	_hp: z.string().max(120).optional(),
	attribution: leadAttributionSchema.optional(),
	context: leadContextSchema.optional()
}).strict();
function firstZodError(error) {
	return error.issues[0]?.message ?? "Verifique os campos do formulário.";
}
//#endregion
//#region src/lib/lead-destination.ts
/** Nome comercial do destino por silo ou slug de URL. */
var SILO_DESTINATION_NAMES = {
	olimpia: "Olímpia",
	"rio-quente": "Rio Quente",
	nordeste: "Nordeste",
	gramado: "Gramado",
	"rio-de-janeiro": "Rio de Janeiro"
};
function resolveLeadDestination(options) {
	const cidade = options.cidade?.trim();
	if (cidade) return cidade;
	const silo = options.silo?.trim();
	if (silo && SILO_DESTINATION_NAMES[silo]) return SILO_DESTINATION_NAMES[silo];
	const firstSegment = options.path?.split("/").filter(Boolean)[0];
	if (firstSegment && SILO_DESTINATION_NAMES[firstSegment]) return SILO_DESTINATION_NAMES[firstSegment];
	return options.fallback?.trim() || void 0;
}
//#endregion
//#region src/lib/tracking-payload.ts
function formatLocalTimestamp(date, timeZone = "America/Sao_Paulo") {
	const parts = new Intl.DateTimeFormat("pt-BR", {
		timeZone,
		day: "2-digit",
		month: "2-digit",
		year: "numeric",
		hour: "2-digit",
		minute: "2-digit",
		second: "2-digit",
		hour12: false
	}).formatToParts(date);
	const get = (type) => parts.find((part) => part.type === type)?.value ?? "";
	return `${get("day")}/${get("month")}/${get("year")} ${get("hour")}:${get("minute")}:${get("second")}`;
}
function empty(value) {
	return value ?? "";
}
function buildTrackingFields(attribution = {}) {
	const utmSource = empty(attribution.utm_source);
	return {
		source: utmSource || "direct",
		utm_source: utmSource,
		utm_medium: empty(attribution.utm_medium),
		utm_campaign: empty(attribution.utm_campaign),
		utm_content: empty(attribution.utm_content),
		utm_term: empty(attribution.utm_term),
		gclid: empty(attribution.gclid),
		gbraid: empty(attribution.gbraid),
		wbraid: empty(attribution.wbraid),
		fbclid: empty(attribution.fbclid)
	};
}
function buildLeadSubmitPayload({ fields, attribution = {}, context = {}, geo, submittedAt = /* @__PURE__ */ new Date(), userAgent, referrer }) {
	const tracking = buildTrackingFields(attribution);
	const product = empty(context.hotel) || empty(context.resort) || void 0;
	const destination = resolveLeadDestination({
		cidade: context.destination,
		path: context.landing_slug
	}) || void 0;
	return {
		event: "lead_submit",
		...tracking,
		h1: empty(context.h1),
		page_url: empty(context.page_url) || empty(attribution.current_url),
		page_title: empty(context.page_title),
		referrer: empty(referrer) || empty(attribution.referrer),
		horario_local: formatLocalTimestamp(submittedAt),
		timestamp_iso: submittedAt.toISOString(),
		user_agent: empty(userAgent),
		nome: fields.nome,
		telefone: fields.telefone,
		email: fields.email,
		data_entrada: fields.data_entrada,
		data_saida: fields.data_saida,
		adultos: fields.adultos,
		criancas: fields.criancas,
		...product ? { product } : {},
		...context.campaign ? { campaign: context.campaign } : {},
		...context.form_id ? { form_id: context.form_id } : {},
		...destination ? { destination } : {},
		...geo?.cidade ? { cidade: geo.cidade } : {},
		...geo?.regiao ? { regiao: geo.regiao } : {},
		...geo?.pais ? { pais: geo.pais } : {},
		...geo?.cep ? { cep: geo.cep } : {}
	};
}
//#endregion
//#region src/pages/api/lead.ts
var lead_exports = /* @__PURE__ */ __exportAll({
	POST: () => POST,
	prerender: () => false
});
var MAX_BODY_BYTES = 16384;
var POST = async ({ request }) => {
	if (request.method !== "POST") return jsonResponse({
		ok: false,
		error: "Método não permitido."
	}, 405);
	if (!isAllowedOrigin(request)) return jsonResponse({
		ok: false,
		error: "Origem não permitida."
	}, 403);
	if (!(request.headers.get("content-type") ?? "").includes("application/json")) return jsonResponse({
		ok: false,
		error: "Formato inválido."
	}, 415);
	const rawBody = await request.text();
	if (rawBody.length > MAX_BODY_BYTES) return jsonResponse({
		ok: false,
		error: "Requisição muito grande."
	}, 413);
	let parsed;
	try {
		parsed = JSON.parse(rawBody);
	} catch {
		return jsonResponse({
			ok: false,
			error: "JSON inválido."
		}, 400);
	}
	const envelope = leadSubmissionSchema.safeParse(parsed);
	if (!envelope.success) return jsonResponse({
		ok: false,
		error: firstZodError(envelope.error)
	}, 400);
	if (envelope.data._hp?.trim()) return jsonResponse({ ok: true });
	const fields = leadFormFieldsSchema.safeParse(envelope.data);
	if (!fields.success) return jsonResponse({
		ok: false,
		error: firstZodError(fields.error)
	}, 400);
	const webhookUrl = getLeadWebhookUrl();
	if (!webhookUrl) {
		console.error("[lead] LEAD_WEBHOOK_URL não configurada.");
		return jsonResponse({
			ok: false,
			error: "Serviço temporariamente indisponível."
		}, 503);
	}
	const geo = extractGeoFromRequest(request);
	const submittedAt = /* @__PURE__ */ new Date();
	const payload = buildLeadSubmitPayload({
		fields: fields.data,
		attribution: envelope.data.attribution,
		context: envelope.data.context,
		geo,
		submittedAt,
		userAgent: request.headers.get("user-agent"),
		referrer: request.headers.get("referer")
	});
	const headers = {
		"Content-Type": "application/json",
		"User-Agent": "TukiViagens-LeadProxy/1.0"
	};
	const secret = getLeadWebhookSecret();
	if (secret) headers.Authorization = `Bearer ${secret}`;
	try {
		const upstream = await fetch(webhookUrl, {
			method: "POST",
			headers,
			body: JSON.stringify(payload),
			signal: AbortSignal.timeout(12e3)
		});
		if (!upstream.ok) {
			console.error("[lead] Webhook respondeu com status", upstream.status);
			return jsonResponse({
				ok: false,
				error: "Não foi possível enviar agora."
			}, 502);
		}
	} catch (error) {
		console.error("[lead] Falha ao encaminhar lead:", error);
		return jsonResponse({
			ok: false,
			error: "Não foi possível enviar agora."
		}, 502);
	}
	return jsonResponse({ ok: true });
};
//#endregion
//#region \0virtual:astro:page:src/pages/api/lead@_@ts
var page = () => lead_exports;
//#endregion
export { page };
