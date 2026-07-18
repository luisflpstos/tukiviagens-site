import { getStoredAttribution } from "./utm";
import { resolveLeadDestination } from "../lib/lead-destination";
import { saveLeadHandoff } from "../lib/lead-handoff";
import { bindPhoneMask } from "./masks";
import { LEAD_PHONE_FIELD_NAME, readLeadContactFromFormData } from "./lead-form-fields";
import { validateLeadContactForm, validateLeadForm } from "./validators";
import { buildLeadFormSubmitPayload } from "../lib/tracking-payload";
import { trackFormError, trackFormStart, trackFormSubmit } from "./tracking";
import { buildMetaBrowserContext, trackMetaPixelEvent } from "./meta-pixel";

export interface LeadFormOptions {
  formId: string;
  variant?: "full" | "compact";
  hotel?: string;
  resort?: string;
  destination?: string;
  campaign?: string;
}

/**
 * Formulário não chama `/api/lead` nem o webhook n8n.
 * Ingestão: Kortex `lead-tracker.js` (auto-capture no submit).
 */
export const LEAD_FORM_USES_SERVER_API = false;

const THANKS_PAGE_PATH = "/obrigado/";

export function initLeadForm(options: LeadFormOptions): void {
  const form = document.getElementById(
    options.formId,
  ) as HTMLFormElement | null;
  if (!form) return;

  const variant = options.variant ?? "full";
  const phoneInput = form.querySelector<HTMLInputElement>(
    `input[name="${LEAD_PHONE_FIELD_NAME}"]`,
  );
  if (phoneInput) bindPhoneMask(phoneInput);

  let started = false;
  form.addEventListener("focusin", () => {
    if (!started) {
      trackFormStart(options.formId);
      started = true;
    }
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const contact = readLeadContactFromFormData(formData);

    const statusEl = form.querySelector("[data-form-status]");
    const setStatus = (message: string, isError: boolean) => {
      if (statusEl) {
        statusEl.textContent = message;
        statusEl.classList.toggle("text-red-600", isError);
        statusEl.classList.toggle("text-green-600", !isError);
      }
    };

    const validationError =
      variant === "compact"
        ? validateLeadContactForm(contact)
        : validateLeadForm({
            ...contact,
            data_entrada: String(formData.get("data_entrada") ?? ""),
            data_saida: String(formData.get("data_saida") ?? ""),
            adultos: String(formData.get("adultos") ?? ""),
            criancas: String(formData.get("criancas") ?? ""),
          });

    if (validationError) {
      setStatus(validationError, true);
      trackFormError(options.formId, validationError);
      return;
    }

    const honeypot = String(formData.get("_hp") ?? "").trim();
    if (honeypot) {
      setStatus("Recebemos seu contato! Em breve retornaremos.", false);
      form.reset();
      return;
    }

    const attribution = getStoredAttribution();
    const metaContext = buildMetaBrowserContext();
    const submitBtn = form.querySelector<HTMLButtonElement>(
      'button[type="submit"]',
    );
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = "Enviando...";
    }

    try {
      const resolvedDestination =
        options.destination ||
        resolveLeadDestination({ path: window.location.pathname });

      saveLeadHandoff({
        nome: contact.nome,
        hotel: options.hotel,
        resort: options.resort,
        destination: resolvedDestination,
        ...(variant === "full"
          ? {
              data_entrada: String(formData.get("data_entrada") ?? ""),
              data_saida: String(formData.get("data_saida") ?? ""),
              adultos: Number(formData.get("adultos")),
              criancas: Number(formData.get("criancas")),
            }
          : {}),
      });

      trackFormSubmit(
        buildLeadFormSubmitPayload({
          formId: options.formId,
          contact,
          attribution,
          context: {
            h1: document.querySelector("h1")?.textContent?.trim() ?? "",
            pageUrl: window.location.href,
            pageTitle: document.title,
            userAgent: navigator.userAgent,
            referrer: document.referrer || attribution.referrer,
            product: options.hotel || options.resort,
            campaign: options.campaign,
          },
        }),
      );

      trackMetaPixelEvent("Lead", metaContext.event_id, {
        content_name: options.hotel || options.resort || undefined,
      });

      window.location.assign(THANKS_PAGE_PATH);
    } catch {
      setStatus("Não foi possível enviar agora. Tente pelo WhatsApp.", true);
      trackFormError(options.formId, "network");
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = submitBtn.dataset.defaultLabel ?? "Enviar";
      }
    }
  });
}
