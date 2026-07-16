import { describe, expect, it } from 'vitest';
import {
	isStickyPhaseActive,
	isStickyStuckFromTop,
	nextStickyLeadMotionAction,
	shouldDockStickyLead,
	stickyLeadDockedStageSizePx,
	stickyLeadPanelBudgetPx,
} from './sticky-lead-dock';

describe('stickyLeadDockedStageSizePx', () => {
	it('keeps full column width on short viewports (no max-height width collapse)', () => {
		const size = stickyLeadDockedStageSizePx({
			columnWidthPx: 463,
			viewportHeightPx: 750,
		});
		expect(size.widthPx).toBe(463);
		expect(size.heightPx).toBeCloseTo(231.5, 1);
		expect(size.widthPx / size.heightPx).toBeCloseTo(2, 5);
	});

	it('uses 16/9 on taller desktop viewports while staying full width', () => {
		const size = stickyLeadDockedStageSizePx({
			columnWidthPx: 463,
			viewportHeightPx: 900,
		});
		expect(size.widthPx).toBe(463);
		expect(size.heightPx).toBeCloseTo(463 * (9 / 16), 1);
		expect(size.widthPx / size.heightPx).toBeCloseTo(16 / 9, 5);
	});
});

describe('stickyLeadPanelBudgetPx', () => {
	const TARGET_DOCKED_PANEL_HEIGHT_PX = 280;

	it('computes cramped budget at 1100×750 measured reality', () => {
		expect(
			stickyLeadPanelBudgetPx({
				viewportHeightPx: 750,
				stickyTopPx: 112,
				carouselHeightPx: 407,
				slotGapPx: 24,
			}),
		).toBe(207);
	});

	it('shows target panel height does not fit pre-fix budget (carousel must shrink)', () => {
		const budget = stickyLeadPanelBudgetPx({
			viewportHeightPx: 750,
			stickyTopPx: 112,
			carouselHeightPx: 407,
			slotGapPx: 24,
		});
		expect(budget).toBeLessThan(TARGET_DOCKED_PANEL_HEIGHT_PX);
		expect(TARGET_DOCKED_PANEL_HEIGHT_PX > budget).toBe(true);
	});

	it('fits target panel after carousel shrink and tighter slot gap', () => {
		const budget = stickyLeadPanelBudgetPx({
			viewportHeightPx: 750,
			stickyTopPx: 112,
			carouselHeightPx: 280,
			slotGapPx: 12,
		});
		expect(budget).toBeGreaterThanOrEqual(TARGET_DOCKED_PANEL_HEIGHT_PX);
		expect(budget).toBe(346);
	});
});

describe('shouldDockStickyLead', () => {
	it('does not dock on mobile even when sticky and release hidden', () => {
		expect(
			shouldDockStickyLead({
				isDesktop: false,
				isStickyStuck: true,
				isReleaseVisible: false,
			}),
		).toBe(false);
	});

	it('docks on desktop when sticky and release is hidden', () => {
		expect(
			shouldDockStickyLead({
				isDesktop: true,
				isStickyStuck: true,
				isReleaseVisible: false,
			}),
		).toBe(true);
	});

	it('does not dock on desktop when release is visible', () => {
		expect(
			shouldDockStickyLead({
				isDesktop: true,
				isStickyStuck: true,
				isReleaseVisible: true,
			}),
		).toBe(false);
	});

	it('does not dock on desktop when not sticky', () => {
		expect(
			shouldDockStickyLead({
				isDesktop: true,
				isStickyStuck: false,
				isReleaseVisible: false,
			}),
		).toBe(false);
	});
});

describe('isStickyStuckFromTop', () => {
	it('returns true when bounding top is pinned at sticky top', () => {
		expect(isStickyStuckFromTop(112, 112)).toBe(true);
	});

	it('returns true within epsilon of sticky top', () => {
		expect(isStickyStuckFromTop(112, 113, 1)).toBe(true);
		expect(isStickyStuckFromTop(112, 111, 1)).toBe(true);
	});

	it('returns false when still below sticky top (not stuck yet)', () => {
		expect(isStickyStuckFromTop(112, 200)).toBe(false);
	});

	it('returns false when scrolled past sticky release (top above pin)', () => {
		// After sticky unsticks, the column scrolls up — top becomes < stickyTop.
		// Treating that as "stuck" kept the form docked off-screen and never
		// restored it above the footer.
		expect(isStickyStuckFromTop(112, 100)).toBe(false);
		expect(isStickyStuckFromTop(112, -40)).toBe(false);
	});
});

describe('isStickyPhaseActive', () => {
	it('is active on desktop when sentinel left and root still in view', () => {
		expect(
			isStickyPhaseActive({
				isDesktop: true,
				isSentinelOutOfView: true,
				isRootInView: true,
			}),
		).toBe(true);
	});

	it('is inactive when sentinel still in view (page top)', () => {
		expect(
			isStickyPhaseActive({
				isDesktop: true,
				isSentinelOutOfView: false,
				isRootInView: true,
			}),
		).toBe(false);
	});

	it('is inactive when root left the viewport (past carousel section)', () => {
		expect(
			isStickyPhaseActive({
				isDesktop: true,
				isSentinelOutOfView: true,
				isRootInView: false,
			}),
		).toBe(false);
	});

	it('is inactive on mobile', () => {
		expect(
			isStickyPhaseActive({
				isDesktop: false,
				isSentinelOutOfView: true,
				isRootInView: true,
			}),
		).toBe(false);
	});
});

describe('nextStickyLeadMotionAction', () => {
	it('starts enter when dock wanted and panel is at home', () => {
		expect(
			nextStickyLeadMotionAction({
				wantsDock: true,
				isDocked: false,
				phase: 'idle',
				reduceMotion: false,
			}),
		).toBe('start-enter');
	});

	it('starts exit when dock not wanted and panel is docked', () => {
		expect(
			nextStickyLeadMotionAction({
				wantsDock: false,
				isDocked: true,
				phase: 'idle',
				reduceMotion: false,
			}),
		).toBe('start-exit');
	});

	it('returns none when already synced at home', () => {
		expect(
			nextStickyLeadMotionAction({
				wantsDock: false,
				isDocked: false,
				phase: 'idle',
				reduceMotion: false,
			}),
		).toBe('none');
	});

	it('returns none when already synced while docked', () => {
		expect(
			nextStickyLeadMotionAction({
				wantsDock: true,
				isDocked: true,
				phase: 'idle',
				reduceMotion: false,
			}),
		).toBe('none');
	});

	it('force-docks when reduce motion and dock wanted', () => {
		expect(
			nextStickyLeadMotionAction({
				wantsDock: true,
				isDocked: false,
				phase: 'idle',
				reduceMotion: true,
			}),
		).toBe('force-dock');
	});

	it('force-undocks when reduce motion and dock not wanted', () => {
		expect(
			nextStickyLeadMotionAction({
				wantsDock: false,
				isDocked: true,
				phase: 'idle',
				reduceMotion: true,
			}),
		).toBe('force-undock');
	});

	it('cancels exit with force-dock when wants dock mid-exit', () => {
		expect(
			nextStickyLeadMotionAction({
				wantsDock: true,
				isDocked: true,
				phase: 'exiting',
				reduceMotion: false,
			}),
		).toBe('force-dock');
	});

	it('cancels enter with force-undock when dock no longer wanted', () => {
		expect(
			nextStickyLeadMotionAction({
				wantsDock: false,
				isDocked: false,
				phase: 'entering',
				reduceMotion: false,
			}),
		).toBe('force-undock');
	});

	it('force-docks when reduce motion interrupts an exit', () => {
		expect(
			nextStickyLeadMotionAction({
				wantsDock: true,
				isDocked: true,
				phase: 'exiting',
				reduceMotion: true,
			}),
		).toBe('force-dock');
	});

	it('force-undocks when reduce motion interrupts an enter', () => {
		expect(
			nextStickyLeadMotionAction({
				wantsDock: false,
				isDocked: false,
				phase: 'entering',
				reduceMotion: true,
			}),
		).toBe('force-undock');
	});

	it('returns none while entering if dock still wanted', () => {
		expect(
			nextStickyLeadMotionAction({
				wantsDock: true,
				isDocked: false,
				phase: 'entering',
				reduceMotion: false,
			}),
		).toBe('none');
	});

	it('returns none while exiting if dock still not wanted', () => {
		expect(
			nextStickyLeadMotionAction({
				wantsDock: false,
				isDocked: true,
				phase: 'exiting',
				reduceMotion: false,
			}),
		).toBe('none');
	});
});
