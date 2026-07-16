/** Nome do input HTML — mapeado para `telefone` no schema/API de lead. */
export const LEAD_PHONE_FIELD_NAME = 'phone' as const;

export interface LeadContactFormFields {
	nome: string;
	telefone: string;
	email: string;
}

export function readLeadContactFromFormData(formData: FormData): LeadContactFormFields {
	return {
		nome: String(formData.get('nome') ?? ''),
		telefone: String(formData.get(LEAD_PHONE_FIELD_NAME) ?? ''),
		email: String(formData.get('email') ?? ''),
	};
}
