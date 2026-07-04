export type TukiIconLoadingContext = 'default' | 'marquee';

/** Marquee icons sit in overflow-hidden animated tracks; lazy loading is unreliable there. */
export function resolveTukiIconLoading(context: TukiIconLoadingContext = 'default'): 'lazy' | 'eager' {
	return context === 'marquee' ? 'eager' : 'lazy';
}
