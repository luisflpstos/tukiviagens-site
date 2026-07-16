export type StickyLeadDockStateInput = {
	isDesktop: boolean;
	isStickyStuck: boolean;
	isReleaseVisible: boolean;
};

export type StickyLeadFitBudgetInput = {
	viewportHeightPx: number;
	stickyTopPx: number;
	carouselHeightPx: number;
	slotGapPx: number;
};

/** Remaining px under the carousel for the docked panel inside the sticky column. */
export function stickyLeadPanelBudgetPx(input: StickyLeadFitBudgetInput): number {
	return (
		input.viewportHeightPx -
		input.stickyTopPx -
		input.carouselHeightPx -
		input.slotGapPx
	);
}

export function shouldDockStickyLead(input: StickyLeadDockStateInput): boolean {
	return input.isDesktop && input.isStickyStuck && !input.isReleaseVisible;
}

export function isStickyStuckFromTop(
	stickyTopPx: number,
	boundingClientTop: number,
	epsilonPx = 1,
): boolean {
	// Sticky is pinned only while top sits at the sticky offset.
	// `top < stickyTop` means the column has unstuck and scrolled away —
	// that must NOT count as stuck, or the lead form never returns home.
	return Math.abs(boundingClientTop - stickyTopPx) <= epsilonPx;
}

/**
 * Dock phase from IntersectionObservers — independent of sticky column height.
 * Measuring getBoundingClientRect on the sticky column flickers when the compact
 * form is teleported in (column grows → sticky unpins → form undocks → loop).
 */
export function isStickyPhaseActive(input: {
	isDesktop: boolean;
	isSentinelOutOfView: boolean;
	isRootInView: boolean;
}): boolean {
	return input.isDesktop && input.isSentinelOutOfView && input.isRootInView;
}

export type StickyLeadMotionPhase = 'idle' | 'entering' | 'exiting';

export type StickyLeadMotionAction =
	| 'none'
	| 'start-enter'
	| 'start-exit'
	| 'force-dock'
	| 'force-undock';

export function nextStickyLeadMotionAction(input: {
	wantsDock: boolean;
	isDocked: boolean;
	phase: StickyLeadMotionPhase;
	reduceMotion: boolean;
}): StickyLeadMotionAction {
	const { wantsDock, isDocked, phase, reduceMotion } = input;

	if (phase === 'entering') {
		if (!wantsDock) return 'force-undock';
		return 'none';
	}

	if (phase === 'exiting') {
		if (wantsDock) return 'force-dock';
		return 'none';
	}

	// phase === 'idle'
	if (wantsDock === isDocked) return 'none';

	if (reduceMotion) {
		return wantsDock ? 'force-dock' : 'force-undock';
	}

	return wantsDock ? 'start-enter' : 'start-exit';
}
