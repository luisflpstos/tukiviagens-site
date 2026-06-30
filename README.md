# Tuki Viagens — Site

Site estático em Astro para a agência Tuki Viagens: home institucional, hubs de destinos, páginas de hotéis e resorts, blog SEO, landing pages de tráfego pago e captura de leads.

## Stack

- **Astro 7** + TypeScript
- **Tailwind CSS 4** (via `@tailwindcss/vite`)
- **Content Collections** (Markdown + Zod)
- **@astrojs/sitemap** — sitemap automático (landing pages em `/lp/` ficam de fora)
- **Deploy:** Railway

Requisito: Node.js **≥ 22.12.0**

## Comandos

```sh
pnpm install
pnpm dev       # http://localhost:4321
pnpm build
pnpm preview
```

## Variáveis de ambiente

Copie `.env.example` para `.env` e ajuste os valores:

| Variável | Descrição |
|---|---|
| `PUBLIC_SITE_URL` | URL canônica do site (SEO, sitemap, links absolutos) |
| `PUBLIC_LEAD_WEBHOOK_URL` | Webhook para envio de leads do formulário |
| `PUBLIC_GTM_ID` | ID do Google Tag Manager (opcional) |

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

## Deploy (Railway)

1. Conecte o repositório no Railway.
2. Configure as variáveis de ambiente (`PUBLIC_SITE_URL` é obrigatória em produção).
3. Comandos de build:
   - **Build:** `pnpm build`
   - **Start:** `pnpm preview --host 0.0.0.0 --port $PORT`

O site é gerado estaticamente em `dist/`.

## Documentação

Planejamento e arquitetura inicial: [docs/planejamento-mvp-astro-vercel.md](./docs/planejamento-mvp-astro-vercel.md)
