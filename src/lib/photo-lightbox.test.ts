import { describe, expect, it } from 'vitest';
import {
	getSwipeDirection,
	isBackdropClick,
	shouldCloseAfterPointerGesture,
	shouldCloseOnLightboxClick,
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

function mockClosest(matches: Record<string, unknown>) {
	return {
		closest: (selector: string) => matches[selector] ?? null,
	};
}

describe('shouldCloseOnLightboxClick', () => {
	it('returns true when clicking empty track/slide/figure area', () => {
		const figure = mockClosest({
			'[data-lightbox-slide]': {},
			'[data-lightbox-track]': {},
		});
		expect(shouldCloseOnLightboxClick(figure as unknown as EventTarget)).toBe(true);
	});

	it('returns false when clicking the photo img', () => {
		const img = {
			tagName: 'IMG',
			closest: (selector: string) => {
				if (selector === 'img') return img;
				if (selector === '[data-lightbox-slide]') return {};
				return null;
			},
		};
		expect(shouldCloseOnLightboxClick(img as unknown as EventTarget)).toBe(false);
	});

	it('returns false when clicking close control', () => {
		const close = mockClosest({
			'[data-lightbox-close]': {},
		});
		expect(shouldCloseOnLightboxClick(close as unknown as EventTarget)).toBe(false);
	});

	it('returns false when clicking prev control', () => {
		const prev = mockClosest({
			'[data-lightbox-prev]': {},
		});
		expect(shouldCloseOnLightboxClick(prev as unknown as EventTarget)).toBe(false);
	});

	it('returns false when clicking next control', () => {
		const next = mockClosest({
			'[data-lightbox-next]': {},
		});
		expect(shouldCloseOnLightboxClick(next as unknown as EventTarget)).toBe(false);
	});

	it('returns false for null', () => {
		expect(shouldCloseOnLightboxClick(null)).toBe(false);
	});
});

describe('shouldCloseAfterPointerGesture', () => {
	it('returns true when drag is below swipe threshold', () => {
		expect(shouldCloseAfterPointerGesture(20)).toBe(true);
		expect(shouldCloseAfterPointerGesture(-20)).toBe(true);
		expect(shouldCloseAfterPointerGesture(0)).toBe(true);
	});

	it('returns false when drag meets or exceeds swipe threshold', () => {
		expect(shouldCloseAfterPointerGesture(50)).toBe(false);
		expect(shouldCloseAfterPointerGesture(-50)).toBe(false);
		expect(shouldCloseAfterPointerGesture(80)).toBe(false);
		expect(shouldCloseAfterPointerGesture(-80)).toBe(false);
	});

	it('uses custom threshold when provided', () => {
		expect(shouldCloseAfterPointerGesture(30, 40)).toBe(true);
		expect(shouldCloseAfterPointerGesture(40, 40)).toBe(false);
	});
});
