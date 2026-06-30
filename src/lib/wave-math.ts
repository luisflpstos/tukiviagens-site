const WAVE_WIDTH = 1440;
const WAVE_MID_Y = 40;
const ICON_WAVE_STRENGTH = 2.8;

type WavePoint = { x: number; y: number };

const MARQUEE_WAVE_SEGMENTS: Array<{ p0: WavePoint; p1: WavePoint; p2: WavePoint; p3: WavePoint }> = [
	{ p0: { x: 0, y: 40 }, p1: { x: 240, y: 72 }, p2: { x: 480, y: 8 }, p3: { x: 720, y: 32 } },
	{ p0: { x: 720, y: 32 }, p1: { x: 960, y: 56 }, p2: { x: 1200, y: 64 }, p3: { x: 1440, y: 48 } },
];

function cubicPoint(t: number, p0: WavePoint, p1: WavePoint, p2: WavePoint, p3: WavePoint): WavePoint {
	const u = 1 - t;
	return {
		x: u ** 3 * p0.x + 3 * u ** 2 * t * p1.x + 3 * u * t ** 2 * p2.x + t ** 3 * p3.x,
		y: u ** 3 * p0.y + 3 * u ** 2 * t * p1.y + 3 * u * t ** 2 * p2.y + t ** 3 * p3.y,
	};
}

/** Y da borda ondulada (viewBox 0–1440 × 0–64) para uma posição horizontal. */
export function getMarqueeWaveY(x: number): number {
	const wrapped = ((x % WAVE_WIDTH) + WAVE_WIDTH) % WAVE_WIDTH;

	for (const segment of MARQUEE_WAVE_SEGMENTS) {
		if (wrapped < segment.p0.x || wrapped > segment.p3.x) continue;

		let lo = 0;
		let hi = 1;

		for (let i = 0; i < 24; i++) {
			const mid = (lo + hi) / 2;
			const point = cubicPoint(mid, segment.p0, segment.p1, segment.p2, segment.p3);
			if (point.x < wrapped) lo = mid;
			else hi = mid;
		}

		const t = (lo + hi) / 2;
		return cubicPoint(t, segment.p0, segment.p1, segment.p2, segment.p3).y;
	}

	return WAVE_MID_Y;
}

/** Deslocamento vertical em px para alinhar o ícone à onda fixa do container. */
export function getMarqueeWaveOffsetPx(x: number, waveHeightPx: number): number {
	const waveY = getMarqueeWaveY(x);
	return ((waveY - WAVE_MID_Y) / 64) * waveHeightPx * ICON_WAVE_STRENGTH;
}
