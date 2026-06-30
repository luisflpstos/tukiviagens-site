/** Onda inferior da hero — transição para a faixa laranja. */
export const HERO_WAVE_VIEWBOX = '0 0 1440 64';
export const HERO_WAVE_PATH =
	'M0,40 C240,72 480,8 720,32 C960,56 1200,64 1440,48 L1440,64 L0,64 Z';

/** Onda inferior da faixa laranja — transição para a seção branca abaixo. */
export const MARQUEE_BOTTOM_WAVE_VIEWBOX = HERO_WAVE_VIEWBOX;
export const MARQUEE_BOTTOM_WAVE_PATH = HERO_WAVE_PATH;

/** Clip da faixa laranja: topo reto e base ondulada (objectBoundingBox 0–1). */
export const MARQUEE_CLIP_PATH_D =
	'M0,0 L1,0 L1,0.75 C0.833,1 0.667,0.875 0.5,0.5 C0.333,0.125 0.167,1.125 0,0.625 Z';
