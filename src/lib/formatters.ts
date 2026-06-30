export function formatPhone(phone: string): string {
	const digits = phone.replace(/\D/g, '');
	if (digits.length === 11) {
		return digits.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
	}
	if (digits.length === 10) {
		return digits.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
	}
	return phone;
}

export function formatPrice(value: number): string {
	return new Intl.NumberFormat('pt-BR', {
		style: 'currency',
		currency: 'BRL',
		maximumFractionDigits: 0,
	}).format(value);
}

export function formatDate(date: Date): string {
	return new Intl.DateTimeFormat('pt-BR', {
		day: '2-digit',
		month: 'long',
		year: 'numeric',
	}).format(date);
}

export function formatLocation(cidade: string, estado: string): string {
	return `${cidade}, ${estado}`;
}
