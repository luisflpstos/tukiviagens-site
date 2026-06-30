---
target: home
total_score: 30
p0_count: 1
p1_count: 2
timestamp: 2026-06-30T20-05-49Z
slug: src-pages-index-astro
---
Method: dual-agent (A: 72a811ff-c57f-446a-843a-f6d89358755d · B: 9a7498a5-a716-4f41-8c6e-76ea78d9ce6d)

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Skip link + sticky header; no post-WhatsApp feedback |
| 2 | Match System / Real World | 3 | Honest hotel copy; undermined by placeholder phone and stock photos |
| 3 | User Control and Freedom | 3 | Anchor nav + FAB; still 9 sections long |
| 4 | Consistency and Standards | 3 | WhatsApp-first aligned; CTA shows phone number vs label elsewhere |
| 5 | Error Prevention | 3 | Placeholder phone routes users nowhere; "2 min" overpromises |
| 6 | Recognition Rather Than Recall | 2 | Trust themes repeat across hero, marquee, WhyTuki |
| 7 | Flexibility and Efficiency | 3 | 6 properties; no filters; vague "Nordeste" aggregate card |
| 8 | Aesthetic and Minimalist Design | 3 | Eyebrows cut, ghost cards fixed; WhyTuki still dense |
| 9 | Error Recovery | 3 | n/a static LP; no on-page FAQ |
| 10 | Help and Documentation | 3 | Footer cadastro + installment note; no on-page FAQ |
| **Total** | | **30/40** | **Good — solid foundation, polish before ad traffic** |

## Anti-Patterns Verdict

**LLM assessment: Branded template with honest intent — no longer deceitful slop.**

Pre-fix was borderline template slop at 26/40 with fake 4.9★, "Consulte", and eyebrow spam. Post-fix removed the deceit layer. Remaining tells: SaaS hero metrics without proof, repeated H2+card grids, stock Unsplash imagery, emoji destinations, perfect 5★ testimonials, StarDecoration repetition.

**Deterministic scan:** `detect.mjs` returned `[]` across 16 scoped files. Detector clean on source. Built HTML scan would flag Inter as overused-font (design opinion, not a11y defect).

**Browser overlays:** Not available. Markup reviewed from `dist/index.html`.

**Delta:** 26/40 → **30/40** (+4). Fake ratings gone, WhatsApp-first, 6-property catalog, eyebrows removed.

## Overall Impression

The fixes worked where they mattered most: conversion trust and mobile WhatsApp path. The page reads as a consultative Brazilian travel agency, not a marketplace template. The single biggest remaining blocker is **placeholder contact data** — it breaks the funnel at click time. Second: **visual honesty** (stock photos vs "visitamos, avaliamos" copy).

## What's Working

1. **WhatsApp-first conversion** — Header, hero primary CTA, per-hotel cotar, mobile FAB.
2. **Honest hotel cards** — Curado Tuki, desde prices, 12x note, consultor CTA.
3. **Structural cleanup** — Benefits removed, eyebrows cut, ghost shadows fixed, 6-property grid.

## Priority Issues

### [P0] Placeholder phone breaks the funnel
- **What:** `5517999999999` / `(17) 99999-9999` in constants, CTA, footer.
- **Why:** Every WhatsApp tap fails; "resposta em 2 min" feels like golpe.
- **Fix:** Real número before ad traffic; soften CTA until live.
- **Command:** `/impeccable harden constants`

### [P1] Unverified hero metrics
- **What:** +12 mil / 120+ / 24h stat row in Hero.
- **Why:** SaaS vanity pattern; unsubstantiated skepticism at first scroll.
- **Fix:** One verifiable proof line or remove row.
- **Command:** `/impeccable distill Hero`

### [P1] Stock imagery vs curadoria claim
- **What:** Unsplash on hero and all 6 hotel cards.
- **Why:** Copy says "visitamos, avaliamos"; visuals say template.
- **Fix:** Wire CMS images per property; real hero photo.
- **Command:** `/impeccable polish HotelsGrid`

### [P2] WhyTuki trust overload
- **What:** 4 benefits + 4 trust pills + 4 cards in one section.
- **Why:** 12 trust items without new information.
- **Fix:** Keep benefits OR pills, not both; cut cards to 2.
- **Command:** `/impeccable distill WhyTuki`

### [P2] Indicative prices lack context
- **What:** Hardcoded desde in constants without pax/nights/regime.
- **Why:** Meta traffic expects "2 adultos + 1 criança, 3 diárias".
- **Fix:** Microcopy on cards; sync from CMS.
- **Command:** `/impeccable clarify HotelsGrid`

## Persona Red Flags

**Jordan:** WhyTuki has 12 trust items, no "start here." Hero badges look clickable but aren't.

**Casey:** Mascot still eats ~40% of first viewport. Nine sections to scroll. WhyTuki is a long thumb marathon.

**Marina:** Improved desde/cotar/cadastro. Still fails on placeholder phone, stock photos vs ad creative, no "família/crianças" above fold.

## Questions to Consider

- Should Meta ad traffic land on property LPs instead of generic home?
- Where is the line between marketing confidence and theater (hero stats vs removed fake 4.9)?
- Would 5 sections (Hero → Hotels → Trust → Testimonials → CTA) feel empty or faster for Marina?
