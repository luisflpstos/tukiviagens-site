---
name: Tuki Viagens
description: O Brasil que você sonha, com a leveza do Tuki.
colors:
  purple-primary: "#4B14AE"
  purple-deep: "#270A78"
  orange-primary: "#FC7B04"
  orange-deep: "#E94F1B"
  white: "#FFFFFF"
  ink: "#201E1E"
  ink-muted: "#374151"
  surface: "#FFFFFF"
  surface-muted: "#F9FAFB"
typography:
  display:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.25rem, 5vw, 3.75rem)"
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.875rem, 3vw, 2.25rem)"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.01em"
  title:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 600
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
    fontSize: "0.75rem"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "0.05em"
rounded:
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "24px"
  full: "9999px"
spacing:
  section-y: "clamp(4rem, 8vw, 6rem)"
  container-x: "clamp(1rem, 4vw, 2rem)"
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
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.white}"
    rounded: "{rounded.full}"
    padding: "16px 32px"
---

# Design System: Tuki Viagens

## Overview

**Creative North Star: "O Guia Colorido"**

O sistema visual da Tuki Viagens traduz leveza familiar em superfícies saturadas e confiantes — não em neutros quentes genéricos. Roxo profundo ocupa heróis, header e blocos de confiança; laranja conduz a ação. O mascote Tuki ancora personalidade sem infantilizar. A referência de calor humano é a proximidade tipo Nubank: amigável, colorido, confiável sem parecer corporativo ou marketplace.

A estratégia de cor é **Committed**: roxo e laranja carregam 30–60% da superfície visível. Fundos brancos e cinza-claro existem para respiro e leitura, nunca como "cream editorial" ou bege quente. Tipografia única (Inter) em pesos contrastantes — display bold nos títulos, corpo legível em cinza-escuro sobre branco.

**Key Characteristics:**

- Paleta base fixa: `#4B14AE`, `#270A78`, `#FC7B04`, `#E94F1B`, `#FFFFFF`
- Heróis e header em roxo saturado; CTAs em laranja pill
- Tom divertido-familiar com prova social e curadoria consultiva
- Layout arejado com `section-padding` generoso; grids responsivos sem card monocultura
- Elevação mínima — profundidade por cor e contraste, não por sombras largas

## Colors

Paleta vibrante de agência de viagens familiar: roxo confiança + laranja energia, sobre branco limpo.

### Primary

- **Roxo Tuki** (`#4B14AE`): Cor de marca principal. Header sticky, fundos de hero, links em prosa, badges de categoria, ícones de confiança em fundo tintado (`purple/10`).
- **Roxo Profundo** (`#270A78`): Gradiente de hero e CTA blocks (`tuki-gradient-purple`), hover de botão secondary, profundidade em superfícies roxas.

### Secondary

- **Laranja Tuki** (`#FC7B04`): CTAs primários, destaques de preço, stats no hero, badges do mascote. Cor de ação — nunca decorativa em excesso.
- **Laranja Profundo** (`#E94F1B`): Hover de botão primary, ênfase em estados ativos, acentos quentes que precisam de mais contraste sobre branco.

### Neutral

- **Branco Puro** (`#FFFFFF`): Fundo de seções de confiança, cards, texto sobre roxo/laranja, contorno de botões outline.
- **Tinta** (`#201E1E` / gray-900): Títulos em superfícies claras.
- **Tinta Suave** (`#374151` / gray-700–800): Corpo de texto, descrições. Mínimo 4.5:1 sobre branco.
- **Superfície Muda** (`#F9FAFB` / gray-50): Alternância de seção (grids de hotéis), sem tom quente.

### Named Rules

**The Five-Color Rule.** Apenas as cinco cores base (`#4B14AE`, `#270A78`, `#FC7B04`, `#E94F1B`, `#FFFFFF`) mais neutros derivados (cinzas para texto). Não introduzir terceiros acentos sem aprovação.

**The Orange-Action Rule.** Laranja aparece em CTAs, preços e stats de conversão — não em fundos de seção inteira. Roxo carrega identidade; laranja carrega clique.

**The No-Cream Rule.** Proibido fundo cream/sand/beige quente. Branco frio ou cinza-50 para respiro. Calor vem da paleta de marca, não do papel envelhecido.

## Typography

**Display Font:** Inter (Google Fonts, pesos 400–800)
**Body Font:** Inter (mesma família — contraste por peso e escala, não por par)
**Label Font:** Inter semibold, uppercase com tracking em categorias de card

**Character:** Geométrica-humanista, legível em mobile, amigável sem ser infantil. Uma família, múltiplos pesos — adequada para famílias lendo ofertas no celular.

### Hierarchy

- **Display** (700, `clamp(2.25rem, 5vw, 3.75rem)`, lh 1.15): H1 de hero e tagline. `text-wrap: balance`. Letter-spacing ≥ -0.04em (usar -0.02em a -0.03em).
- **Headline** (700, `clamp(1.875rem, 3vw, 2.25rem)`, lh 1.2): H2 de seção ("Hotéis selecionados", CTAs finais).
- **Title** (600, 1.125rem, lh 1.35): H3 de cards, itens de benefício.
- **Body** (400, 1rem, lh 1.6): Parágrafos e descrições. Máx. 65–75ch em blocos longos. `text-wrap: pretty` em prosa.
- **Label** (600, 0.75rem, tracking 0.05em, uppercase): Categorias em cards de propriedade — usar com moderação, nunca como eyebrow em toda seção.

### Named Rules

**The One-Voice Type Rule.** Inter em todo o site. Não adicionar serif display ou mono decorativo sem decisão de rebranding.

**The Readable-Gray Rule.** Corpo nunca abaixo de gray-700 sobre branco. `text-white/80` só sobre roxo/laranja saturado com contraste verificado.

## Elevation

Sistema predominantemente **plano**. Profundidade vem de blocos de cor (hero roxo, CTA gradient) e contraste tonal, não de sombras decorativas.

### Shadow Vocabulary

- **Card repouso** (`box-shadow: 0 1px 2px rgba(0,0,0,0.05)`): Cards de hotel em repouso (`shadow-sm`).
- **Card hover** (`box-shadow: 0 4px 6px rgba(0,0,0,0.07)`): Elevação leve no hover (`shadow-md`) — máximo 8px blur.
- **Mascote** (`filter: drop-shadow`): Sombra no mascote hero apenas — não replicar em cards.

### Named Rules

**The Flat-By-Default Rule.** Superfícies em repouso são planas. Sombra aparece só em hover de card ou menu mobile — nunca `border + shadow` larga no mesmo elemento.

**The No-Ghost-Card Rule.** Proibido `1px border` + `box-shadow` com blur ≥ 16px no mesmo componente.

## Components

### Buttons

- **Shape:** Pill completo (`rounded-full`, 9999px).
- **Primary:** Fundo `#FC7B04`, texto `#FFFFFF`, padding `px-8 py-4` (lg) / `px-6 py-3` (md). Hover `#E94F1B`. Focus ring laranja, offset 2px.
- **Secondary:** Fundo `#4B14AE`, hover `#270A78`. Usado em "Reservar" dentro de cards.
- **Outline:** Borda 2px branca, texto branco, hover `bg-white/10`. Sobre fundos roxos.
- **Ghost:** Texto roxo, hover `bg-purple/10`. Links secundários em superfícies claras.

### Cards / Containers

- **Corner Style:** `rounded-2xl` (16px) em cards de propriedade; `rounded-3xl` (24px) em blocos CTA gradient — máximo para containers, nunca 32px+.
- **Background:** Branco em cards; gradiente roxo em CTAs; `gray-50` em seções alternadas.
- **Shadow Strategy:** `shadow-sm` repouso, `shadow-md` hover — ver Elevation.
- **Border:** `border-gray-100` entre seções de confiança; sem bordas laterais coloridas.
- **Internal Padding:** `p-5` em cards, `px-8 py-12` em CTAs.

### Inputs / Fields

- **Style:** (LeadForm) bordas arredondadas md, fundo branco, labels visíveis.
- **Focus:** Outline roxo ou laranja com offset; contraste WCAG AA.
- **Error:** Mensagem em tom de alerta legível; não apenas cor vermelha pálida.

### Navigation

- **Header:** Sticky, `bg-tuki-purple/95` + `backdrop-blur-sm`, logo branco, links `text-white/90`, CTA primary sm.
- **Mobile:** Menu `details` com painel branco `rounded-xl shadow-xl` — sombra estrutural permitida em overlay.
- **Footer:** Links em roxo sobre fundo claro.

### Mascote / Hero

- **Hero:** Fundo `#4B14AE` com orbs blur laranja/roxo claro (decorativo, opacidade baixa). Mascote PNG com drop-shadow. Stats em laranja sobre roxo.
- **Badges flutuantes:** Pill `rounded-full` com `bg-tuki-orange` ou `bg-white/20 backdrop-blur` — uso pontual, não em série.

## Do's and Don'ts

### Do:

- **Do** usar as cinco cores base como âncora: `#4B14AE`, `#270A78`, `#FC7B04`, `#E94F1B`, `#FFFFFF`.
- **Do** colocar CTAs primários em laranja pill sobre fundos roxos ou brancos com contraste verificado.
- **Do** manter tom divertido-familiar: mascote, copy leve, prova social antes do formulário.
- **Do** usar `section-padding` (`py-16 md:py-24`) para ritmo vertical generoso.
- **Do** respeitar WCAG 2.1 AA — contraste ≥4.5:1 em corpo, foco visível, `prefers-reduced-motion` em animações.

### Don't:

- **Don't** parecer marketplace frio (Booking, Decolar) — grids genéricos sem curadoria, tom impessoal.
- **Don't** usar estética SaaS/startup — hero com métricas gigantes como único gancho, cards idênticos infinitos.
- **Don't** usar luxo engessado — serifas pretensiosas, distância emocional.
- **Don't** cair em cara de IA (slop) — fundo cream/sand/beige, eyebrows em caps em toda seção, glassmorphism decorativo, gradient text, bordas laterais coloridas em cards.
- **Don't** usar `border-radius` ≥ 32px em cards ou seções.
- **Don't** empilhar `border: 1px solid` com `box-shadow` blur ≥ 16px no mesmo elemento.
- **Don't** introduzir cores fora da paleta base sem decisão explícita de marca.
