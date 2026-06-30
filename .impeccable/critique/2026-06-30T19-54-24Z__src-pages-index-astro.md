---
target: home
total_score: 26
p0_count: 2
p1_count: 2
timestamp: 2026-06-30T19-54-24Z
slug: src-pages-index-astro
---
Method: dual-agent (A: 7e96dbec-48d6-41bb-a30b-6890ddf18654 · B: 6f94dc3c-0225-421f-9f7d-ab02e5b26d15)

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Static LP; no feedback after WhatsApp tap; marquee animates without pause control |
| 2 | Match System / Real World | 2 | Hardcoded 4.9★ on every hotel; all prices "Consulte"; partner pills without logos |
| 3 | User Control and Freedom | 3 | Anchor nav works; long 10-section scroll; no sticky escape hatch |
| 4 | Consistency and Standards | 2 | Header "Embarcar" → /contato vs hero WhatsApp; "Reservar" vs consultative agency model |
| 5 | Error Prevention | 3 | Few form errors; dead social `href="#"`; some destinations route to generic hub |
| 6 | Recognition Rather Than Recall | 3 | Home anchor nav is good; trust claims repeated across sections |
| 7 | Flexibility and Efficiency | 2 | No filters; sparse CMS catalog (2 properties) vs 6-card grid expectation |
| 8 | Aesthetic and Minimalist Design | 2 | Eyebrow + H2 + card grid repeated 5×; four trust passes before CTA |
| 9 | Error Recovery | 3 | n/a for static LP; no FAQ if user's resort isn't listed |
| 10 | Help and Documentation | 2 | No CNPJ/cadastro signal; vague payment guidance; no on-page FAQ |
| **Total** | | **26/40** | **Acceptable — significant improvements needed before users are happy** |

## Anti-Patterns Verdict

**LLM assessment: Borderline AI slop — "reference-faithful template," not cream-beige slop.**

The page avoids the worst anti-references (no warm cream body, committed purple/orange, real mascot assets, Nunito display). But structural tells remain:

- **Eyebrows everywhere** — 6× `SectionEyebrow` plus hero pill, partners label, and marquee caps (explicit ban in PRODUCT.md)
- **Identical card grids** — trust pills → destination cards → hotel cards → 2×2 benefit cards → testimonial cards
- **SaaS hero metrics** — +12 mil / 4.9★ / 120+ stat row
- **Marketplace rating theater** — hardcoded 4.9 on every hotel card
- **Ghost cards** — `.tuki-card-ref` uses border + 16px/40px shadow, violating DESIGN.md Flat/No-Ghost rules
- **Stock hero** — Unsplash beach, not curated Brazil/family resort photography

Personality comes from mascot and copy tone, not layout courage. Reads closer to startup travel template than Nubank-warm consultative agency.

**Deterministic scan:** `detect.mjs` returned `[]` — zero rule findings across 16 home files. The automated detector did not flag eyebrow repetition, ghost cards, or fake ratings; those are judgment calls the LLM review caught.

**Browser overlays:** Not available — browser automation unavailable in this session. Assessment B used `curl` markup review only. No reliable user-visible overlay.

**Markup signals from curl:** Heading skip (h1 → h3 in Benefits before first h2); no skip-to-main link; 3 decorative empty alts (hero bg, logo, plane icon — intentional).

## Overall Impression

Strong brand color and mascot work deliver "O Guia Colorido." Copy sounds Brazilian and familial. But conversion trust is undermined by marketplace UI patterns (fake stars, "Consulte" everywhere) on a consultative agency page. The single biggest opportunity: align trust signals and mobile conversion path with how Brazilian families actually book via WhatsApp — and cut structural repetition that screams template.

## What's Working

1. **Committed palette** — Hero photo + purple overlay, orange marquee, mascot block, and orange CTAs read distinctly Tuki, not Decolar-gray.
2. **Copy tone** — Tagline, testimonials ("Olímpia com a família"), and `HOTELS_DESCRIPTION` feel consultative and warm.
3. **Structural hygiene** — Section IDs for anchor nav, semantic hero stats `<dl>`, `prefers-reduced-motion` on ticker, UTM capture in layout.

## Priority Issues

### [P0] Hardcoded 4.9★ on every hotel card
- **What:** `HotelsGrid.astro` shows identical ★ 4.9 badge on all properties.
- **Why it matters:** Marketplace deceit pattern; destroys "confiável" for moms comparing paid ads.
- **Fix:** Remove unless tied to real review data; replace with "Curado Tuki" or property-specific CMS field.
- **Suggested command:** `/impeccable clarify HotelsGrid`

### [P0] "Consulte" kills price anchoring
- **What:** `index.astro` maps all properties to `price: 'Consulte'`.
- **Why it matters:** Paid-ad traffic expects "a partir de R$ X" or parcelamento; no anchor = bounce to competitors.
- **Fix:** Surface `desde` ranges from content frontmatter; show installment line on cards.
- **Suggested command:** `/impeccable clarify HotelsGrid`

### [P1] Eyebrow fatigue
- **What:** `SectionEyebrow` on 6 sections plus hero pill, partners label, marquee caps.
- **Why it matters:** Explicit anti-reference in PRODUCT.md/DESIGN.md; page reads as AI landing scaffold.
- **Fix:** Keep max 2 eyebrows (hero + one section); let H2s carry hierarchy elsewhere.
- **Suggested command:** `/impeccable quieter home`

### [P1] Header CTA wrong for mobile conversion
- **What:** `Embarcar` → `/contato`, hidden below `md:`; reference JSON expects WhatsApp in header.
- **Why it matters:** Marina/Casey on phone need one-tap WhatsApp, not contact form funnel.
- **Fix:** Header primary = WhatsApp deep link; visible on all breakpoints; consider sticky FAB.
- **Suggested command:** `/impeccable polish Header`

### [P2] Trust section redundancy
- **What:** Marquee + Benefits + Hero stats + WhyTuki all repeat pagamento/curadoria/atendimento.
- **Why it matters:** Cognitive load without new information; page feels longer than it is.
- **Fix:** Merge Benefits into WhyTuki or cut marquee to 3 items; replace hero stats with one proof line.
- **Suggested command:** `/impeccable distill home`

## Persona Red Flags

**Jordan (First-Timer):** Two competing hero CTAs ("Escolher viagem" vs "Tirar minha dúvida") — unclear if browse or talk first. "Reservar" sounds like instant booking, not agência consultiva. Only 2 live property cards — catalog feels empty.

**Casey (Mobile):** Primary header CTA hidden until hamburger menu. Hero mascot consumes ~40% of first viewport — copy/CTA pushed down. 11px uppercase eyebrows strain legibility. Ten sections to scroll before final CTA.

**Marina (Brazilian mom, Meta ad, phone):** Lands on generic home, not property LP — ad scent broken. No parcelamento/crianças signals above fold. No sticky WhatsApp. `Consulte` + fake 4.9 triggers "golpe" skepticism. Placeholder phone undermines "Resposta em até 2min" promise.

## Minor Observations

- `.tuki-card-ref` shadow (16px/40px blur) contradicts DESIGN.md elevation rules.
- Header is white (reference) but DESIGN.md still describes purple sticky header — doc drift.
- Rio/Gramado both link to `/pacotes-de-viagem-brasil/` — weak destination routing.
- Footer Instagram/Facebook `href="#"` — broken trust at page end.
- CMS gap: 2 properties vs reference 6-card grid — home feels like MVP skeleton.
- `StarDecoration` repeated across Hero, Marquee, WhyTuki, CTA — decorative noise.

## Questions to Consider

- Is the home for brand storytelling or ad landing? Marina needs property LP with price + WhatsApp above fold.
- If you removed 4 eyebrows and 1 trust section, would the page feel empty or human?
- Is "Consulte" deliberate qualification, or should the UI say "Fale com consultor para tarifa" and drop Reservar/fake stars?
