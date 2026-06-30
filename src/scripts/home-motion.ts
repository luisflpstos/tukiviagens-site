function prefersReducedMotion() {
	return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function initScrollReveals() {
	const groups = document.querySelectorAll<HTMLElement>('[data-tuki-reveal]');
	if (!groups.length) return;

	const reveal = (target: Element) => {
		target.classList.add('is-revealed');
	};

	const observer = new IntersectionObserver(
		(entries) => {
			for (const entry of entries) {
				if (!entry.isIntersecting) continue;
				reveal(entry.target);
				observer.unobserve(entry.target);
			}
		},
		{ threshold: 0.08, rootMargin: '0px 0px -2% 0px' },
	);

	for (const group of groups) {
		const rect = group.getBoundingClientRect();
		const inView = rect.top < window.innerHeight * 0.92 && rect.bottom > 0;
		const delay = inView ? Math.max(0, 700 - rect.top * 0.15) : 0;

		if (inView) {
			window.setTimeout(() => reveal(group), delay);
		} else {
			observer.observe(group);
		}
	}
}

export function initHomeMotion() {
	document.documentElement.classList.add('tuki-motion-ready');
	if (prefersReducedMotion()) {
		document.documentElement.classList.add('tuki-reduced-motion');
	}
	initScrollReveals();
}

if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', initHomeMotion, { once: true });
} else {
	initHomeMotion();
}
