import {
	isStickyStuckFromTop,
	nextStickyLeadMotionAction,
	shouldDockStickyLead,
	type StickyLeadMotionPhase,
} from '../lib/sticky-lead-dock';

const DESKTOP_MQ = '(min-width: 1024px)';
const REDUCE_MOTION_MQ = '(prefers-reduced-motion: reduce)';
/** Matches Tailwind `lg:top-28` (7rem). Stuck detection via geometry. */
const STICKY_TOP_PX = 112;
const ENTER_MS = 360;
const EXIT_MS = 280;
const ANIM_FALLBACK_BUFFER_MS = 50;

const ENTER_CLASS = 'tuki-sticky-lead-enter';
const EXIT_CLASS = 'tuki-sticky-lead-exit';
const DOCKED_CLASS = 'is-sticky-lead-docked';
const HOME_VACATED_CLASS = 'is-lead-home-vacated';

let booted = false;

function prefersReducedMotion(mq: MediaQueryList): boolean {
	return mq.matches;
}

function clearMotionClasses(panel: HTMLElement): void {
	panel.classList.remove(ENTER_CLASS, EXIT_CLASS);
}

function vacateHome(home: HTMLElement): void {
	home.classList.add(HOME_VACATED_CLASS);
}

function restoreHome(home: HTMLElement): void {
	home.classList.remove(HOME_VACATED_CLASS);
}

function moveToSlot(panel: HTMLElement, slot: HTMLElement, home: HTMLElement): void {
	vacateHome(home);
	slot.appendChild(panel);
	slot.setAttribute('aria-hidden', 'false');
	panel.classList.add(DOCKED_CLASS);
}

function moveToHome(panel: HTMLElement, homeHost: HTMLElement, slot: HTMLElement, home: HTMLElement): void {
	homeHost.appendChild(panel);
	panel.classList.remove(DOCKED_CLASS);
	slot.setAttribute('aria-hidden', 'true');
	restoreHome(home);
}

export function initStickyLeadDock(): void {
	const roots = document.querySelectorAll<HTMLElement>('[data-sticky-lead-root]');
	if (!roots.length) return;

	const desktopMq = window.matchMedia(DESKTOP_MQ);
	const reduceMq = window.matchMedia(REDUCE_MOTION_MQ);

	roots.forEach((root) => {
		const column = root.querySelector<HTMLElement>('[data-sticky-lead-column]');
		const slot = root.querySelector<HTMLElement>('[data-sticky-lead-slot]');
		const home = document.querySelector<HTMLElement>('[data-sticky-lead-home]');
		const panel = document.querySelector<HTMLElement>('[data-sticky-lead-panel]');
		const release = document.querySelector<HTMLElement>('[data-sticky-lead-release]');

		if (!column || !slot || !home || !panel) return;

		const homeHost = panel.parentElement;
		if (!homeHost) return;

		let isStickyStuck = false;
		let isReleaseVisible = false;
		let isDocked = false;
		let phase: StickyLeadMotionPhase = 'idle';
		let animTimer: ReturnType<typeof setTimeout> | undefined;
		let rafId = 0;

		const clearAnimTimer = () => {
			if (animTimer !== undefined) {
				clearTimeout(animTimer);
				animTimer = undefined;
			}
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
			moveToHome(panel, homeHost, slot, home);
			phase = 'idle';
			isDocked = false;
			evaluate();
		};

		const forceDock = () => {
			clearAnimTimer();
			clearMotionClasses(panel);
			if (panel.parentElement !== slot) {
				moveToSlot(panel, slot, home);
			} else {
				panel.classList.add(DOCKED_CLASS);
				slot.setAttribute('aria-hidden', 'false');
				vacateHome(home);
			}
			phase = 'idle';
			isDocked = true;
		};

		const forceUndock = () => {
			clearAnimTimer();
			clearMotionClasses(panel);
			if (panel.parentElement !== homeHost) {
				moveToHome(panel, homeHost, slot, home);
			} else {
				panel.classList.remove(DOCKED_CLASS);
				restoreHome(home);
			}
			phase = 'idle';
			isDocked = false;
		};

		const startEnter = () => {
			clearAnimTimer();
			clearMotionClasses(panel);
			if (panel.parentElement !== slot) {
				moveToSlot(panel, slot, home);
			}
			phase = 'entering';
			isDocked = false;
			// Force reflow so enter animation runs after teleport.
			panel.getBoundingClientRect();
			panel.classList.add(ENTER_CLASS);
			animTimer = setTimeout(finishEnter, ENTER_MS + ANIM_FALLBACK_BUFFER_MS);
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

		const evaluate = () => {
			const wantsDock = shouldDockStickyLead({
				isDesktop: desktopMq.matches,
				isStickyStuck,
				isReleaseVisible,
			});

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

		const updateStuck = () => {
			const top = column.getBoundingClientRect().top;
			isStickyStuck = desktopMq.matches && isStickyStuckFromTop(STICKY_TOP_PX, top);
			evaluate();
		};

		const scheduleStuckCheck = () => {
			if (rafId) return;
			rafId = window.requestAnimationFrame(() => {
				rafId = 0;
				updateStuck();
			});
		};

		window.addEventListener('scroll', scheduleStuckCheck, { passive: true });
		window.addEventListener('resize', scheduleStuckCheck);

		const onDesktopChange = () => {
			if (!desktopMq.matches && (isDocked || phase !== 'idle')) {
				forceUndock();
			}
			updateStuck();
		};
		desktopMq.addEventListener('change', onDesktopChange);
		reduceMq.addEventListener('change', evaluate);

		let releaseObserver: IntersectionObserver | undefined;
		if (release) {
			releaseObserver = new IntersectionObserver(
				(entries) => {
					isReleaseVisible = entries.some((entry) => entry.isIntersecting);
					evaluate();
				},
				{ threshold: 0.01, rootMargin: '0px 0px -10% 0px' },
			);
			releaseObserver.observe(release);
		}

		const onPageHide = () => {
			window.removeEventListener('scroll', scheduleStuckCheck);
			window.removeEventListener('resize', scheduleStuckCheck);
			desktopMq.removeEventListener('change', onDesktopChange);
			reduceMq.removeEventListener('change', evaluate);
			panel.removeEventListener('animationend', onAnimationEnd);
			releaseObserver?.disconnect();
			clearAnimTimer();
			if (rafId) window.cancelAnimationFrame(rafId);
		};
		window.addEventListener('pagehide', onPageHide, { once: true });

		updateStuck();
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
