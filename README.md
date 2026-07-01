# Tuki Viagens — Site

Site estático em Astro para a agência Tuki Viagens: home institucional, hubs de destinos, páginas de hotéis e resorts, blog SEO, landing pages de tráfego pago e captura de leads.

## Stack

- **Astro 7** + TypeScript
- **Tailwind CSS 4** (via `@tailwindcss/vite`)
- **Content Collections** (Markdown + Zod)
- **@astrojs/sitemap** — sitemap automático (landing pages em `/lp/` ficam de fora)
- **Deploy:** Vercel (via GitHub)

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

## Deploy (Vercel)

1. Importe o repositório [luisflpstos/tukiviagens-site](https://github.com/luisflpstos/tukiviagens-site) na [Vercel](https://vercel.com).
2. A Vercel detecta Astro automaticamente. Confirme:
   - **Build Command:** `pnpm build`
   - **Output Directory:** `dist`
   - **Node.js:** 22.x (`.nvmrc` e `engines` no `package.json`)
3. Configure as variáveis de ambiente no painel da Vercel (`PUBLIC_SITE_URL` é obrigatória em produção).
4. Cada push em `main` dispara deploy automático.

O site é gerado estaticamente em `dist/`. Redirects adicionais ficam em `vercel.json`.

## Documentação

Planejamento e arquitetura inicial: [docs/planejamento-mvp-astro-vercel.md](./docs/planejamento-mvp-astro-vercel.md)
