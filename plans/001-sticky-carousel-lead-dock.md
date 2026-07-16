# Plan 001: Dock lead form under sticky carousel on desktop until highlights release

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md` — unless a reviewer dispatched you and told you they
> maintain the index.
>
> **Drift check (run first)**: `git diff --stat 767f95c..HEAD -- src/components/sections/ContentWithCarousel.astro src/components/sections/LeadCaptureSection.astro src/components/sections/BenefitsList.astro src/layouts/PageLayout.astro src/layouts/HotelLayout.astro src/lib/sticky-lead-dock.ts src/lib/sticky-lead-dock.test.ts src/scripts/sticky-lead-dock.ts src/styles/global.css src/styles/motion.css`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P1
- **Effort**: M
- **Risk**: MED
- **Depends on**: none
- **Category**: direction
- **Planned at**: commit `767f95c`, 2026-07-16

## Why this matters

On desktop pages with a photo carousel, `lg:sticky` keeps the gallery fixed while the right-column markdown scrolls. That leaves a large empty band under the carousel until the sticky phase ends. Meanwhile the lead form — the primary conversion surface — sits far below (after destaques/FAQ), so the sticky phase wastes high-attention viewport space. Docking the **same** lead form under the sticky carousel while the gallery is stuck, then restoring it to its original place before the footer when the highlights/`BenefitsList` section enters view, fills that dead space and keeps conversion close during the reading phase without duplicating the form.

The dock/undock must feel intentional: **entrada** (form slides up into the empty band under the carousel) and **saída** (form exits the dock before returning home). Snapping without motion reads as a bug; abrupt teleport mid-scroll feels broken. Motion must reuse existing Tuki tokens in `src/styles/motion.css` and honor `prefers-reduced-motion` (instant dock/undock, no transform/opacity animation).

Product intent (`PRODUCT.md`): hospitality/property pages are conversion surfaces; form friction must stay low; support `prefers-reduced-motion`. This behavior applies only when a carousel exists and only at the `lg` breakpoint and up.

## Current state

Relevant files:

- `src/components/sections/ContentWithCarousel.astro` — two-column grid; left column is sticky carousel only.
- `src/components/sections/LeadCaptureSection.astro` — full-width lead section rendered after FAQ; no `id="formulario"` today (HotelLayout already links to `#formulario`).
- `src/components/sections/BenefitsList.astro` — “Destaques do hotel/resort” (PageLayout) or “Comodidades” (HotelLayout); natural release marker after the content+carousel block.
- `src/layouts/PageLayout.astro` — primary path for content pages (`src/pages/[...path].astro`); order: carousel content → BenefitsList → Faq → LeadCaptureSection.
- `src/layouts/HotelLayout.astro` — same structural order for `/hoteis/[slug]` (and ResortLayout wraps it).
- `src/lib/property-gallery.ts` — carousel shown for `hub | hotel | resort | atracao` when gallery has images.
- Client script pattern: extract pure logic to `src/lib/*.ts` + Vitest; wire DOM in `src/scripts/*.ts` imported from an Astro `<script>` (see `src/lib/photo-lightbox.ts` + `src/scripts/photo-carousel.ts` + `src/components/common/PhotoCarousel.astro`).
- IntersectionObserver exemplar: `src/scripts/home-motion.ts`.
- Motion tokens live in `src/styles/motion.css`: `--tuki-duration-normal` (280ms), `--tuki-duration-fast` (150ms), `--tuki-ease-expo`, `--tuki-ease-out`. Prefer keyframes there (same file as other intentional UI motion).
- Package manager: **pnpm**. Tests: `pnpm test`. No separate lint/typecheck scripts — use `pnpm test` and `pnpm build`.

Sticky column today:

```12:22:src/components/sections/ContentWithCarousel.astro
<section class="section-padding">
	<div class="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
		<div class="grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-12">
			<div class="lg:sticky lg:top-28">
				<PhotoCarousel images={images} label={label} />
			</div>

			<article class="content-markdown max-w-none">
				<slot />
			</article>
		</div>
	</div>
</section>
```

Page section order today (`PageLayout`):

```220:248:src/layouts/PageLayout.astro
	<article class:list={[!showGallery && 'section-padding']}>
		{
			showGallery ? (
				<ContentWithCarousel images={galleryImages} label={title}>
					<slot />
				</ContentWithCarousel>
			) : (
				...
			)
		}
	</article>

	{highlights.length > 0 && <BenefitsList items={highlights} title={benefitsTitle} />}
	<Faq items={faq} />
	<LeadCaptureSection
		formId="pagina-lead-form"
		...
	/>
```

Sticky offset: `lg:top-28` = `7rem` (112px), matching sticky header clearance.

**Chosen approach (do not invent another):** single form instance via **DOM move (teleport)**, not clone, with a **mandatory enter/exit animation** around the move.

1. Sticky left column gains an empty dock slot under the carousel.
2. Lead section gains a stable home host; the movable node is `[data-sticky-lead-panel]`.
3. While desktop + sticky-stuck + release not intersecting → dock panel into the slot **with enter animation**.
4. Otherwise → play **exit animation in the slot**, then move panel back to home.
5. Moving preserves LeadForm state, date-picker init, and tracker wiring. Cloning would double IDs/`formId` and break submit — forbidden.
6. Never move the node mid-exit without finishing or cancelling the animation sequence (see state machine below).

**Dock decision table** (encode in pure function `shouldDockStickyLead`):

| isDesktop (`lg`+) | isStickyStuck | isReleaseVisible | wantsDock? |
|-------------------|---------------|------------------|------------|
| false | * | * | false |
| true | false | * | false |
| true | true | false | true |
| true | true | true | false |

`isStickyStuck`: sentinel **above** the sticky column leaves the top of the viewport (IntersectionObserver with `rootMargin` accounting for `top-28`, or compare sticky `getBoundingClientRect().top` to sticky top offset with a 1px tolerance).

`isReleaseVisible`: `[data-sticky-lead-release]` (BenefitsList root) intersects viewport with a small top rootMargin (e.g. `0px 0px -10% 0px` or threshold ~0.01). If BenefitsList is absent (empty highlights/amenities), rely only on `isStickyStuck` becoming false when the carousel section ends — still undock. Do **not** require BenefitsList to exist.

### Motion contract (required)

Visual intent:

| Event | What the user sees |
|-------|--------------------|
| **Entrada (dock)** | Panel appears under the carousel by sliding **up** into place + fading in (`translateY(1.25rem)` → `0`, `opacity 0` → `1`). |
| **Saída (undock)** | Panel fades out and slides **down** slightly in the dock (`opacity 1` → `0`, `translateY(0)` → `0.75rem`), **then** the node returns to home. |

Specs:

- Duration enter: `360ms` using `var(--tuki-ease-expo)` (between normal and slow — readable on scroll).
- Duration exit: `280ms` using `var(--tuki-ease-out)` (`var(--tuki-duration-normal)`).
- Properties animated: `opacity` + `transform: translateY(...)` only. No blur, no scale bounce, no layout thrash animations.
- CSS lives in `src/styles/motion.css` as:
  - `@keyframes tuki-sticky-lead-enter`
  - `@keyframes tuki-sticky-lead-exit`
  - classes `.tuki-sticky-lead-enter` / `.tuki-sticky-lead-exit` applied by the script on `[data-sticky-lead-panel]`
- `prefers-reduced-motion: reduce`: skip both animations; dock/undock is an immediate `appendChild` with final styles applied (PRODUCT.md a11y). Still dock/undock — only motion is removed.
- Do **not** animate the home section when the panel returns (home is usually below the fold at release time). Exit happens in the dock; home just receives the settled panel.

**Animation state machine** (implement in script; encode transition choices in a pure helper tested in Vitest):

```ts
export type StickyLeadMotionPhase = 'idle' | 'entering' | 'exiting';

export type StickyLeadMotionAction =
  | 'none'
  | 'start-enter'   // move to slot (if needed), play enter
  | 'start-exit'    // play exit in slot; move home on end
  | 'force-dock'    // reduced-motion or cancel: immediate dock
  | 'force-undock'; // reduced-motion or cancel: immediate undock

export function nextStickyLeadMotionAction(input: {
  wantsDock: boolean;
  isDocked: boolean;
  phase: StickyLeadMotionPhase;
  reduceMotion: boolean;
}): StickyLeadMotionAction;
```

Required truth table for `nextStickyLeadMotionAction` (executor must test these):

| wantsDock | isDocked | phase | reduceMotion | action |
|-----------|----------|-------|--------------|--------|
| true | false | idle | false | `start-enter` |
| false | true | idle | false | `start-exit` |
| true | true | idle | * | `none` |
| false | false | idle | * | `none` |
| true | false | idle | true | `force-dock` |
| false | true | idle | true | `force-undock` |
| true | * | exiting | false | `force-dock` (cancel exit; snap into dock — user scrolled back) |
| false | * | entering | false | `force-undock` or restart as `start-exit` after cancel — prefer **cancel enter, then `start-exit` if already in slot**, else `force-undock` if not yet moved. Simplest allowed: cancel animation classes → `force-undock` / `force-dock` immediately when phase ≠ idle and target flips. |
| * | * | entering/exiting | true | matching `force-dock` / `force-undock` |

Script sequence for `start-enter`:

1. If panel is not in slot: `slot.appendChild(panel)`; mark home vacated; set docked layout classes (`is-sticky-lead-docked`, max-height/overflow).
2. Force reflow (`panel.getBoundingClientRect()`), add `.tuki-sticky-lead-enter`, remove exit class.
3. On `animationend` (or timeout = enter duration + 50ms fallback): remove enter class; phase → `idle`; `isDocked = true`.

Script sequence for `start-exit`:

1. Panel must still be in slot. Add `.tuki-sticky-lead-exit`, remove enter class; phase → `exiting`.
2. On `animationend` (or timeout = exit duration + 50ms): `homeHost.appendChild(panel)`; clear vacated/docked classes; remove exit class; phase → `idle`; `isDocked = false`; slot `aria-hidden="true"`.

While `phase === 'entering' | 'exiting'`, ignore redundant identical `wantsDock` updates; only react to flips via the cancel rules above.

## Commands you will need

| Purpose | Command | Expected on success |
|---------|---------|---------------------|
| Install | `pnpm install` | exit 0 |
| Unit tests (filtered) | `pnpm test -- src/lib/sticky-lead-dock.test.ts` | all pass |
| Full tests | `pnpm test` | all pass |
| Build | `pnpm build` | exit 0 |
| Dev (manual UX) | `pnpm dev` | serves locally; exercise a hotel page at ≥1024px width |

## Suggested executor toolkit

- Follow TDD: failing unit tests for `shouldDockStickyLead`, `isStickyStuckFromTop`, and `nextStickyLeadMotionAction` **before** production implementation.
- Follow SOLID: dock policy + motion action selection in `src/lib/sticky-lead-dock.ts`; DOM/observers/animationend wiring only in `src/scripts/sticky-lead-dock.ts`; Astro files only add markers/slots/import the script; CSS keyframes only in `src/styles/motion.css`.
- If the impeccable skill is available, use it only to sanity-check motion timing — do not redesign the lead panel.

## Scope

**In scope** (the only files you should create or modify):

- `src/lib/sticky-lead-dock.ts` (create) — `shouldDockStickyLead`, `isStickyStuckFromTop`, `nextStickyLeadMotionAction`
- `src/lib/sticky-lead-dock.test.ts` (create)
- `src/scripts/sticky-lead-dock.ts` (create) — init, observers, move node, enter/exit class orchestration, resize/media cleanup
- `src/components/sections/ContentWithCarousel.astro` — sticky wrapper markers + dock slot; import script
- `src/components/sections/LeadCaptureSection.astro` — `id="formulario"`, home wrapper/`data-*` markers, movable panel root
- `src/components/sections/BenefitsList.astro` — `data-sticky-lead-release` on the `<section>`
- `src/styles/motion.css` — enter/exit keyframes + classes; reduced-motion override that disables those two animations
- `src/styles/global.css` — only if dock layout utilities (max-height/overflow for `.is-sticky-lead-docked`) do not fit cleanly in `motion.css`; prefer keeping **animation** in `motion.css` and **layout dock constraints** either as Tailwind on the panel when docked (class toggled by script) or a tiny rule in `global.css`

**Out of scope** (do NOT touch):

- Lead validation, API (`src/pages/api/lead.ts`), tracking payloads
- Photo carousel slide logic / lightbox
- Mobile layout below `lg` (must remain unchanged: form only at bottom; no dock animations on mobile)
- Landing pages (`src/pages/lp/*`) and DestinationLayout (no `ContentWithCarousel`)
- Content markdown files
- DESIGN.md / PRODUCT.md
- Duplicating the form in the sticky column
- Changing sticky top offset unless required for correctness of stuck detection
- Framer Motion / GSAP / new animation libraries — CSS keyframes + class toggles only
- Creating git branches, commits, pushes, or worktrees unless the operator explicitly asks later

## Git workflow

Operator preference for this repo session:

- Work on the **current** working tree / branch.
- **Do not** create a new branch, worktree, commit, or push.
- Leave changes unstaged/uncommitted for the operator to review.

## Steps

### Step 0: Drift check

Run the drift check command in the Executor instructions. Confirm excerpts still match.

**Verify**: command exits 0; if diff is non-empty, re-read in-scope files and STOP if sticky/lead structure changed.

### Step 1: RED — pure dock + motion policy tests

Create `src/lib/sticky-lead-dock.test.ts` and a stub `src/lib/sticky-lead-dock.ts` that compiles but fails assertions.

Cover at minimum:

1. `shouldDockStickyLead({ isDesktop: false, isStickyStuck: true, isReleaseVisible: false })` → `false`
2. Desktop + stuck + release hidden → `true`
3. Desktop + stuck + release visible → `false`
4. Desktop + not stuck + release hidden → `false`
5. `isStickyStuckFromTop(stickyTopPx, boundingTopPx)`: `true` when `boundingTop <= stickyTop + epsilon`, `false` when clearly below (e.g. top = 200 while stickyTop = 112)
6. `nextStickyLeadMotionAction` cases from the truth table above (at least: start-enter, start-exit, none when already synced, force-* when reduceMotion, cancel when phase flips)

Model test style after `src/lib/photo-lightbox.test.ts` (Vitest `describe`/`it`, no DOM required).

**Verify**: `pnpm test -- src/lib/sticky-lead-dock.test.ts` → fails on missing/incorrect implementation (RED), not on import/config errors.

### Step 2: GREEN — implement pure helpers

Implement the minimum in `src/lib/sticky-lead-dock.ts` to pass Step 1. Keep functions pure and framework-free.

Suggested public API:

```ts
export type StickyLeadDockStateInput = {
  isDesktop: boolean;
  isStickyStuck: boolean;
  isReleaseVisible: boolean;
};

export function shouldDockStickyLead(input: StickyLeadDockStateInput): boolean;

export function isStickyStuckFromTop(
  stickyTopPx: number,
  boundingClientTop: number,
  epsilonPx?: number,
): boolean;

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
}): StickyLeadMotionAction;
```

**Verify**: `pnpm test -- src/lib/sticky-lead-dock.test.ts` → all pass.

### Step 3: Markup hooks

**`ContentWithCarousel.astro`**

- On the outer `<section>`, add `data-sticky-lead-root`.
- On the sticky column wrapper, add `data-sticky-lead-column` and keep `lg:sticky lg:top-28`.
- Add dock slot **below** the carousel:

```astro
<div class="lg:sticky lg:top-28" data-sticky-lead-column>
  <PhotoCarousel images={images} label={label} />
  <div data-sticky-lead-slot class="mt-6 hidden lg:block" aria-hidden="true"></div>
</div>
```

- Optional sentinel `data-sticky-lead-sentinel` if using IO-on-sentinel for stuck detection — pick **one** stuck-detection strategy and leave a one-line comment in the script.
- Import script:

```astro
<script>
  import '../../scripts/sticky-lead-dock';
</script>
```

**`LeadCaptureSection.astro`**

```astro
<section id="formulario" class="section-padding bg-white" data-sticky-lead-home>
  <Container size="narrow">
    <div class="tuki-surface-panel" data-sticky-lead-panel>
      <!-- existing title, subtitle, LeadForm -->
    </div>
  </Container>
</section>
```

- Script moves `[data-sticky-lead-panel]` into `[data-sticky-lead-slot]` on dock.
- While docked/vacated, home gets `is-lead-home-vacated` (and measured `min-height` if needed) so the footer does not jump. Do **not** `display: none` the home without reserving space.

**`BenefitsList.astro`**

- Add `data-sticky-lead-release` to the rendered `<section>`.

Do not change PageLayout/HotelLayout section order.

**Verify**: `rg -n "data-sticky-lead-" src/components/sections/` → shows root/column/slot/home/panel/release.

### Step 4: Motion CSS

In `src/styles/motion.css`, add:

```css
@keyframes tuki-sticky-lead-enter {
  from {
    opacity: 0;
    transform: translateY(1.25rem);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes tuki-sticky-lead-exit {
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(0.75rem);
  }
}

.tuki-sticky-lead-enter {
  animation: tuki-sticky-lead-enter 360ms var(--tuki-ease-expo) both;
}

.tuki-sticky-lead-exit {
  animation: tuki-sticky-lead-exit var(--tuki-duration-normal) var(--tuki-ease-out) both;
}

.is-sticky-lead-docked {
  max-height: calc(100vh - 9rem);
  overflow-y: auto;
}

@media (prefers-reduced-motion: reduce) {
  .tuki-sticky-lead-enter,
  .tuki-sticky-lead-exit {
    animation: none !important;
  }
}
```

Exact values may match tokens; do not invent new easing curves.

**Verify**: `rg -n "tuki-sticky-lead-enter" src/styles/motion.css` matches; `rg -n "tuki-sticky-lead-exit" src/styles/motion.css` matches.

### Step 5: Client controller

Create `src/scripts/sticky-lead-dock.ts`:

1. Query `[data-sticky-lead-root]` (usually one per page).
2. Resolve column, slot from root; resolve home/panel/release from `document` (they are outside the carousel section).
3. If panel or slot missing, no-op.
4. `matchMedia('(min-width: 1024px)')` for desktop; `matchMedia('(prefers-reduced-motion: reduce)')` for motion.
5. Track `isStickyStuck`, `isReleaseVisible`, `isDocked`, `phase`.
6. On updates: `wantsDock = shouldDockStickyLead(...)` then `action = nextStickyLeadMotionAction(...)` then run the matching sequence from the Motion contract.
7. Listen for `animationend` on the panel (filter `animationName` containing `tuki-sticky-lead`); always keep a timeout fallback so a missed event cannot leave `phase` stuck.
8. Passive listeners / observers on `pagehide` if registered globally.
9. Idempotent init.

Boot pattern:

```ts
function boot() {
  initStickyLeadDock();
}
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot, { once: true });
} else {
  boot();
}
```

**Verify**: `pnpm test` → all pass. `pnpm build` → exit 0.

### Step 6: Manual UX acceptance (desktop)

With `pnpm dev`, open a published hotel page with gallery + highlights (confirm slug in browser; e.g. a Rio Quente hotel under `/rio-quente/...`).

At viewport width ≥ 1024px:

1. Load: form only at home near footer; no panel under carousel yet if not stuck.
2. Scroll until carousel sticks: form **animates in** under the carousel (slide up + fade), filling the former empty band.
3. Scroll until BenefitsList/destaques enters: form **animates out** in the dock, then reappears in the original home section (after FAQ).
4. Scroll back into sticky phase: enter animation runs again (bidirectional).
5. Rapidly cross the release threshold mid-animation: no stuck invisible panel; ends in a valid docked or home state.
6. Emulate `prefers-reduced-motion: reduce`: dock/undock still works, with **no** slide/fade.
7. Width < 1024px: never docks; no dock animations.

**Verify**: checklist observed; `document.querySelectorAll('[data-sticky-lead-panel]').length === 1`.

### Step 7: Refactor pass

Only if tests stay green: extract `runMotionAction`, clarify names, keep SRP. No new behavior.

**Verify**: `pnpm test` → all pass.

## Test plan

- **New file**: `src/lib/sticky-lead-dock.test.ts`
- **Cases**: dock boolean matrix; stuck geometry; motion action matrix including reduceMotion and mid-phase cancel
- **Pattern**: `src/lib/photo-lightbox.test.ts`
- **Not required**: Playwright/e2e. Manual Step 6 covers animation integration.
- **Verification**: `pnpm test -- src/lib/sticky-lead-dock.test.ts` then `pnpm test` → all pass

## Done criteria

Machine-checkable. ALL must hold:

- [ ] `pnpm test -- src/lib/sticky-lead-dock.test.ts` exits 0
- [ ] `pnpm test` exits 0
- [ ] `pnpm build` exits 0
- [ ] `rg -n "shouldDockStickyLead" src/lib/sticky-lead-dock.ts` matches
- [ ] `rg -n "nextStickyLeadMotionAction" src/lib/sticky-lead-dock.ts` matches
- [ ] `rg -n "tuki-sticky-lead-enter" src/styles/motion.css` matches
- [ ] `rg -n "tuki-sticky-lead-exit" src/styles/motion.css` matches
- [ ] `rg -n "data-sticky-lead-slot" src/components/sections/ContentWithCarousel.astro` matches
- [ ] `rg -n "data-sticky-lead-panel" src/components/sections/LeadCaptureSection.astro` matches
- [ ] `rg -n "data-sticky-lead-release" src/components/sections/BenefitsList.astro` matches
- [ ] `rg -n "id=\"formulario\"" src/components/sections/LeadCaptureSection.astro` matches
- [ ] No second LeadForm instance in Astro templates under the carousel
- [ ] Enter/exit are not optional comments — classes are toggled from the script
- [ ] No files outside the in-scope list are modified (`git status`)
- [ ] `plans/README.md` status row updated to DONE (or IN PROGRESS while working)

## STOP conditions

Stop and report back (do not improvise) if:

- Drift check shows sticky carousel / lead section structure no longer matches Current state excerpts.
- A correct dock appears to require cloning the form or changing lead submit IDs.
- LeadCaptureSection is not present on a page that has ContentWithCarousel (unexpected layout) — report which route.
- Stuck detection cannot be made reliable without removing `lg:sticky` from the carousel (sticky must remain).
- Animation cannot complete without remounting the form (losing input state) — report; do not remount.
- `pnpm build` fails for reasons unrelated to these files (env secrets, etc.) — report the error; still leave unit tests green.
- Fix appears to require editing out-of-scope tracking/API files or adding an animation library.

## Maintenance notes

- Any new layout that uses `ContentWithCarousel` + page-level `LeadCaptureSection` + optional `BenefitsList` inherits this behavior via data attributes — keep markers stable.
- If sticky top class changes from `top-28`, update the stuck-detection offset constant in the script.
- If enter/exit timing changes, update both `motion.css` and the script timeout fallbacks together.
- Reviewers should check: single panel node; enter plays only after node is in the slot; exit completes before node returns home; mid-scroll cancel does not leave `opacity: 0` permanently; reduced-motion path; form still submits after dock/undock cycles; focus not destroyed by remount (move only).
- Deferred: compact dock-only form layout; analytics on dock visibility.
