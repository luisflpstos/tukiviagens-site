import { describe, expect, it } from 'vitest';
import {
	isStickyStuckFromTop,
	nextStickyLeadMotionAction,
	shouldDockStickyLead,
} from './sticky-lead-dock';

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
	it('returns true when bounding top is at or above sticky top', () => {
		expect(isStickyStuckFromTop(112, 112)).toBe(true);
		expect(isStickyStuckFromTop(112, 100)).toBe(true);
	});

	it('returns true within epsilon of sticky top', () => {
		expect(isStickyStuckFromTop(112, 113, 1)).toBe(true);
	});

	it('returns false when clearly below sticky top', () => {
		expect(isStickyStuckFromTop(112, 200)).toBe(false);
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
