import { getStoredAttribution } from './utm';
import { bindPhoneMask } from './masks';
import { validateLeadForm } from './validators';
import { trackFormError, trackFormStart, trackFormSuccess } from './tracking';

export interface LeadFormOptions {
	formId: string;
	hotel?: string;
	resort?: string;
	destination?: string;
	campaign?: string;
}

const LEAD_API_PATH = '/api/lead/';

export function initLeadForm(options: LeadFormOptions): void {
	const form = document.getElementById(options.formId) as HTMLFormElement | null;
	if (!form) return;

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
		const values = {
			nome: String(formData.get('nome') ?? ''),
			telefone: String(formData.get('telefone') ?? ''),
			email: String(formData.get('email') ?? ''),
			data_entrada: String(formData.get('data_entrada') ?? ''),
			data_saida: String(formData.get('data_saida') ?? ''),
			adultos: String(formData.get('adultos') ?? ''),
			criancas: String(formData.get('criancas') ?? ''),
		};

		const statusEl = form.querySelector('[data-form-status]');
		const setStatus = (message: string, isError: boolean) => {
			if (statusEl) {
				statusEl.textContent = message;
				statusEl.classList.toggle('text-red-600', isError);
				statusEl.classList.toggle('text-green-600', !isError);
			}
		};

		const validationError = validateLeadForm(values);
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
		const submitBtn = form.querySelector<HTMLButtonElement>('button[type="submit"]');
		if (submitBtn) {
			submitBtn.disabled = true;
			submitBtn.textContent = 'Enviando...';
		}

		try {
			const response = await fetch(LEAD_API_PATH, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Accept: 'application/json',
				},
				body: JSON.stringify({
					...values,
					adultos: Number(values.adultos),
					criancas: Number(values.criancas),
					_hp: honeypot,
					attribution,
					context: {
						hotel: options.hotel,
						resort: options.resort,
						destination: options.destination,
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

			setStatus('Recebemos seu contato! Em breve retornaremos.', false);
			trackFormSuccess(options.formId, {
				landing_page: attribution.landing_page,
				utm_source: attribution.utm_source,
				utm_campaign: attribution.utm_campaign,
			});
			form.reset();
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
