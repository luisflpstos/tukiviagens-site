import { describe, expect, it } from 'vitest';
import {
	getSwipeDirection,
	isBackdropClick,
	shouldOpenLightbox,
	wrapIndex,
} from './photo-lightbox';

describe('wrapIndex', () => {
	it('wraps forward past the last slide', () => {
		expect(wrapIndex(3, 3)).toBe(0);
	});

	it('wraps backward before the first slide', () => {
		expect(wrapIndex(-1, 3)).toBe(2);
	});

	it('returns 0 when total is zero', () => {
		expect(wrapIndex(5, 0)).toBe(0);
	});
});

describe('getSwipeDirection', () => {
	it('returns next when swiping left', () => {
		expect(getSwipeDirection(-80)).toBe('next');
	});

	it('returns prev when swiping right', () => {
		expect(getSwipeDirection(80)).toBe('prev');
	});

	it('returns null when movement is below threshold', () => {
		expect(getSwipeDirection(20)).toBeNull();
		expect(getSwipeDirection(-20)).toBeNull();
	});
});

describe('isBackdropClick', () => {
	it('returns true when clicking the backdrop itself', () => {
		const backdrop = {} as HTMLElement;
		expect(isBackdropClick(backdrop, backdrop)).toBe(true);
	});

	it('returns false when clicking a child element', () => {
		const backdrop = {} as HTMLElement;
		const child = {} as HTMLElement;
		expect(isBackdropClick(child, backdrop)).toBe(false);
	});
});

describe('shouldOpenLightbox', () => {
	it('returns true for carousel image open buttons', () => {
		const button = {
			closest: (selector: string) => (selector === '[data-carousel-open-lightbox]' ? button : null),
		};
		expect(shouldOpenLightbox(button as unknown as EventTarget)).toBe(true);
	});

	it('returns false for other elements', () => {
		const button = { closest: () => null };
		expect(shouldOpenLightbox(button as unknown as EventTarget)).toBe(false);
	});

	it('returns false for null', () => {
		expect(shouldOpenLightbox(null)).toBe(false);
	});
});
