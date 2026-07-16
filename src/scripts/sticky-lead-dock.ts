import {
	isStickyPhaseActive,
	nextStickyLeadMotionAction,
	shouldDockStickyLead,
	type StickyLeadMotionPhase,
} from '../lib/sticky-lead-dock';

const DESKTOP_MQ = '(min-width: 1024px)';
const REDUCE_MOTION_MQ = '(prefers-reduced-motion: reduce)';
const ENTER_MS = 420;
const EXIT_MS = 320;
const ANIM_FALLBACK_BUFFER_MS = 80;
/** Ignore brief IO flips while the form teleports into the sticky column. */
const STABLE_MS = 60;

const ENTER_CLASS = 'tuki-sticky-lead-enter';
const EXIT_CLASS = 'tuki-sticky-lead-exit';
const PENDING_CLASS = 'tuki-sticky-lead-pending';
const DOCKED_CLASS = 'is-sticky-lead-docked';

let booted = false;

function prefersReducedMotion(mq: MediaQueryList): boolean {
	return mq.matches;
}

function clearMotionClasses(panel: HTMLElement): void {
	panel.classList.remove(ENTER_CLASS, EXIT_CLASS, PENDING_CLASS);
}

function moveToSlot(panel: HTMLElement, slot: HTMLElement): void {
	slot.appendChild(panel);
	slot.setAttribute('aria-hidden', 'false');
	panel.classList.add(DOCKED_CLASS);
}

function moveToHome(panel: HTMLElement, homeHost: HTMLElement, slot: HTMLElement): void {
	homeHost.appendChild(panel);
	panel.classList.remove(DOCKED_CLASS);
	slot.setAttribute('aria-hidden', 'true');
}

export function initStickyLeadDock(): void {
	const roots = document.querySelectorAll<HTMLElement>('[data-sticky-lead-root]');
	if (!roots.length) return;

	const desktopMq = window.matchMedia(DESKTOP_MQ);
	const reduceMq = window.matchMedia(REDUCE_MOTION_MQ);

	roots.forEach((root) => {
		const column = root.querySelector<HTMLElement>('[data-sticky-lead-column]');
		const slot = root.querySelector<HTMLElement>('[data-sticky-lead-slot]');
		const sentinel = root.querySelector<HTMLElement>('[data-sticky-lead-sentinel]');
		const home = document.querySelector<HTMLElement>('[data-sticky-lead-home]');
		const panel = document.querySelector<HTMLElement>('[data-sticky-lead-panel]');
		const release = document.querySelector<HTMLElement>('[data-sticky-lead-release]');

		if (!column || !slot || !home || !panel) return;

		const homeHost = home;
		if (panel.parentElement !== homeHost) {
			homeHost.appendChild(panel);
		}

		let isSentinelOutOfView = false;
		let isRootInView = true;
		let isReleaseVisible = false;
		let isDocked = false;
		let phase: StickyLeadMotionPhase = 'idle';
		let animTimer: ReturnType<typeof setTimeout> | undefined;
		let stableTimer: ReturnType<typeof setTimeout> | undefined;
		let pendingWantsDock: boolean | null = null;

		const clearAnimTimer = () => {
			if (animTimer !== undefined) {
				clearTimeout(animTimer);
				animTimer = undefined;
			}
		};

		const clearStableTimer = () => {
			if (stableTimer !== undefined) {
				clearTimeout(stableTimer);
				stableTimer = undefined;
			}
		};

		const readWantsDock = () =>
			shouldDockStickyLead({
				isDesktop: desktopMq.matches,
				isStickyStuck: isStickyPhaseActive({
					isDesktop: desktopMq.matches,
					isSentinelOutOfView,
					isRootInView,
				}),
				isReleaseVisible,
			});

		const runAction = (wantsDock: boolean) => {
			const action = nextStickyLeadMotionAction({
				wantsDock,
				isDocked,
				phase,
				reduceMotion: prefersReducedMotion(reduceMq),
			});

			switch (action) {
				case 'start-enter':
					startEnter();
					break;
				case 'start-exit':
					startExit();
					break;
				case 'force-dock':
					forceDock();
					break;
				case 'force-undock':
					forceUndock();
					break;
				case 'none':
				default:
					break;
			}
		};

		const evaluate = () => {
			const wantsDock = readWantsDock();

			// While animating, apply immediately (cancel rules).
			if (phase !== 'idle') {
				pendingWantsDock = null;
				clearStableTimer();
				runAction(wantsDock);
				return;
			}

			// Debounce idle transitions so IO/layout noise cannot flicker dock.
			if (wantsDock === isDocked) {
				pendingWantsDock = null;
				clearStableTimer();
				return;
			}

			if (pendingWantsDock === wantsDock && stableTimer !== undefined) {
				return;
			}

			pendingWantsDock = wantsDock;
			clearStableTimer();
			stableTimer = setTimeout(() => {
				stableTimer = undefined;
				const stableWant = pendingWantsDock;
				pendingWantsDock = null;
				if (stableWant === null) return;
				runAction(stableWant);
			}, STABLE_MS);
		};

		const finishEnter = () => {
			clearAnimTimer();
			clearMotionClasses(panel);
			phase = 'idle';
			isDocked = true;
			evaluate();
		};

		const finishExit = () => {
			clearAnimTimer();
			clearMotionClasses(panel);
			moveToHome(panel, homeHost, slot);
			phase = 'idle';
			isDocked = false;
			evaluate();
		};

		const forceDock = () => {
			clearAnimTimer();
			clearMotionClasses(panel);
			if (panel.parentElement !== slot) {
				moveToSlot(panel, slot);
			} else {
				panel.classList.add(DOCKED_CLASS);
				slot.setAttribute('aria-hidden', 'false');
			}
			phase = 'idle';
			isDocked = true;
		};

		const forceUndock = () => {
			clearAnimTimer();
			clearMotionClasses(panel);
			if (panel.parentElement !== homeHost) {
				moveToHome(panel, homeHost, slot);
			} else {
				panel.classList.remove(DOCKED_CLASS);
			}
			phase = 'idle';
			isDocked = false;
		};

		const startEnter = () => {
			clearAnimTimer();
			clearMotionClasses(panel);
			panel.classList.add(PENDING_CLASS);
			if (panel.parentElement !== slot) {
				moveToSlot(panel, slot);
			}
			phase = 'entering';
			isDocked = false;
			// Double rAF: wait until layout after teleport before revealing.
			requestAnimationFrame(() => {
				requestAnimationFrame(() => {
					if (phase !== 'entering') return;
					panel.classList.remove(PENDING_CLASS);
					panel.classList.add(ENTER_CLASS);
					animTimer = setTimeout(finishEnter, ENTER_MS + ANIM_FALLBACK_BUFFER_MS);
				});
			});
		};

		const startExit = () => {
			clearAnimTimer();
			clearMotionClasses(panel);
			if (panel.parentElement !== slot) {
				forceUndock();
				return;
			}
			phase = 'exiting';
			panel.classList.add(EXIT_CLASS);
			animTimer = setTimeout(finishExit, EXIT_MS + ANIM_FALLBACK_BUFFER_MS);
		};

		const onAnimationEnd = (event: AnimationEvent) => {
			if (event.target !== panel) return;
			const name = event.animationName;
			if (name.includes('tuki-sticky-lead-enter') && phase === 'entering') {
				finishEnter();
			} else if (name.includes('tuki-sticky-lead-exit') && phase === 'exiting') {
				finishExit();
			}
		};

		panel.addEventListener('animationend', onAnimationEnd);

		const observers: IntersectionObserver[] = [];

		if (sentinel) {
			const sentinelObserver = new IntersectionObserver(
				(entries) => {
					const entry = entries[0];
					if (!entry) return;
					isSentinelOutOfView = !entry.isIntersecting;
					evaluate();
				},
				{ threshold: 0, rootMargin: '-1px 0px 0px 0px' },
			);
			sentinelObserver.observe(sentinel);
			observers.push(sentinelObserver);
		}

		const rootObserver = new IntersectionObserver(
			(entries) => {
				const entry = entries[0];
				if (!entry) return;
				isRootInView = entry.isIntersecting;
				evaluate();
			},
			{ threshold: 0 },
		);
		rootObserver.observe(root);
		observers.push(rootObserver);

		if (release) {
			const releaseObserver = new IntersectionObserver(
				(entries) => {
					isReleaseVisible = entries.some((entry) => entry.isIntersecting);
					evaluate();
				},
				{ threshold: 0.01, rootMargin: '0px 0px -12% 0px' },
			);
			releaseObserver.observe(release);
			observers.push(releaseObserver);
		}

		const onDesktopChange = () => {
			if (!desktopMq.matches && (isDocked || phase !== 'idle')) {
				clearStableTimer();
				forceUndock();
			}
			evaluate();
		};
		desktopMq.addEventListener('change', onDesktopChange);
		reduceMq.addEventListener('change', evaluate);

		const onPageHide = () => {
			desktopMq.removeEventListener('change', onDesktopChange);
			reduceMq.removeEventListener('change', evaluate);
			panel.removeEventListener('animationend', onAnimationEnd);
			for (const observer of observers) observer.disconnect();
			clearAnimTimer();
			clearStableTimer();
		};
		window.addEventListener('pagehide', onPageHide, { once: true });

		evaluate();
	});
}

function boot(): void {
	if (booted) return;
	booted = true;
	initStickyLeadDock();
}

if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', boot, { once: true });
} else {
	boot();
}
