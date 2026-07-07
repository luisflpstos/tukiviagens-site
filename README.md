# Tuki Viagens — Site

Site estático em Astro para a agência Tuki Viagens: home institucional, hubs de destinos, páginas de hotéis e resorts, blog SEO, landing pages de tráfego pago e captura de leads.

## Stack

- **Astro 7** + TypeScript
- **Tailwind CSS 4** (via `@tailwindcss/vite`)
- **Content Collections** (Markdown + Zod)
- **@astrojs/sitemap** — sitemap automático (landing pages em `/lp/` ficam de fora)
- **Deploy:** Vercel (via GitHub)

Requisito: Node.js **22.x** (`.nvmrc`: `22.12.0`)

## Comandos

```sh
pnpm install
pnpm dev       # http://localhost:4321
pnpm build
pnpm preview
pnpm test      # testes unitários (Vitest)
```

## Variáveis de ambiente

Copie `.env.example` para `.env` e ajuste os valores:

| Variável | Descrição |
|---|---|
| `PUBLIC_SITE_URL` | URL canônica do site (SEO, sitemap, links absolutos) |
| `PUBLIC_LEAD_WEBHOOK_URL` | Webhook para envio de leads do formulário |
| `PUBLIC_WHATSAPP_WEBHOOK_URL` | Webhook para cliques no WhatsApp (fallback: `PUBLIC_LEAD_WEBHOOK_URL`) |
| `PUBLIC_GTM_ID` | ID do Google Tag Manager (opcional) |
| `PUBLIC_GA4_ID` | ID de medição do Google Analytics 4 (opcional) |
| `PUBLIC_GOOGLE_ADS_ID` | ID da conta Google Ads (`AW-…`) para tag de conversão |
| `PUBLIC_GOOGLE_ADS_LEAD_LABEL` | Rótulo da conversão de formulário (pareado com `PUBLIC_GOOGLE_ADS_ID`) |
| `PUBLIC_GOOGLE_ADS_WHATSAPP_LABEL` | Rótulo da conversão de clique no WhatsApp |
| `PUBLIC_META_PIXEL_ID` | ID do Pixel / conjunto de dados da Meta (Gerenciador de Eventos) |
| `META_CAPI_TOKEN` | Token da API de Conversões e Dataset Quality API (somente servidor) |
| `META_TEST_EVENT_CODE` | Opcional: código de “Testar eventos” do Gerenciador de Eventos |
| `PUBLIC_BLOCK_INDEXING` | `true` bloqueia indexação (meta noindex, header X-Robots-Tag, sem sitemap). O `public/robots.txt` também deve estar com `Disallow: /` enquanto o bloqueio estiver ativo. |

### Conversões (GA4 + Google Ads)

Eventos disparados automaticamente pelo site:

| Ação | Evento GA4 | Google Ads |
|---|---|---|
| Envio do formulário (página `/obrigado/`) | `generate_lead` | conversão com `PUBLIC_GOOGLE_ADS_LEAD_LABEL` |
| Clique em botão WhatsApp | `whatsapp_click` | conversão com `PUBLIC_GOOGLE_ADS_WHATSAPP_LABEL` |

**GA4:** em *Admin → Eventos*, marque `generate_lead` e `whatsapp_click` como conversões (ou importe `generate_lead` no Google Ads via vínculo GA4).

**Google Ads:** crie duas ações de conversão (*Site* → tag gtag), copie o ID `AW-…` e os rótulos para `.env` / Vercel. Exemplo:

```env
PUBLIC_GOOGLE_ADS_ID=AW-123456789
PUBLIC_GOOGLE_ADS_LEAD_LABEL=AbCdEfGhIj
PUBLIC_GOOGLE_ADS_WHATSAPP_LABEL=KlMnOpQrSt
```

### Meta (Pixel + API de Conversões)

Integração direta com deduplicação browser/servidor via `event_id` compartilhado:

| Ação | Pixel (browser) | CAPI (servidor) |
|---|---|---|
| Envio do formulário | `Lead` | `Lead` em `POST /api/lead/` |
| Clique no WhatsApp | `Contact` | `Contact` em `POST /api/meta-event/` |

Configure `PUBLIC_META_PIXEL_ID` e `META_CAPI_TOKEN` no `.env` e na Vercel. Para validar antes de ir a produção, defina `META_TEST_EVENT_CODE` com o código exibido em *Gerenciador de Eventos → Testar eventos*.

Monitorar qualidade da integração (EMQ, match keys, diagnósticos):

```bash
pnpm meta:quality
# ou com dataset específico:
pnpm meta:quality -- 1202037289650493
```

## Estrutura do projeto

```txt
src/
├── components/       # UI reutilizável (Header, Footer, seções da home, etc.)
├── content/          # Markdown das Content Collections
│   ├── blog/
│   ├── hoteis/
│   ├── landingpages/
│   ├── paginas/      # Hubs, páginas de venda, atrações e institucional
│   └── resorts/
├── layouts/          # BaseLayout, PageLayout, HotelLayout, etc.
├── lib/              # Constantes, SEO, rotas, ícones, formatters
├── pages/            # Rotas Astro (home, blog, hotéis, resorts, LP, catch-all)
├── scripts/          # Lead form, tracking UTM, máscaras, animações
└── styles/           # global.css, motion.css
public/               # Assets estáticos (logotipo, imagens, favicon)
```

## Content Collections

| Collection | Rota | Uso |
|---|---|---|
| `paginas` | `/[...path]` | Hubs de destino, páginas de venda, atrações, hotéis, resorts e institucional |
| `hoteis` | `/hoteis/[slug]` | Fichas de hotéis |
| `resorts` | `/resorts/[slug]` | Fichas de resorts |
| `blog` | `/blog/[slug]` | Artigos SEO |
| `landingpages` | `/lp/[slug]` | LPs de campanha (noindex por padrão) |

Silos de conteúdo: **Olímpia**, **Rio Quente**, **Nordeste**, **Pacotes** e **Agência**.

Na collection `paginas`, cada hotel ou resort usa `pageType: "hotel"` ou `pageType: "resort"` no frontmatter (não existe tipo `propriedade`).

## Imagens

Todas as imagens ficam em `public/images/`. Enquanto o arquivo não existir na pasta, o site usa placeholders (Unsplash). Mapeamento no código: `src/lib/image-paths.ts` e `src/lib/property-gallery.ts`.

### Pastas

| Contexto | Caminho | Usado em |
|---|---|---|
| Hero da home | `public/images/hero/capa.jpg` | Banner fotográfico da página inicial |
| Hubs de destino | `public/images/destinos/<slug>/` | `/olimpia/`, `/rio-quente/`, `/nordeste/`, etc. |
| Hotéis e resorts | `public/images/hoteis/<slug>/` | Páginas de hotel ou resort (`/olimpia/<slug>/`, `/rio-quente/<slug>/`), `/hoteis/[slug]/`, `/resorts/[slug]/`, cards da home |
| OG padrão | `public/images/og/` | Compartilhamento social (fallback) |
| Ícones e mascote | `public/images/icons/`, `public/images/mascot/` | Home e identidade visual |

**Arquivos da galeria** (carrossel e cards): `capa.jpg`, `01.jpg`, `02.jpg` … `05.jpg` (até 6 fotos por pasta).

**Regra prática:**

- Hub de destino → `public/images/destinos/<slug>/`
- Hotel ou resort → `public/images/hoteis/<slug>/`
- O nome da pasta segue o **slug da galeria**, que pode ser diferente da URL (ex.: pasta `hot-beach-olimpia/` → página `/olimpia/hot-beach/`)

Listas completas de pastas: [public/images/hoteis/README.md](./public/images/hoteis/README.md) e [public/images/destinos/README.md](./public/images/destinos/README.md).

### Formatos e dimensões recomendados

#### Banner principal da home (`public/images/hero/capa.jpg`)

| | Recomendação |
|---|---|
| Proporção | Paisagem — **16:9** ou **3:2** |
| Dimensões | **2400×1350** (16:9) ou **2000×1333** (3:2); mínimo **2000px** de largura |
| Formato | `.webp` (preferível) ou `.jpg` (qualidade 80–85%) |
| Peso | 200–400 KB (WebP) / até ~500 KB (JPG otimizado) |
| Composição | Assunto centralizado; evite detalhes nas bordas — há overlay roxo (~55%), texto à esquerda no desktop e animação Ken Burns que recorta com `object-cover` |

Desktop e mobile usam o **mesmo arquivo**; o CSS recorta automaticamente.

#### Carrossel (hotéis e hubs)

| | Recomendação |
|---|---|
| Proporção | **4:3** (fixo no layout — `aspect-[4/3]`) |
| Dimensões | **1200×900** ou **1600×1200** por foto |
| Formato | `.webp` ou `.jpg` |
| Peso | 150–300 KB por foto |
| Composição | Enquadre no centro; `object-cover` recorta laterais e topo/base |

Layout: no desktop, carrossel à esquerda e texto à direita; no mobile, carrossel em cima e texto embaixo.

#### `capa.jpg` (uso duplo)

A `capa.jpg` de cada hotel aparece no **carrossel** (4:3) e nos **cards da home** (crop mais panorâmico, altura fixa 208px). Mantenha o resort ou piscina **centralizado** na imagem.

#### SEO / compartilhamento (Open Graph)

A primeira foto do carrossel (`capa.jpg`) vira `og:image` nas páginas de hotel ou resort. Redes sociais preferem **1200×630** (~1,91:1). Uma imagem 4:3 será recortada no WhatsApp/Facebook — opcional exportar versão dedicada para OG.

### Frontmatter opcional

Para forçar fotos específicas (ex.: ao usar `.webp`):

```yaml
images:
  - /images/hoteis/enjoy-solar-das-aguas/capa.jpg
  - /images/hoteis/enjoy-solar-das-aguas/01.jpg
```

Se `images` estiver vazio, o site descobre os arquivos na pasta automaticamente.

## Deploy (Vercel)

1. Importe o repositório [luisflpstos/tukiviagens-site](https://github.com/luisflpstos/tukiviagens-site) na [Vercel](https://vercel.com).
2. No painel da Vercel, confirme:
   - **Framework Preset:** Astro
   - **Build Command:** `pnpm build`
   - **Output Directory:** deixe vazio (o adapter `@astrojs/vercel` gera `.vercel/output` automaticamente)
   - **Install Command:** `pnpm install`
   - **Node.js:** 22.x
   - **Start Command:** deixe vazio
3. Configure as variáveis de ambiente (`PUBLIC_SITE_URL`, `LEAD_WEBHOOK_URL` e `LEAD_WEBHOOK_SECRET` são obrigatórias em produção).
4. Cada push em `main` dispara deploy automático.

O site estático fica em `dist/client/`; a rota `/api/lead/` roda como função serverless via adapter Vercel.

### Domínio na Cloudflare

Com o domínio gerenciado na Cloudflare e o site na Vercel:

1. Em **Vercel → Project → Settings → Domains**, adicione o domínio (ex.: `tukiviagens.com.br` e `www`).
2. Na **Cloudflare → DNS**, use os registros que a Vercel indicar. Exemplo típico:

| Tipo | Nome | Conteúdo | Proxy |
|---|---|---|---|
| `A` | `@` | `76.76.21.21` | DNS only (cinza) no primeiro deploy |
| `CNAME` | `www` | `cname.vercel-dns.com` | DNS only (cinza) no primeiro deploy |

3. Em **Cloudflare → SSL/TLS**, use **Full (strict)**. Evite "Flexible" — causa loop de redirect com a Vercel.
4. Aguarde a Vercel validar o domínio (status "Valid").
5. Depois de validado, pode ligar o proxy (nuvem laranja) se quiser CDN da Cloudflare.

Se o deploy falhar no painel da Vercel, abra o log completo e procure a linha após `pnpm build` — a instalação de dependências costuma passar; o erro real aparece no build ou na configuração do projeto (ex.: Start Command do Railway ainda preenchido).


## Documentação

Planejamento e arquitetura inicial: [docs/planejamento-mvp-astro-vercel.md](./docs/planejamento-mvp-astro-vercel.md)
