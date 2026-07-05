/** Estadia mínima em dias (diferença entre entrada e saída). */
export const MIN_STAY_DAYS = 2;

export const MONTH_NAMES = [
	'Janeiro',
	'Fevereiro',
	'Março',
	'Abril',
	'Maio',
	'Junho',
	'Julho',
	'Agosto',
	'Setembro',
	'Outubro',
	'Novembro',
	'Dezembro',
] as const;

export const WEEKDAY_LABELS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'] as const;

export function startOfDay(date: Date): Date {
	const value = new Date(date);
	value.setHours(0, 0, 0, 0);
	return value;
}

export function addDays(date: Date, days: number): Date {
	const value = new Date(date);
	value.setDate(value.getDate() + days);
	return startOfDay(value);
}

/** Primeira data permitida para check-in: amanhã. */
export function getMinCheckInDate(reference = new Date()): Date {
	return addDays(startOfDay(reference), 1);
}

export function parseDateISO(value: string): Date {
	const [year, month, day] = value.split('-').map(Number);
	return startOfDay(new Date(year, month - 1, day));
}

export function formatDateISO(date: Date): string {
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const day = String(date.getDate()).padStart(2, '0');
	return `${year}-${month}-${day}`;
}

export function formatDateDisplay(value: string): string {
	if (!value) return '';
	const date = parseDateISO(value);
	return date.toLocaleDateString('pt-BR');
}

export function daysBetween(start: Date, end: Date): number {
	return Math.round((startOfDay(end).getTime() - startOfDay(start).getTime()) / 86_400_000);
}

export function getMinCheckOutDate(checkIn: Date): Date {
	return addDays(checkIn, MIN_STAY_DAYS);
}

export function isDateBefore(a: Date, b: Date): boolean {
	return startOfDay(a).getTime() < startOfDay(b).getTime();
}

export function isSameDay(a: Date, b: Date): boolean {
	return startOfDay(a).getTime() === startOfDay(b).getTime();
}

export function isDateInRange(date: Date, start: Date, end: Date): boolean {
	const value = startOfDay(date).getTime();
	return value >= startOfDay(start).getTime() && value <= startOfDay(end).getTime();
}
