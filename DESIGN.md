---
name: Tuki Viagens
description: O Brasil que você sonha, com a leveza do Tuki.
colors:
  purple-primary: "#4B14AE"
  purple-deep: "#270A78"
  purple-light: "#6B2FD4"
  orange-primary: "#FC7B04"
  orange-deep: "#E94F1B"
  white: "#FFFFFF"
  ink: "#1F1545"
  ink-dark: "#201E1E"
  ink-muted: "#6E6685"
  surface: "#FFFFFF"
  surface-off-white: "#FBFBFF"
  surface-lavender: "#F4F1FF"
typography:
  display:
    fontFamily: "Nunito, Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2rem, 5vw, 3.25rem)"
    fontWeight: 800
    lineHeight: 0.98
    letterSpacing: "-0.04em"
  headline:
    fontFamily: "Nunito, Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.875rem, 3vw, 2.25rem)"
    fontWeight: 800
    lineHeight: 1.2
    letterSpacing: "-0.03em"
  title:
    fontFamily: "Nunito, Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 700
    lineHeight: 1.35
    letterSpacing: "normal"
  body:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "normal"
  label:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.6875rem"
    fontWeight: 700
    lineHeight: 1.4
    letterSpacing: "0.12em"
rounded:
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "24px"
  full: "9999px"
spacing:
  section-y: "clamp(3.5rem, 8vw, 5.5rem)"
  container-x: "clamp(1rem, 4vw, 1.5rem)"
  card-padding: "1.25rem"
components:
  button-primary:
    backgroundColor: "{colors.orange-primary}"
    textColor: "{colors.white}"
    rounded: "{rounded.full}"
    padding: "16px 32px"
  button-primary-hover:
    backgroundColor: "{colors.orange-deep}"
    textColor: "{colors.white}"
    rounded: "{rounded.full}"
    padding: "16px 32px"
  button-secondary:
    backgroundColor: "{colors.purple-primary}"
    textColor: "{colors.white}"
    rounded: "{rounded.full}"
    padding: "12px 24px"
  button-secondary-hover:
    backgroundColor: "{colors.purple-deep}"
    textColor: "{colors.white}"
    rounded: "{rounded.full}"
    padding: "12px 24px"
  button-inverse:
    backgroundColor: "{colors.white}"
    textColor: "{colors.purple-primary}"
    rounded: "{rounded.full}"
    padding: "16px 32px"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.white}"
    rounded: "{rounded.full}"
    padding: "16px 32px"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.purple-primary}"
    rounded: "{rounded.full}"
    padding: "12px 24px"
---

# Design System: Tuki Viagens

## Overview

**Creative North Star: "O Guia Colorido"**

O sistema visual da Tuki Viagens traduz leveza familiar em superfícies saturadas e confiantes — não em neutros quentes genéricos. Roxo e laranja carregam identidade em heróis, gradientes e blocos de conversão; fundos off-white e lavender frios dão respiro sem cair no cream editorial. O header branco com logo colorido ancora navegação limpa; o hero fotográfico com mascote Tuki concentra personalidade e prova social.

A estratégia de cor é **Committed**: roxo e laranja ocupam 30–60% da superfície visível em momentos-chave (hero, CTA gradient, marquee, stats). Tipografia Nunito bold nos títulos + Inter no corpo — par display/body pensado para famílias lendo ofertas no celular. Motion responsivo: entradas escalonadas no hero, hover tátil nos botões, Ken Burns sutil na foto — sempre com fallback em `prefers-reduced-motion`.

Rejeita explicitamente marketplace frio, estética SaaS com hero-metric, luxo engessado e slop de IA (cream bg, eyebrows em toda seção, glassmorphism decorativo, gradient text).

**Key Characteristics:**

- Paleta base: `#4B14AE`, `#270A78`, `#6B2FD4`, `#FC7B04`, `#E94F1B`, `#FFFFFF` + neutros lavanda (`#FBFBFF`, `#F4F1FF`, `#1F1545`, `#6E6685`)
- Hero fotográfico com overlay roxo, mascote circular e badges flutuantes
- Header branco sticky; CTAs laranja pill com glow; CTA final em gradiente roxo→laranja
- Cards `rounded-2xl` com borda roxa sutil e hover lift — não grid monocultura
- Sombras tintadas (`color-mix` roxo/ink) em vez de ghost cards pretos
- Motion expo-out com stagger no hero; reduced-motion desliga Ken Burns

## Colors

Paleta vibrante de agência familiar: roxo confiança + laranja energia, sobre off-white lavanda frio — nunca cream quente.

### Primary

- **Roxo Tuki** (`#4B14AE`): Cor de marca. Gradientes de hero, links em prosa, badges de categoria, ícones de confiança em fundo tintado (`purple/10`), hover de nav.
- **Roxo Profundo** (`#270A78`): Overlay de foto hero (`/55`), gradientes de profundidade, hover de botão secondary/dark.
- **Roxo Claro** (`#6B2FD4`): Ponto médio do gradiente CTA (`tuki-cta-ref`) — transição roxo→laranja.

### Secondary

- **Laranja Tuki** (`#FC7B04`): CTAs primários, stats no hero, destaques de preço, marquee strip, badges do mascote. Cor de ação.
- **Laranja Profundo** (`#E94F1B`): Hover de botão primary, eyebrows pontuais (`tuki-eyebrow`), tags alternadas em cards.

### Neutral

- **Branco Puro** (`#FFFFFF`): Cards, header, texto sobre roxo/laranja, botão inverse.
- **Off-White Lavanda** (`#FBFBFF`): Fundo global do `body` — frio, levemente azulado, não cream.
- **Lavanda Suave** (`#F4F1FF`): Seções alternadas (`tuki-section-lavender`), hover de nav, ícones de destino.
- **Tinta** (`#1F1545`): Corpo de texto principal — roxo escuro legível, não cinza genérico.
- **Tinta Suave** (`#6E6685`): Descrições, links de nav inativos. Mínimo 4.5:1 sobre branco/off-white.
- **Tinta Escura** (`#201E1E`): Títulos em conteúdo markdown longo (blog).

### Named Rules

**The Five-Color Rule.** Roxo, laranja e branco são âncoras; lavanda/off-white são neutros derivados da marca (tint frio, não warm). Não introduzir terceiros acentos sem aprovação.

**The Orange-Action Rule.** Laranja aparece em CTAs, preços, stats e marquee — não como fundo de seção inteira. Roxo carrega identidade; laranja carrega clique.

**The No-Cream Rule.** Proibido fundo cream/sand/beige quente. Off-white `#FBFBFF` e lavender `#F4F1FF` são permitidos — frios, com leve tint roxo. Calor vem da paleta saturada, não do papel envelhecido.

## Typography

**Display Font:** Nunito (Google Fonts, pesos 700–900) — headings h1–h3
**Body Font:** Inter (Google Fonts, pesos 400–700) — parágrafos, UI, labels
**Label Font:** Inter bold, uppercase com tracking em hero eyebrow e categorias de card

**Character:** Nunito arredondada nos títulos transmite leveza e família; Inter no corpo garante legibilidade em mobile. Par tipográfico display + body — nunca serifas pretensiosas.

### Hierarchy

- **Display** (800, Nunito, `clamp(2rem, 5vw, 3.25rem)`, lh 0.98): H1 de hero. `text-wrap: balance`. Letter-spacing `-0.04em`. Acento laranja inline ou `tuki-heading-accent` (underline laranja 3px).
- **Headline** (800, Nunito, `clamp(1.875rem, 3vw, 2.25rem)`, lh 1.2): H2 de seção. Tracking `-0.03em`.
- **Title** (700, Nunito, 1.125rem, lh 1.35): H3 de cards, benefícios.
- **Body** (400, Inter, 1rem, lh 1.55–1.6): Parágrafos. Máx. 65–75ch. `text-wrap: pretty` em prosa longa.
- **Label** (700, Inter, 11px, tracking 0.12–0.14em, uppercase): Hero eyebrow único, categorias em cards — nunca como eyebrow em toda seção.

### Type utilities

Classes semânticas em `global.css` — usar em vez de tamanhos Tailwind arbitrários:

| Classe | Papel | Escala |
|--------|-------|--------|
| `tuki-type-display` | H1 hero | `clamp(2rem, 5vw, 3.25rem)`, lh 0.98, tracking -0.04em |
| `tuki-type-headline` | H2 de seção | `clamp(1.875rem, 3vw, 2.25rem)`, lh 1.2 |
| `tuki-type-title` | H3 de cards | 1.125rem, weight 700 |
| `tuki-type-lead` | Lead / subtítulo | `clamp(1rem … 1.125rem)` |
| `tuki-type-body` | Parágrafos | 1rem, lh 1.6 |
| `tuki-type-small` | UI secundária | 0.875rem |
| `tuki-type-caption` | Metadados, badges | 0.75rem (mínimo legível) |
| `tuki-type-inverse` | Texto sobre roxo/laranja | lh 1.62, tracking +0.01em |
| `tuki-measure` | Largura de leitura | max-width 65ch |
| `tuki-tabular-nums` | Stats e preços | tabular-nums |

### Named Rules

**The Display-Body Pair Rule.** Nunito em display (h1–h3); Inter em corpo e UI. Não misturar outras famílias.

**The Token-Not-Arbitrary Rule.** Headings usam `tuki-type-*`, não `text-3xl md:text-4xl` espalhado. Captions nunca abaixo de 0.75rem.

**The Readable-Ink Rule.** Corpo usa `tuki-ink` (`#1F1545`) sobre off-white/branco — nunca gray-400/500. `text-white/80–90` só sobre roxo/laranja saturado com contraste verificado; combinar com `tuki-type-inverse`.

## Elevation

Sistema **híbrido**: superfícies planas por padrão, com sombras tintadas (`color-mix` em roxo/ink/laranja) para glow de marca — não ghost cards pretos genéricos.

### Shadow Vocabulary

- **Header sticky** (`0 4px 24px color-mix(purple 6%, transparent)`): Sombra roxa difusa sob nav branca.
- **Botão primary** (`0 10px 24px color-mix(orange 28%, transparent)`): Glow laranja sob CTAs.
- **Card repouso** (`shadow-sm` / `0 1px 2px rgba(0,0,0,0.05)`): Cards de hotel via `tuki-card-ref`.
- **Card hover** (`shadow-md` + `translateY(-4px)`): Lift leve em hover — blur ≤ 8px para sombras neutras.
- **Dest card / badge** (`0 12px 35px color-mix(ink 6%, transparent)`): Glow tintado em cards de destino e badges flutuantes — permitido com borda roxa sutil porque a sombra é colorida, não preta fantasma.
- **CTA block** (`0 22px 55px color-mix(purple 28%, transparent)`): Glow roxo sob bloco gradiente final.
- **Mascote** (`drop-shadow-2xl`): Sombra no PNG do tucano — exclusivo do mascote.

### Named Rules

**The Tinted-Glow Rule.** Sombras de marca usam `color-mix` com roxo, laranja ou ink — nunca `rgba(0,0,0,0.15+)` com blur ≥ 16px junto a borda cinza. Glow colorido ≠ ghost card.

**The Flat-By-Default Rule.** Superfícies em repouso são planas ou com glow sutil de marca. Sombra neutra aparece só em hover de card ou menu mobile overlay.

## Components

### Buttons

- **Shape:** Pill completo (`rounded-full`, 9999px). Classe motion `tuki-btn-motion`: scale 1.03 hover, 0.97 active.
- **Primary:** Fundo `#FC7B04`, texto branco, glow laranja, padding lg `px-8 py-4`. Hover `#E94F1B`. Focus ring laranja offset 2px.
- **Secondary:** Fundo `#4B14AE`, hover `#270A78`. Cards de propriedade, ações secundárias.
- **Dark:** Fundo `#1F1545` (ink), hover roxo profundo. Uso pontual.
- **Inverse:** Fundo branco, texto roxo. Sobre gradientes CTA.
- **Outline:** Borda `white/35`, fundo `white/10`, texto branco. Sobre hero roxo.
- **Outline-dark:** Borda 2px branca 80%. Variante mais forte sobre fundos escuros.
- **Ghost:** Texto roxo, hover `bg-purple/10`. Links secundários em superfícies claras.

### Cards / Containers

- **Property card** (`tuki-card-ref`): `rounded-2xl` (16px), borda `purple/8`, `shadow-sm`, fundo branco. Hover `-translate-y-1` + `shadow-md`. Imagem 208px com gradient fallback roxo/laranja.
- **Dest card** (`tuki-dest-card`): Similar, com glow tintado ink 6% e ícone em fundo lavender.
- **CTA block** (`tuki-cta-ref`): `rounded-3xl` (24px), gradiente roxo→roxo-claro→laranja-profundo, glow roxo 28%. Mascote selfie posicionado à esquerda (desktop).
- **Trust pill** (`tuki-trust-pill`): `rounded-2xl`, borda roxa sutil, sem sombra pesada.
- **Section backgrounds:** `tuki-section-soft` (gradient off-white→lavender), `tuki-section-lavender` (lavender sólido).

### Inputs / Fields

- **Style:** `rounded-xl` (12px), borda `gray-200`, padding `px-4 py-3`, labels `text-sm font-medium gray-700`.
- **Focus:** Borda roxa + ring `purple/20` offset 0. Sem glow exagerado.
- **Submit:** Botão pill laranja full-width, hover laranja profundo, `disabled:opacity-60`.
- **Error:** Status via `aria-live`; mensagem legível, não só cor vermelha pálida.

### Navigation

- **Header:** Sticky branco, borda inferior `purple/8`, glow roxo 6%, logo colorido, links `tuki-muted` com hover lavender+roxo, CTA WhatsApp primary sm.
- **Mobile:** Menu `details` com painel branco `rounded-2xl shadow-lg` — overlay estrutural permitido.
- **Footer:** Links roxo sobre fundo claro.
- **Skip link:** Visível no focus, branco com shadow.

### Hero / Mascote / Marquee

- **Hero:** Foto full-bleed + overlay roxo 55% + gradiente `tuki-hero-ref` (orbs laranja). Ken Burns 20s na foto. Entradas stagger `tuki-hero-enter`.
- **Mascote:** Anel circular `purple/40`, backdrop-blur, ring branco 8%, PNG com drop-shadow. Badges flutuantes white/orange pill com float animation.
- **Marquee:** Faixa laranja gradiente horizontal com ícones de parceiros, máscara fade nas bordas, ticker 15s linear.
- **Eyebrow hero:** Pill glass `white/10` + backdrop-blur — uso único no hero, não replicar em toda seção.

## Do's and Don'ts

### Do:

- **Do** usar as cores base como âncora: roxo, laranja, branco + neutros lavanda frios (`#FBFBFF`, `#F4F1FF`, `#1F1545`, `#6E6685`).
- **Do** colocar CTAs primários em laranja pill com glow sobre fundos roxos, brancos ou gradientes.
- **Do** manter tom divertido-familiar: mascote, copy leve, prova social antes do formulário.
- **Do** usar hero fotográfico com overlay de marca — a foto carrega desejo de viagem.
- **Do** usar `section-padding` (`py-14 md:py-[88px]`) para ritmo vertical generoso.
- **Do** respeitar WCAG 2.1 AA — contraste ≥4.5:1, foco visível, `prefers-reduced-motion` (Ken Burns off, entradas mantidas).

### Don't:

- **Don't** parecer marketplace frio (Booking, Decolar) — grids genéricos sem escolha, tom impessoal.
- **Don't** usar estética SaaS/startup — hero com métricas gigantes como único gancho, cards idênticos infinitos.
- **Don't** usar luxo engessado — serifas pretensiosas, distância emocional.
- **Don't** cair em cara de IA (slop) — fundo cream/sand/beige, eyebrows em caps em toda seção, glassmorphism decorativo, gradient text, bordas laterais coloridas em cards.
- **Don't** usar header roxo sólido com logo branco — o padrão atual é header branco com logo colorido.
- **Don't** usar `border-radius` ≥ 32px em cards ou seções (máximo `rounded-3xl` / 24px em CTAs).
- **Don't** empilhar borda cinza + sombra preta blur ≥ 16px — use glow tintado de marca ou escolha um só.
- **Don't** introduzir cores fora da paleta base sem decisão explícita de marca.
