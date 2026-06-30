import { fillHiddenTrackingFields, getStoredAttribution } from './utm';
import { bindPhoneMask } from './masks';
import { validateName, validatePhone } from './validators';
import { trackFormError, trackFormStart, trackFormSuccess } from './tracking';

export interface LeadFormOptions {
	formId: string;
	webhookUrl?: string;
	hotel?: string;
	resort?: string;
	destination?: string;
	campaign?: string;
}

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
		fillHiddenTrackingFields(form);

		const formData = new FormData(form);
		const nome = String(formData.get('nome') ?? '');
		const telefone = String(formData.get('telefone') ?? '');

		const nameError = validateName(nome);
		const phoneError = validatePhone(telefone);

		const statusEl = form.querySelector('[data-form-status]');
		const setStatus = (message: string, isError: boolean) => {
			if (statusEl) {
				statusEl.textContent = message;
				statusEl.classList.toggle('text-red-600', isError);
				statusEl.classList.toggle('text-green-600', !isError);
			}
		};

		if (nameError || phoneError) {
			setStatus(nameError ?? phoneError ?? 'Verifique os campos.', true);
			trackFormError(options.formId, nameError ?? phoneError ?? 'validation');
			return;
		}

		const payload = Object.fromEntries(formData.entries());
		const attribution = getStoredAttribution();
		const webhookUrl = options.webhookUrl || import.meta.env.PUBLIC_LEAD_WEBHOOK_URL;

		const submitBtn = form.querySelector<HTMLButtonElement>('button[type="submit"]');
		if (submitBtn) {
			submitBtn.disabled = true;
			submitBtn.textContent = 'Enviando...';
		}

		try {
			if (webhookUrl) {
				const response = await fetch(webhookUrl, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						...payload,
						...attribution,
						hotel: options.hotel,
						resort: options.resort,
						destination: options.destination,
						campaign: options.campaign,
						form_id: options.formId,
						submitted_at: new Date().toISOString(),
					}),
				});

				if (!response.ok) throw new Error(`HTTP ${response.status}`);
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
