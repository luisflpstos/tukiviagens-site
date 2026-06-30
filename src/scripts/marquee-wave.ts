import { getMarqueeWaveOffsetPx } from '../lib/wave-math';

function readWaveHeightPx(): number {
	const raw = getComputedStyle(document.documentElement).getPropertyValue('--tuki-wave-height').trim();
	if (!raw) return 48;

	const probe = document.createElement('div');
	probe.style.height = raw;
	probe.style.position = 'absolute';
	probe.style.visibility = 'hidden';
	document.body.appendChild(probe);
	const height = probe.getBoundingClientRect().height;
	probe.remove();
	return height || 48;
}

export function initMarqueeWave() {
	const marquee = document.querySelector<HTMLElement>('[data-tuki-marquee]');
	const trackWrap = marquee?.querySelector<HTMLElement>('.tuki-marquee-track-wrap');
	const items = marquee?.querySelectorAll<HTMLElement>('.tuki-ticker-item');

	if (!marquee || !trackWrap || !items?.length) return;

	let waveHeightPx = readWaveHeightPx();
	let frame = 0;

	const update = () => {
		const wrapRect = trackWrap.getBoundingClientRect();
		if (!wrapRect.width) {
			frame = requestAnimationFrame(update);
			return;
		}

		for (const item of items) {
			const rect = item.getBoundingClientRect();
			const centerX = rect.left + rect.width / 2 - wrapRect.left;
			const waveX = (centerX / wrapRect.width) * 1440;
			const offsetPx = getMarqueeWaveOffsetPx(waveX, waveHeightPx);
			item.style.setProperty('--tuki-icon-wave-y', `${offsetPx.toFixed(2)}px`);
		}

		frame = requestAnimationFrame(update);
	};

	const onResize = () => {
		waveHeightPx = readWaveHeightPx();
	};

	frame = requestAnimationFrame(update);
	window.addEventListener('resize', onResize, { passive: true });

	return () => {
		cancelAnimationFrame(frame);
		window.removeEventListener('resize', onResize);
		for (const item of items) {
			item.style.removeProperty('--tuki-icon-wave-y');
		}
	};
}
