# Plan 002: Fit docked sticky lead form fully on short desktop viewports

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md` — unless a reviewer dispatched you and told you they
> maintain the index.
>
> **Drift check (run first)**: `git diff --stat b2ef518..HEAD -- src/styles/motion.css src/styles/global.css src/components/sections/StickyLeadCapture.astro src/components/common/LeadCompactForm.astro src/components/sections/ContentWithCarousel.astro src/scripts/sticky-lead-dock.ts src/lib/sticky-lead-dock.ts src/lib/sticky-lead-dock.test.ts`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P1
- **Effort**: S
- **Risk**: LOW
- **Depends on**: plans/001-sticky-carousel-lead-dock.md (DONE — dock behavior already shipped)
- **Category**: bug
- **Planned at**: commit `b2ef518`, 2026-07-16

## Why this matters

On desktop, the compact lead form docks under the sticky photo carousel. On short laptop viewports (below ~1200×800, and still tight near 1440×1000), the carousel + form stack is taller than the visible area under `lg:top-28`, so the form is clipped — often only the title shows. The current dock safety rule (`max-height: calc(100vh - 9rem); overflow-y: auto` on the panel) does **not** reserve space for the carousel, so the scrollable region is a thin strip at the bottom of the screen. Conversion fields and the submit button are hard to use. Shrinking the **docked** form (and, when needed, the carousel height budget) so the full form stays in-viewport on desktop restores the conversion surface without changing mobile (dock never activates below 1024px; `LeadCaptureSection` / full `LeadForm` stay untouched).

## Current state

Relevant files:

- `src/components/sections/StickyLeadCapture.astro` — parking host + panel markup (`tuki-surface-panel`, headline, subtitle, `LeadCompactForm`).
- `src/components/common/LeadCompactForm.astro` — compact fields (nome / telefone / email + submit). Used **only** by `StickyLeadCapture`.
- `src/components/sections/ContentWithCarousel.astro` — sticky column (`lg:sticky lg:top-28`) + carousel + `[data-sticky-lead-slot]`.
- `src/components/common/PhotoCarousel.astro` — main image uses `aspect-[4/3]`; nav row adds ~60px below the image.
- `src/scripts/sticky-lead-dock.ts` — docks panel only when `matchMedia('(min-width: 1024px)')`; toggles class `is-sticky-lead-docked` on the panel.
- `src/styles/motion.css` — enter/exit animations **and** the current dock height rule (layout misplaced next to motion).
- `src/styles/global.css` — `.tuki-surface-panel` (`p-8 md:p-10`), `.tuki-input` (`py-3`), type scale (`.tuki-type-headline` ≈ clamp 1.875–2.25rem).
- `src/components/sections/LeadCaptureSection.astro` + `LeadForm.astro` — **mobile / footer conversion**; out of scope.
- Package manager: **pnpm**. Tests: `pnpm test`. Build: `pnpm build`. No separate lint/typecheck scripts.

Measured on `/hoteis/enjoy-solar-das-aguas/` with form docked (2026-07-16, commit `b2ef518`):

| Viewport | Carousel H | Space under carousel | Panel H | Submit clipped? |
|----------|------------|----------------------|---------|-----------------|
| 1100×750 | ~407px | ~231px | ~471px | yes |
| 1200×800 | ~431px | ~257px | ~449px | yes |
| 1440×1000 | ~431px | ~457px | ~449px | no (panel still ~16px over) |

Panel height breakdown at 1100×750 (approx): padding 40+40, headline ~40, subtitle ~51, `mt-6` 24, form ~266 (inputs ~50×3, button ~48, status ~20) → **~471px**. Available under carousel ≈ **230px**. Density alone (~260–280px target) is necessary but **not sufficient** on the shortest heights — carousel image area must also accept a max-height budget when the form is docked.

Sticky column + panel today:

```12:20:src/components/sections/ContentWithCarousel.astro
<section class="section-padding" data-sticky-lead-root>
	{/* Sentinel: dock phase starts when this leaves the top — independent of sticky column height. */}
	<div data-sticky-lead-sentinel class="pointer-events-none h-px w-full" aria-hidden="true"></div>
	<div class="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
		<div class="grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-12">
			<div class="lg:sticky lg:top-28" data-sticky-lead-column>
				<PhotoCarousel images={images} label={label} />
				<div data-sticky-lead-slot class="mt-6 hidden lg:block" aria-hidden="true"></div>
```

```29:43:src/components/sections/StickyLeadCapture.astro
<div data-sticky-lead-home class="hidden" hidden>
	<div class="tuki-surface-panel" data-sticky-lead-panel>
		<h2 class="tuki-type-headline text-tuki-ink">{title}</h2>
		<p class="tuki-type-body mt-2 text-tuki-muted">{subtitle}</p>
		<div class="mt-6">
			<LeadCompactForm
				formId={formId}
				...
			/>
		</div>
	</div>
</div>
```

Broken dock constraint (ignores carousel):

```207:210:src/styles/motion.css
.is-sticky-lead-docked {
	max-height: calc(100vh - 9rem);
	overflow-y: auto;
}
```

Desktop-only dock gate (must remain true — this is why mobile is safe):

```8:8:src/scripts/sticky-lead-dock.ts
const DESKTOP_MQ = '(min-width: 1024px)';
```

```7:8:src/lib/sticky-lead-dock.ts
export function shouldDockStickyLead(input: StickyLeadDockStateInput): boolean {
	return input.isDesktop && input.isStickyStuck && !input.isReleaseVisible;
```

Conventions to match:

- Pure logic in `src/lib/*.ts` + Vitest; DOM in `src/scripts/*.ts` (see existing `sticky-lead-dock` pair).
- Visual tokens / utilities in `src/styles/global.css`; keep **animation** keyframes in `motion.css`.
- Prefer scoping docked visuals with `.is-sticky-lead-docked` (and column `:has(...)`) over changing shared components used elsewhere.
- Operator constraints: use **pnpm**; do **not** create branches/worktrees; do **not** commit or push unless explicitly asked.

## Commands you will need

| Purpose | Command | Expected on success |
|---------|---------|---------------------|
| Install | `pnpm install` | exit 0 |
| Tests | `pnpm test` | all pass |
| Sticky dock unit tests | `pnpm test -- src/lib/sticky-lead-dock.test.ts` | all pass |
| Build | `pnpm build` | exit 0 |
| Dev (manual visual) | `pnpm run dev` | serves locally (usually `:4321`) |

## Suggested executor toolkit

- Use browser tools (Cursor browser / DevTools) to verify docked form at the viewports listed in Done criteria.
- Do **not** use the `impeccable` skill to redesign the form — this is a density/fit fix inside the existing sticky dock pattern.

## Scope

**In scope** (the only files you should modify):

- `src/styles/global.css` — docked density + short-viewport carousel budget (preferred home for layout)
- `src/styles/motion.css` — remove or slim the obsolete `.is-sticky-lead-docked` layout rule (keep enter/exit animations)
- `src/components/sections/StickyLeadCapture.astro` — only if a small markup hook is required for density (e.g. `data-sticky-lead-subtitle` on the subtitle `<p>`); prefer CSS-only
- `src/components/sections/ContentWithCarousel.astro` — only if slot margin must change via a class hook (prefer CSS `:has(.is-sticky-lead-docked)` on the column/slot)
- `src/lib/sticky-lead-dock.ts` + `src/lib/sticky-lead-dock.test.ts` — **only if** you add a pure helper for viewport budget / density breakpoints (optional; skip if CSS-only)
- `src/scripts/sticky-lead-dock.ts` — **only if** you need a column class toggle; prefer CSS `:has(.is-sticky-lead-docked)` and avoid script changes

**Out of scope** (do NOT touch):

- Mobile layout / breakpoints below 1024px behavior
- `LeadCaptureSection.astro`, `LeadForm.astro`, contact page forms
- Dock/undock motion timing, IntersectionObserver logic, teleport algorithm (unless a STOP forces a report)
- Carousel lightbox, dots behavior, image assets
- `plans/001-*.md` content (historical)

## Git workflow

- Stay on the current branch; do **not** create a new branch or worktree.
- Do **not** commit or push unless the operator explicitly asks.
- If the operator later asks for a commit, message style matches recent log, e.g. `fix: keep docked sticky lead form visible on short desktop viewports`.

## Steps

### Step 1: Confirm RED — characterize the clip with a failing automated check where feasible

Add a small pure helper **only if** you will use it from CSS/JS coordination. Preferred minimal TDD path for this visual bug:

1. Extend `src/lib/sticky-lead-dock.ts` with a pure budget helper used to document the acceptance math (and optionally by future script logic — not required for CSS-only fix):

```ts
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
```

2. In `src/lib/sticky-lead-dock.test.ts`, add cases that lock the measured reality and the target:

- At `viewportHeightPx: 750`, `stickyTopPx: 112`, `carouselHeightPx: 407`, `slotGapPx: 24` → budget `207` (current cramped reality).
- Assert that a **target docked panel height** of `280` does **not** fit that budget (`280 > 207`) — documents why carousel must also shrink.
- At a post-fix scenario: `carouselHeightPx: 280`, `slotGapPx: 12`, panel target `280` → budget `≥ 280` (750 − 112 − 280 − 12 = 346 ≥ 280).

3. Keep existing mobile dock tests green (`isDesktop: false` → no dock).

**Verify**: `pnpm test -- src/lib/sticky-lead-dock.test.ts` → new tests pass (helper) / if you intentionally write the “target height must fit measured budget” as a temporarily failing assertion against production CSS, do **not** leave the suite red — encode the math as documentation tests on the helper, then implement CSS in Step 2–3 so browser Done criteria pass.

> If you prefer a CSS-only fix with zero new TS, you may skip the helper and instead add a short comment block above the new CSS citing the measured budgets. In that case, rely on existing `shouldDockStickyLead` mobile test + browser Done criteria. Prefer the helper — it is cheap and prevents the next person from “fixing” max-height alone again.

### Step 2: Move dock layout out of motion.css and implement docked density

1. In `src/styles/motion.css`, **remove** the layout block:

```css
.is-sticky-lead-docked {
	max-height: calc(100vh - 9rem);
	overflow-y: auto;
}
```

Keep `.tuki-sticky-lead-enter` / `.tuki-sticky-lead-exit` / `.tuki-sticky-lead-pending` untouched.

2. In `src/styles/global.css` (near `.tuki-surface-panel` is ideal), add **desktop-scoped** docked density. All rules must be nested under `@media (min-width: 1024px)` so they cannot affect mobile even if the class were present.

Target visual density for `.is-sticky-lead-docked` (approximate; tune to meet Done criteria):

| Element | Current | Docked target |
|---------|---------|---------------|
| Panel padding | `p-8` / `md:p-10` (32–40px) | ~12–16px |
| Panel radius | `rounded-3xl` | `1rem` ok |
| Title | `.tuki-type-headline` (~1.875rem+) | `var(--text-title)` (1.125rem), weight 700–800 |
| Subtitle | `.tuki-type-body` + `mt-2` | **hide** (`display: none`) or single-line caption; hiding is preferred on short heights |
| Form wrapper `mt-6` | 24px | 8–12px |
| Form vertical rhythm | `space-y-4` | ~8px between blocks |
| Inputs `.tuki-input` | `px-4 py-3` (~50px tall) | `px-3 py-2`, `font-size: var(--text-small)`, slightly smaller radius |
| Labels | `.tuki-type-small` + `mb-1` | keep readable; `mb-0.5` ok |
| Submit | `py-3` + `rounded-full` | `py-2`, keep brand orange |
| Status `min-h-5` | 20px | `min-h-0` when empty is fine via CSS if possible |

Example shape (executor may adjust values, not structure):

```css
@media (min-width: 1024px) {
	.is-sticky-lead-docked {
		padding: 0.75rem 1rem;
		border-radius: 1rem;
		/* safety net only — primary goal is natural height fitting the budget */
		max-height: min(100%, calc(100dvh - 7rem));
		overflow-x: hidden;
		overflow-y: auto;
	}

	.is-sticky-lead-docked > h2 {
		font-size: var(--text-title);
		line-height: var(--leading-title);
		letter-spacing: normal;
	}

	.is-sticky-lead-docked > p {
		display: none;
	}

	.is-sticky-lead-docked > div {
		margin-top: 0.5rem;
	}

	.is-sticky-lead-docked form {
		gap: 0.5rem;
	}

	.is-sticky-lead-docked form > :not([hidden]) + :not([hidden]) {
		margin-top: 0.5rem; /* overrides Tailwind space-y-4 child margins */
	}

	.is-sticky-lead-docked .tuki-input {
		padding: 0.5rem 0.75rem;
		border-radius: 0.75rem;
		font-size: var(--text-small);
	}

	.is-sticky-lead-docked button[type='submit'] {
		padding-top: 0.5rem;
		padding-bottom: 0.5rem;
	}

	.is-sticky-lead-docked [data-form-status] {
		min-height: 0;
	}
}
```

**Verify**: `pnpm test -- src/lib/sticky-lead-dock.test.ts` still passes. Spot-check in browser at 1440×1000 that docked form looks denser and submit is visible.

### Step 3: Cap carousel height when the form is docked on short viewports

Density alone cannot fit ~280px form into ~207px. When the sticky column contains a docked panel, constrain the carousel image box on short desktop heights.

Use `:has()` (already fine for this site’s modern Astro/Tailwind stack):

```css
@media (min-width: 1024px) {
	[data-sticky-lead-column]:has(.is-sticky-lead-docked) [data-sticky-lead-slot] {
		margin-top: 0.75rem; /* was mt-6 */
	}

	[data-sticky-lead-column]:has(.is-sticky-lead-docked) .photo-carousel .aspect-\[4\/3\],
	[data-sticky-lead-column]:has(.is-sticky-lead-docked) .photo-carousel [class*='aspect-'] {
		max-height: clamp(10rem, 32vh, 18rem);
	}
}

/* Extra-tight laptops */
@media (min-width: 1024px) and (max-height: 800px) {
	[data-sticky-lead-column]:has(.is-sticky-lead-docked) .photo-carousel .aspect-\[4\/3\],
	[data-sticky-lead-column]:has(.is-sticky-lead-docked) .photo-carousel [class*='aspect-'] {
		max-height: clamp(9rem, 28vh, 14rem);
	}
}
```

Notes for the executor:

- Prefer selecting the real aspect wrapper in `PhotoCarousel.astro` (`class="aspect-[4/3]"`). If the escaped selector is fragile with Tailwind’s generated class name, add a stable hook on that div, e.g. `data-carousel-stage`, and select `[data-carousel-stage]` instead (small markup change in `PhotoCarousel.astro` then becomes in-scope — update Scope mentally and only touch that one attribute).
- Images use `object-cover` — cropping when max-height binds is acceptable.
- Do **not** change carousel behavior below 1024px.

**Verify** (browser, form docked after scrolling past sentinel):

1. Viewport **1100×750**: panel fully in view; submit button `getBoundingClientRect().bottom <= innerHeight`.
2. Viewport **1200×800**: same.
3. Viewport **1440×900** (or 1440×1000): form still complete; carousel not excessively tiny (image still readable).
4. Viewport **390×844** (mobile): scroll the gallery area — panel must **not** receive `is-sticky-lead-docked`; sticky slot stays `hidden` / empty; footer `LeadCaptureSection` unchanged.

Optional CDP snippet after scroll:

```js
(() => {
  const panel = document.querySelector('[data-sticky-lead-panel]');
  const submit = panel?.querySelector('button[type="submit"]');
  const pr = panel?.getBoundingClientRect();
  const sr = submit?.getBoundingClientRect();
  return {
    docked: panel?.classList.contains('is-sticky-lead-docked'),
    panelBottom: pr?.bottom,
    submitBottom: sr?.bottom,
    vh: innerHeight,
    ok: !!sr && sr.bottom <= innerHeight + 1,
  };
})()
```

Expected at 1100×750 / 1200×800: `{ docked: true, ok: true }`.

### Step 4: Regression suite + build

**Verify**:

- `pnpm test -- src/lib/sticky-lead-dock.test.ts` → pass
- `pnpm test` → pass
- `pnpm build` → pass
- `git status` → only in-scope files changed

### Step 5: Update plan index

Set this plan’s row in `plans/README.md` to `DONE` (or `BLOCKED` with reason).

## Test plan

- **Unit** (`src/lib/sticky-lead-dock.test.ts`):
  - Existing: `shouldDockStickyLead` false when `isDesktop: false` (must remain).
  - New (if helper added): `stickyLeadPanelBudgetPx` math for 750/800-style budgets; documents that carousel shrink is required when panel target is ~280.
- **Manual / browser** (required — CSS fit is the behavior):
  - Desktop short: 1100×750 and 1200×800 on a gallery page (`/hoteis/enjoy-solar-das-aguas/` or any `PageLayout`/`HotelLayout` page with carousel) — docked form fully visible including submit.
  - Desktop tall: ≥1440×900 — still looks intentional (dense but not crushed).
  - Mobile: width &lt; 1024 — no docked panel; no visual change to footer lead form.
- Pattern exemplar for unit tests: existing cases in `src/lib/sticky-lead-dock.test.ts`.

## Done criteria

Machine-checkable / observable. ALL must hold:

- [ ] `pnpm test -- src/lib/sticky-lead-dock.test.ts` exits 0
- [ ] `pnpm test` exits 0
- [ ] `pnpm build` exits 0
- [ ] `.is-sticky-lead-docked { max-height: calc(100vh - 9rem); }` no longer exists in `src/styles/motion.css` (`rg "100vh - 9rem" src/styles` → no matches)
- [ ] New docked density rules live under `@media (min-width: 1024px)` in `src/styles/global.css` (or equivalent desktop gate)
- [ ] Browser: docked form at **1100×750** and **1200×800** — submit button fully inside the viewport (no clip)
- [ ] Browser: width **&lt; 1024** — panel is not docked (`is-sticky-lead-docked` absent while scrolling content); `LeadCaptureSection` / `LeadForm` files unmodified
- [ ] No files outside the in-scope list are modified (`git status`)
- [ ] `plans/README.md` status row for 002 updated

## STOP conditions

Stop and report back (do not improvise) if:

- The code at the locations in "Current state" doesn't match the excerpts (drift since `b2ef518`).
- Fitting the form requires changing dock/undock JS state machine beyond a trivial class toggle, or requires duplicating the form in the DOM.
- Meeting the viewport Done criteria requires destroying carousel usability (e.g. image stage &lt; ~8rem) — report measured heights and ask for product tradeoff (hide carousel while docked vs. allow internal scroll).
- A step’s verification fails twice after a reasonable fix attempt.
- You are tempted to edit `LeadCaptureSection.astro` / `LeadForm.astro` / mobile nav — that is out of scope; stop.

## Maintenance notes

- Any future fields added to `LeadCompactForm` increase docked height — re-check 1100×750 after adding inputs.
- If sticky offset changes from `lg:top-28` (7rem), update the CSS `7rem` budget and the helper’s `stickyTopPx` examples together.
- Reviewers should confirm: (1) rules gated by `min-width: 1024px`, (2) subtitle hide only when docked, (3) footer full form unchanged on mobile screenshots.
- Deferred: container queries based on sticky column width; optional JS `ResizeObserver` to set `--sticky-lead-budget` — not needed if CSS max-height + density meet Done criteria.
