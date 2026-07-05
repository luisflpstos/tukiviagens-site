import { describe, expect, it } from 'vitest';
import {
	MIN_STAY_DAYS,
	addDays,
	daysBetween,
	formatDateISO,
	getMinCheckInDate,
	getMinCheckOutDate,
	parseDateISO,
} from './date-rules';

describe('date-rules', () => {
	const reference = new Date(2026, 6, 5); // 5 jul 2026

	it('define check-in mínimo como amanhã', () => {
		expect(formatDateISO(getMinCheckInDate(reference))).toBe('2026-07-06');
	});

	it('define check-out mínimo com estadia de 2 dias', () => {
		const checkIn = getMinCheckInDate(reference);
		expect(formatDateISO(getMinCheckOutDate(checkIn))).toBe('2026-07-08');
		expect(daysBetween(checkIn, addDays(checkIn, MIN_STAY_DAYS))).toBe(MIN_STAY_DAYS);
	});

	it('calcula diferença entre datas', () => {
		const start = parseDateISO('2026-07-06');
		const end = parseDateISO('2026-07-08');
		expect(daysBetween(start, end)).toBe(2);
	});
});
