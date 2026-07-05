import { r as __exportAll } from "./rolldown-runtime_DWOOXAbm.mjs";
import { z } from "zod";
//#endregion
//#region src/lib/lead-security.ts
var LOCAL_ORIGINS = /* @__PURE__ */ new Set(["http://localhost:4321", "http://127.0.0.1:4321"]);
function isAllowedOrigin(request) {
	const origin = request.headers.get("origin");
	if (!origin) return true;
	if (LOCAL_ORIGINS.has(origin)) return true;
	const siteUrl = "https://seudominio.com.br";
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
//#region src/lib/lead-schema.ts
var dateString = z.string().trim().max(120).regex(/^\d{4}-\d{2}-\d{2}$/, "Data inválida.");
function parseDateOnly(value) {
	const [year, month, day] = value.split("-").map(Number);
	return new Date(year, month - 1, day);
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
var leadContextSchema = z.object({
	hotel: z.string().max(120).optional(),
	resort: z.string().max(120).optional(),
	destination: z.string().max(120).optional(),
	campaign: z.string().max(120).optional(),
	form_id: z.string().max(120).optional(),
	landing_slug: z.string().max(120).optional()
}).strict();
var leadFormFieldsSchema = z.object({
	nome: z.string().trim().min(2, "Informe seu nome completo.").max(120, "Nome muito longo."),
	telefone: z.string().trim().min(1, "Informe seu telefone (WhatsApp).").max(120, "Telefone muito longo.").refine((value) => phoneDigits(value).length >= 10, "Informe um telefone válido com DDD."),
	email: z.string().trim().min(1, "Informe seu e-mail.").max(120, "E-mail muito longo.").email("Informe um e-mail válido."),
	data_entrada: dateString,
	data_saida: dateString,
	adultos: z.coerce.number({ error: "Informe a quantidade de adultos." }).int("Informe a quantidade de adultos.").min(1, "Informe pelo menos 1 adulto.").max(120, "Quantidade de adultos inválida."),
	criancas: z.coerce.number({ error: "Informe a quantidade de crianças." }).int("Informe a quantidade de crianças.").min(0, "Quantidade de crianças inválida.").max(120, "Quantidade de crianças inválida.")
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
	const today = /* @__PURE__ */ new Date();
	today.setHours(0, 0, 0, 0);
	if (!Number.isNaN(entrada.getTime()) && entrada < today) ctx.addIssue({
		code: "custom",
		message: "A data de entrada não pode ser no passado.",
		path: ["data_entrada"]
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
	console.error("[lead] LEAD_WEBHOOK_URL não configurada.");
	return jsonResponse({
		ok: false,
		error: "Serviço temporariamente indisponível."
	}, 503);
};
//#endregion
//#region \0virtual:astro:page:src/pages/api/lead@_@ts
var page = () => lead_exports;
//#endregion
export { page };
