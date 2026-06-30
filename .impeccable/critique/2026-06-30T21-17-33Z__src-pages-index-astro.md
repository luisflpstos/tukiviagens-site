---
target: home
total_score: 24
p0_count: 2
p1_count: 2
timestamp: 2026-06-30T21-17-33Z
slug: src-pages-index-astro
---
Method: dual-agent (A: 4a8be269-2c13-4856-b0f4-81892ac275e4 · B: 309ed14a-4a1c-44e3-ba34-4328957de107)

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 2 | No loading states for images; WhatsApp opens externally with no "what happens next" preview |
| 2 | Match System / Real World | 2 | `contato@tukiviagens.com.br` undermines Tuki brand; hotel photos don't match named resorts |
| 3 | User Control and Freedom | 3 | Skip link + anchor nav good; mobile menu has no explicit close |
| 4 | Consistency and Standards | 3 | Design tokens consistent; CTA language varies across sections |
| 5 | Error Prevention | 2 | "A partir de R$ X" without dates/nights/pax invites misinterpretation |
| 6 | Recognition Rather Than Recall | 3 | Destination icons aid scanning; Rio/Gramado/Pacotes Brasil all route to same URL |
| 7 | Flexibility and Efficiency | 2 | No search, filter, or family/budget shortcuts for repeat visitors |
| 8 | Aesthetic and Minimalist Design | 2 | ~10 sections, duplicate mascot beats, redundant trust claims |
| 9 | Error Recovery | 3 | Static marketing page — limited failure modes; contact fallbacks exist |
| 10 | Help and Documentation | 2 | No FAQ or "como funciona" before high-commitment WhatsApp |
| **Total** | | **24/40** | **Acceptable — significant improvements needed** |

## Anti-Patterns Verdict

**LLM assessment:** Leaning yes — a sharp eye would suspect template/AI assembly, though custom Tuki mascot and 3D icons prevent a full generic-SaaS read. Hero stat row (`+12 mil` / `120+` / `24h`), stock Unsplash imagery, identical card grids, purple gradient CTA box, and synthetic testimonials are the strongest tells. Mitigated by: no cream/beige bg, no gradient text, Portuguese warm voice, faithful purple/orange palette.

**Deterministic scan:** `index.astro` and all 14 section files — **0 findings**. Inherited from `BaseLayout.astro`: `overused-font` (Inter) and `single-font` (false positive — Nunito loads via CSS). Rendered HTML fallback found 15 items, mostly Tailwind bundle noise; true positives: `#1f1545` ink vs DESIGN.md `#201E1E`, undocumented `#f4f1ff` lavender, `#25D366` WhatsApp green.

**Visual overlays:** Browser MCP unavailable in this session. No reliable user-visible overlay. Assessment based on source review + live HTML curl.

## Overall Impression

The home has real brand bones — purple hero, Tuki mascot, custom 3D destination icons — but reads like a polished AI travel template when you scroll. The biggest gap isn't color or typography; it's **trust evidence**. Stock photos contradict "passou pelo crivo Tuki," hero stats feel like Booking metrics, and seven WhatsApp exits appear before the page explains who you're talking to or how booking works.

## What's Working

1. **Brand system execution** — `#4B14AE` / `#FC7B04`, Nunito on H1–H3, custom Tuki icons in destinations and WhyTuki feel owned.
2. **Hero composition** — Photo + purple overlay + mascot ring + destination badges orient Brazilian family travelers fast.
3. **Trust infrastructure present** — Cadastur in footer, HERO_EYEBROW trust signal, TRUST_ITEMS pills, pre-filled WhatsApp quotes per hotel.

## Priority Issues

### [P0] Stock imagery contradicts "curadoria" promise
- **Why:** Marina decides on trust before WhatsApp; generic pools/beaches undercut "Visitamos, avaliamos e negociamos."
- **Fix:** Replace hero and all 6 hotel cards with real property photography.
- **Suggested command:** `/impeccable polish home`

### [P0] Hero stats row reads SaaS, not family agency
- **Why:** Direct anti-reference hit; feels marketplace growth metrics, not "sua consultora em Olímpia."
- **Fix:** Swap for emotional/trust signals (rating, "famílias atendidas") or remove row.
- **Suggested command:** `/impeccable quieter home`

### [P1] WhatsApp ladder missing for trust-first personas
- **Why:** 7+ WhatsApp touchpoints with no intermediate step; abrupt external jump feels high-risk for R$2k+ family trip.
- **Fix:** Add compact "Como funciona" (3 steps); show consultant; move Cadastur near first CTA.
- **Suggested command:** `/impeccable shape home`

### [P1] Legacy brand leak in final CTA
- **Why:** `contato@tukiviagens.com.br` in CtaSection is instant credibility hit.
- **Fix:** Tuki-branded email or remove email CTA until migrated.
- **Suggested command:** `/impeccable clarify home`

### [P2] MascotSection duplicates Hero emotional beat
- **Why:** Page length without new information; mobile scroll fatigue before testimonials.
- **Fix:** Merge into Hero or replace with family story carousel.
- **Suggested command:** `/impeccable distill home`

## Persona Red Flags

**Jordan (first-timer):** No "como funciona"; Rio/Gramado/Pacotes Brasil all link to same URL; "Cotar com consultor" with no consultant intro; prices unexplained.

**Casey (mobile):** WhatsAppFab + header WhatsApp duplicate; marquee animation noise; long scroll before filter; hero badges may clip on narrow widths.

**Marina (mom, resort trip):** Testimonials lack family/Olímpia specificity; "Curado Tuki" badge vs generic photos; Cadastur buried in footer; "12x sem juros" without footnote; no kids imagery.

## Minor Observations

- Hero eyebrow uses uppercase tracking pill with backdrop-blur
- PartnersStrip text-only vs reference grayscale logos
- Missing reference wave divider and benefits bar below marquee
- WhyTuki duplicates TRUST_ITEMS content
- `prefers-reduced-motion` doesn't stop marquee/float animations
- Token drift: `--color-tuki-ink` `#1f1545` vs DESIGN.md `#201E1E`

## Questions to Consider

1. If every hotel photo is Unsplash, what exactly did Tuki "visit and evaluate"?
2. The page asks for commitment seven times but explains the process zero times — travel agency or WhatsApp launcher?
3. Tuki has genuine personality, then repeats in a second purple section — guide or wallpaper?
