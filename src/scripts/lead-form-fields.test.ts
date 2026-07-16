import { describe, expect, it } from 'vitest';
import { LEAD_PHONE_FIELD_NAME, readLeadContactFromFormData } from './lead-form-fields';

describe('lead form phone field contract', () => {
	it('usa name=phone no HTML do formulário', () => {
		expect(LEAD_PHONE_FIELD_NAME).toBe('phone');
	});

	it('mapeia FormData phone para telefone do schema de lead', () => {
		const formData = new FormData();
		formData.set('nome', 'Maria Silva');
		formData.set('phone', '(11) 98765-4321');
		formData.set('email', 'maria@example.com');

		expect(readLeadContactFromFormData(formData)).toEqual({
			nome: 'Maria Silva',
			telefone: '(11) 98765-4321',
			email: 'maria@example.com',
		});
	});

	it('deixa telefone vazio quando o valor está só em name=telefone', () => {
		const formData = new FormData();
		formData.set('nome', 'Maria Silva');
		formData.set('telefone', '(11) 98765-4321');
		formData.set('email', 'maria@example.com');

		expect(readLeadContactFromFormData(formData).telefone).toBe('');
	});
});
