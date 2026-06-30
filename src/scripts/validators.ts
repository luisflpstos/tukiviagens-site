export function validateName(name: string): string | null {
	const trimmed = name.trim();
	if (trimmed.length < 2) return 'Informe seu nome completo.';
	return null;
}

export function validatePhone(phone: string): string | null {
	const digits = phone.replace(/\D/g, '');
	if (digits.length < 10) return 'Informe um telefone válido com DDD.';
	return null;
}

export function validateEmail(email: string): string | null {
	if (!email.trim()) return null;
	const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	if (!pattern.test(email)) return 'Informe um e-mail válido.';
	return null;
}
