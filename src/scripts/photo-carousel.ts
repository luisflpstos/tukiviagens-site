const carousels = document.querySelectorAll('[data-photo-carousel]');

carousels.forEach((carousel) => {
	const track = carousel.querySelector('[data-carousel-track]') as HTMLElement | null;
	const dots = carousel.querySelectorAll('[data-carousel-dot]');
	const prev = carousel.querySelector('[data-carousel-prev]') as HTMLButtonElement | null;
	const next = carousel.querySelector('[data-carousel-next]') as HTMLButtonElement | null;

	if (!track || dots.length === 0) return;

	let index = 0;
	let timer: ReturnType<typeof setInterval> | undefined;

	const goTo = (nextIndex: number) => {
		index = (nextIndex + dots.length) % dots.length;
		track.style.transform = `translateX(-${index * 100}%)`;

		dots.forEach((dot, dotIndex) => {
			const button = dot as HTMLButtonElement;
			const isActive = dotIndex === index;
			button.classList.toggle('bg-tuki-purple', isActive);
			button.classList.toggle('bg-tuki-purple/25', !isActive);
			button.setAttribute('aria-current', isActive ? 'true' : 'false');
		});
	};

	const restartTimer = () => {
		if (timer) clearInterval(timer);
		if (dots.length <= 1) return;
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

	goTo(0);
	restartTimer();
});
