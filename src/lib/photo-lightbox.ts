export type SwipeDirection = 'prev' | 'next';

export function wrapIndex(index: number, total: number): number {
	if (total <= 0) return 0;
	return ((index % total) + total) % total;
}

export function getSwipeDirection(deltaX: number, threshold = 50): SwipeDirection | null {
	if (Math.abs(deltaX) < threshold) return null;
	return deltaX > 0 ? 'prev' : 'next';
}

export function isBackdropClick(target: EventTarget | null, backdrop: HTMLElement): boolean {
	return target === backdrop;
}

export function shouldOpenLightbox(target: EventTarget | null): boolean {
	if (!target || typeof (target as HTMLElement).closest !== 'function') return false;
	return (target as HTMLElement).closest('[data-carousel-open-lightbox]') !== null;
}

export function shouldCloseOnLightboxClick(target: EventTarget | null): boolean {
	if (!target || typeof (target as HTMLElement).closest !== 'function') return false;
	const el = target as HTMLElement;
	if (el.closest('img')) return false;
	if (el.closest('[data-lightbox-close]')) return false;
	if (el.closest('[data-lightbox-prev]')) return false;
	if (el.closest('[data-lightbox-next]')) return false;
	return (
		el.closest('[data-lightbox-slide]') !== null ||
		el.closest('[data-lightbox-track]') !== null
	);
}

export function shouldCloseAfterPointerGesture(dragOffset: number, threshold = 50): boolean {
	return Math.abs(dragOffset) < threshold;
}

export function initPhotoLightbox(carousel: HTMLElement): void {
	const lightbox = carousel.querySelector('[data-photo-lightbox]') as HTMLElement | null;
	const track = lightbox?.querySelector('[data-lightbox-track]') as HTMLElement | null;
	const backdrop = lightbox?.querySelector('[data-lightbox-backdrop]') as HTMLElement | null;
	const closeButtons = lightbox?.querySelectorAll('[data-lightbox-close]');
	const prev = lightbox?.querySelector('[data-lightbox-prev]') as HTMLButtonElement | null;
	const next = lightbox?.querySelector('[data-lightbox-next]') as HTMLButtonElement | null;
	const slides = lightbox ? lightbox.querySelectorAll('[data-lightbox-slide]') : [];

	if (!lightbox || !track || !backdrop || slides.length === 0) return;

	let index = 0;
	let isOpen = false;
	let pointerStartX: number | null = null;
	let pointerId: number | null = null;
	let dragOffset = 0;
	let lastGestureDragOffset = 0;
	let previousBodyOverflow = '';

	const total = slides.length;

	const updateTrack = (animate = true) => {
		track.style.transition = animate ? 'transform 300ms ease-out' : 'none';
		const baseOffset = -index * 100;
		track.style.transform = `translateX(calc(${baseOffset}% + ${dragOffset}px))`;
	};

	const goTo = (nextIndex: number, animate = true) => {
		index = wrapIndex(nextIndex, total);
		dragOffset = 0;
		updateTrack(animate);
	};

	const open = (startIndex: number) => {
		index = wrapIndex(startIndex, total);
		dragOffset = 0;
		isOpen = true;
		previousBodyOverflow = document.body.style.overflow;
		document.body.style.overflow = 'hidden';
		lightbox.classList.remove('hidden');
		lightbox.setAttribute('aria-hidden', 'false');
		updateTrack(false);
	};

	const close = () => {
		if (!isOpen) return;
		isOpen = false;
		document.body.style.overflow = previousBodyOverflow;
		lightbox.classList.add('hidden');
		lightbox.setAttribute('aria-hidden', 'true');
		pointerStartX = null;
		pointerId = null;
		dragOffset = 0;
		lastGestureDragOffset = 0;
	};

	const finishDrag = () => {
		if (pointerStartX === null) return;

		lastGestureDragOffset = dragOffset;
		const direction = getSwipeDirection(dragOffset);
		if (direction === 'next') goTo(index + 1);
		else if (direction === 'prev') goTo(index - 1);
		else {
			dragOffset = 0;
			updateTrack();
		}

		pointerStartX = null;
		pointerId = null;
	};

	carousel.addEventListener('click', (event) => {
		const openButton = (event.target as HTMLElement).closest('[data-carousel-open-lightbox]');
		if (!openButton) return;

		const slide = openButton.closest('[data-carousel-slide]');
		const slideIndex = slide ? Number((slide as HTMLElement).dataset.carouselSlide) : 0;
		open(Number.isNaN(slideIndex) ? 0 : slideIndex);
	});

	closeButtons?.forEach((button) => {
		button.addEventListener('click', close);
	});

	backdrop.addEventListener('click', (event) => {
		if (isBackdropClick(event.target, backdrop)) close();
	});

	track.addEventListener('click', (event) => {
		if (!isOpen) return;
		if (!shouldCloseOnLightboxClick(event.target)) return;
		if (!shouldCloseAfterPointerGesture(lastGestureDragOffset)) return;
		close();
	});

	prev?.addEventListener('click', (event) => {
		event.stopPropagation();
		goTo(index - 1);
	});

	next?.addEventListener('click', (event) => {
		event.stopPropagation();
		goTo(index + 1);
	});

	track.addEventListener('pointerdown', (event) => {
		if (!isOpen || event.button !== 0) return;
		lastGestureDragOffset = 0;
		pointerStartX = event.clientX;
		pointerId = event.pointerId;
		track.setPointerCapture(event.pointerId);
		track.style.transition = 'none';
	});

	track.addEventListener('pointermove', (event) => {
		if (!isOpen || pointerStartX === null || event.pointerId !== pointerId) return;
		dragOffset = event.clientX - pointerStartX;
		updateTrack(false);
	});

	const endPointer = (event: PointerEvent) => {
		if (!isOpen || pointerStartX === null || event.pointerId !== pointerId) return;
		if (track.hasPointerCapture(event.pointerId)) {
			track.releasePointerCapture(event.pointerId);
		}
		finishDrag();
	};

	track.addEventListener('pointerup', endPointer);
	track.addEventListener('pointercancel', endPointer);

	document.addEventListener('keydown', (event) => {
		if (!isOpen) return;
		if (event.key === 'Escape') close();
		if (event.key === 'ArrowRight') goTo(index + 1);
		if (event.key === 'ArrowLeft') goTo(index - 1);
	});
}
