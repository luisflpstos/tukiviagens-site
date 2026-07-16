export type StickyLeadDockStateInput = {
	isDesktop: boolean;
	isStickyStuck: boolean;
	isReleaseVisible: boolean;
};

export function shouldDockStickyLead(input: StickyLeadDockStateInput): boolean {
	return input.isDesktop && input.isStickyStuck && !input.isReleaseVisible;
}

export function isStickyStuckFromTop(
	stickyTopPx: number,
	boundingClientTop: number,
	epsilonPx = 1,
): boolean {
	return boundingClientTop <= stickyTopPx + epsilonPx;
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
