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
| `PUBLIC_BLOCK_INDEXING` | `true` bloqueia indexação (meta noindex, header X-Robots-Tag, sem sitemap). O `public/robots.txt` também deve estar com `Disallow: /` enquanto o bloqueio estiver ativo. |

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
| `paginas` | `/[...path]` | Hubs de destino, páginas de venda, atrações, institucional |
| `hoteis` | `/hoteis/[slug]` | Fichas de hotéis |
| `resorts` | `/resorts/[slug]` | Fichas de resorts |
| `blog` | `/blog/[slug]` | Artigos SEO |
| `landingpages` | `/lp/[slug]` | LPs de campanha (noindex por padrão) |

Silos de conteúdo: **Olímpia**, **Rio Quente**, **Nordeste**, **Pacotes** e **Agência**.

## Imagens

Todas as imagens ficam em `public/images/`. Enquanto o arquivo não existir na pasta, o site usa placeholders (Unsplash). Mapeamento no código: `src/lib/image-paths.ts` e `src/lib/property-gallery.ts`.

### Pastas

| Contexto | Caminho | Usado em |
|---|---|---|
| Hero da home | `public/images/hero/capa.jpg` | Banner fotográfico da página inicial |
| Hubs de destino | `public/images/destinos/<slug>/` | `/olimpia/`, `/rio-quente/`, `/nordeste/`, etc. |
| Hotéis e resorts | `public/images/hoteis/<slug>/` | Páginas de propriedade (`/olimpia/<slug>/`), `/hoteis/[slug]/`, cards da home |
| OG padrão | `public/images/og/` | Compartilhamento social (fallback) |
| Ícones e mascote | `public/images/icons/`, `public/images/mascot/` | Home e identidade visual |

**Arquivos da galeria** (carrossel e cards): `capa.jpg`, `01.jpg`, `02.jpg` … `05.jpg` (até 6 fotos por pasta).

**Regra prática:**

- Hub de destino → `public/images/destinos/<slug>/`
- Hotel, resort ou propriedade → `public/images/hoteis/<slug>/`
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

A primeira foto do carrossel (`capa.jpg`) vira `og:image` nas páginas de propriedade. Redes sociais preferem **1200×630** (~1,91:1). Uma imagem 4:3 será recortada no WhatsApp/Facebook — opcional exportar versão dedicada para OG.

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
2. O `vercel.json` já define build e output. No painel da Vercel, confirme:
   - **Framework Preset:** Astro
   - **Build Command:** `pnpm build`
   - **Output Directory:** `dist`
   - **Install Command:** `pnpm install`
   - **Node.js:** 22.x
   - **Start Command:** deixe vazio (site estático, sem `pnpm preview`)
3. Configure as variáveis de ambiente (`PUBLIC_SITE_URL` é obrigatória em produção).
4. Cada push em `main` dispara deploy automático.

O site é gerado estaticamente em `dist/`.

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
