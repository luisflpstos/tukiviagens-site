export function maskPhone(value: string): string {
	const digits = value.replace(/\D/g, '').slice(0, 11);

	if (digits.length <= 2) return digits;
	if (digits.length <= 6) return digits.replace(/(\d{2})(\d+)/, '($1) $2');
	if (digits.length <= 10) return digits.replace(/(\d{2})(\d{4})(\d+)/, '($1) $2-$3');
	return digits.replace(/(\d{2})(\d{5})(\d+)/, '($1) $2-$3');
}

export function bindPhoneMask(input: HTMLInputElement): void {
	input.addEventListener('input', () => {
		const cursor = input.selectionStart ?? 0;
		const before = input.value;
		input.value = maskPhone(input.value);
		const diff = input.value.length - before.length;
		input.setSelectionRange(cursor + diff, cursor + diff);
	});
}
