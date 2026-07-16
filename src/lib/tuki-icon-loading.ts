export type TukiIconLoadingContext = 'default' | 'marquee';

/** Marquee icons sit in overflow-hidden animated tracks; lazy loading is unreliable there. */
export function resolveTukiIconLoading(context: TukiIconLoadingContext = 'default'): 'lazy' | 'eager' {
	return context === 'marquee' ? 'eager' : 'lazy';
}

/** Marquee is below the hero fold; keep eager for reliability but deprioritize bandwidth. */
export function resolveTukiIconFetchPriority(
	context: TukiIconLoadingContext = 'default',
): 'high' | 'low' | 'auto' {
	return context === 'marquee' ? 'low' : 'auto';
}
