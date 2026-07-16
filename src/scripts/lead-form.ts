import { getStoredAttribution } from './utm';
import { resolveLeadDestination } from '../lib/lead-destination';
import { saveLeadHandoff } from '../lib/lead-handoff';
import { bindPhoneMask } from './masks';
import { validateLeadContactForm, validateLeadForm } from './validators';
import { trackFormError, trackFormStart, trackFormSubmit } from './tracking';
import { buildMetaBrowserContext, trackMetaPixelEvent } from './meta-pixel';

export interface LeadFormOptions {
	formId: string;
	variant?: 'full' | 'compact';
	hotel?: string;
	resort?: string;
	destination?: string;
	campaign?: string;
}

const LEAD_API_PATH = '/api/lead/';
const THANKS_PAGE_PATH = '/obrigado/';

export function initLeadForm(options: LeadFormOptions): void {
	const form = document.getElementById(options.formId) as HTMLFormElement | null;
	if (!form) return;

	const variant = options.variant ?? 'full';
	const phoneInput = form.querySelector<HTMLInputElement>('input[name="telefone"]');
	if (phoneInput) bindPhoneMask(phoneInput);

	let started = false;
	form.addEventListener('focusin', () => {
		if (!started) {
			trackFormStart(options.formId);
			started = true;
		}
	});

	form.addEventListener('submit', async (event) => {
		event.preventDefault();

		const formData = new FormData(form);
		const contact = {
			nome: String(formData.get('nome') ?? ''),
			telefone: String(formData.get('telefone') ?? ''),
			email: String(formData.get('email') ?? ''),
		};

		const statusEl = form.querySelector('[data-form-status]');
		const setStatus = (message: string, isError: boolean) => {
			if (statusEl) {
				statusEl.textContent = message;
				statusEl.classList.toggle('text-red-600', isError);
				statusEl.classList.toggle('text-green-600', !isError);
			}
		};

		const validationError =
			variant === 'compact'
				? validateLeadContactForm(contact)
				: validateLeadForm({
						...contact,
						data_entrada: String(formData.get('data_entrada') ?? ''),
						data_saida: String(formData.get('data_saida') ?? ''),
						adultos: String(formData.get('adultos') ?? ''),
						criancas: String(formData.get('criancas') ?? ''),
					});

		if (validationError) {
			setStatus(validationError, true);
			trackFormError(options.formId, validationError);
			return;
		}

		const honeypot = String(formData.get('_hp') ?? '').trim();
		if (honeypot) {
			setStatus('Recebemos seu contato! Em breve retornaremos.', false);
			form.reset();
			return;
		}

		const attribution = getStoredAttribution();
		const metaContext = buildMetaBrowserContext();
		const submitBtn = form.querySelector<HTMLButtonElement>('button[type="submit"]');
		if (submitBtn) {
			submitBtn.disabled = true;
			submitBtn.textContent = 'Enviando...';
		}

		const stayFields =
			variant === 'full'
				? {
						data_entrada: String(formData.get('data_entrada') ?? ''),
						data_saida: String(formData.get('data_saida') ?? ''),
						adultos: Number(formData.get('adultos')),
						criancas: Number(formData.get('criancas')),
					}
				: {};

		try {
			const response = await fetch(LEAD_API_PATH, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Accept: 'application/json',
				},
				body: JSON.stringify({
					...contact,
					...stayFields,
					_hp: honeypot,
					attribution,
					meta: metaContext,
					context: {
						hotel: options.hotel,
						resort: options.resort,
						destination:
							options.destination ||
							resolveLeadDestination({ path: window.location.pathname }),
						campaign: options.campaign,
						form_id: options.formId,
						landing_slug: window.location.pathname,
						h1: document.querySelector('h1')?.textContent?.trim() ?? '',
						page_url: window.location.href,
						page_title: document.title,
					},
				}),
			});

			const result = (await response.json().catch(() => null)) as { ok?: boolean; error?: string } | null;

			if (!response.ok || !result?.ok) {
				throw new Error(result?.error ?? `HTTP ${response.status}`);
			}

			const resolvedDestination =
				options.destination || resolveLeadDestination({ path: window.location.pathname });

			saveLeadHandoff({
				nome: contact.nome,
				hotel: options.hotel,
				resort: options.resort,
				destination: resolvedDestination,
				...(variant === 'full'
					? {
							data_entrada: String(formData.get('data_entrada') ?? ''),
							data_saida: String(formData.get('data_saida') ?? ''),
							adultos: Number(formData.get('adultos')),
							criancas: Number(formData.get('criancas')),
						}
					: {}),
			});

			trackFormSubmit(options.formId, {
				landing_page: attribution.landing_page,
				utm_source: attribution.utm_source,
				utm_campaign: attribution.utm_campaign,
			});

			// Meta Pixel: mesmo event_id enviado ao servidor (CAPI) para deduplicação.
			trackMetaPixelEvent('Lead', metaContext.event_id, {
				content_name: options.hotel || options.resort || undefined,
			});

			window.location.assign(THANKS_PAGE_PATH);
			return;
		} catch {
			setStatus('Não foi possível enviar agora. Tente pelo WhatsApp.', true);
			trackFormError(options.formId, 'network');
		} finally {
			if (submitBtn) {
				submitBtn.disabled = false;
				submitBtn.textContent = submitBtn.dataset.defaultLabel ?? 'Enviar';
			}
		}
	});
}
