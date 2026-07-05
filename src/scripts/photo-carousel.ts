import { initPhotoLightbox } from '../lib/photo-lightbox';

const VISIBLE_DOTS = 4;
const DOT_STEP_PX = 20 + 6; // h-5 (1.25rem) + gap-1.5 (0.375rem)

const carousels = document.querySelectorAll('[data-photo-carousel]');

carousels.forEach((carousel) => {
	const track = carousel.querySelector('[data-carousel-track]') as HTMLElement | null;
	const slides = carousel.querySelectorAll('[data-carousel-slide]');
	const dots = carousel.querySelectorAll('[data-carousel-dot]');
	const dotsTrack = carousel.querySelector('[data-carousel-dots-track]') as HTMLElement | null;
	const prev = carousel.querySelector('[data-carousel-prev]') as HTMLButtonElement | null;
	const next = carousel.querySelector('[data-carousel-next]') as HTMLButtonElement | null;

	if (!track || slides.length === 0) return;

	const total = slides.length;
	let index = 0;
	let timer: ReturnType<typeof setInterval> | undefined;

	const updateDotsWindow = () => {
		if (!dotsTrack || total <= VISIBLE_DOTS) return;

		const start = Math.max(0, Math.min(index - 1, total - VISIBLE_DOTS));
		dotsTrack.style.transform = `translateX(-${start * DOT_STEP_PX}px)`;
	};

	const goTo = (nextIndex: number) => {
		index = ((nextIndex % total) + total) % total;
		track.style.transform = `translateX(-${index * 100}%)`;

		dots.forEach((dot, dotIndex) => {
			const button = dot as HTMLButtonElement;
			const indicator = button.querySelector('[data-carousel-dot-indicator]');
			const isActive = dotIndex === index;
			indicator?.classList.toggle('bg-tuki-purple', isActive);
			indicator?.classList.toggle('bg-tuki-purple/25', !isActive);
			button.setAttribute('aria-current', isActive ? 'true' : 'false');
		});

		updateDotsWindow();
	};

	const restartTimer = () => {
		if (timer) clearInterval(timer);
		if (total <= 1) return;
		timer = setInterval(() => goTo(index + 1), 6000);
	};

	prev?.addEventListener('click', () => {
		goTo(index - 1);
		restartTimer();
	});

	next?.addEventListener('click', () => {
		goTo(index + 1);
		restartTimer();
	});

	dots.forEach((dot) => {
		dot.addEventListener('click', () => {
			const target = Number((dot as HTMLElement).dataset.carouselDot);
			if (!Number.isNaN(target)) {
				goTo(target);
				restartTimer();
			}
		});
	});

	carousel.addEventListener('mouseenter', () => {
		if (timer) clearInterval(timer);
	});

	carousel.addEventListener('mouseleave', restartTimer);

	initPhotoLightbox(carousel);

	goTo(0);
	restartTimer();
});
