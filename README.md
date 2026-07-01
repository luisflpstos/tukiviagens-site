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
```

## Variáveis de ambiente

Copie `.env.example` para `.env` e ajuste os valores:

| Variável | Descrição |
|---|---|
| `PUBLIC_SITE_URL` | URL canônica do site (SEO, sitemap, links absolutos) |
| `PUBLIC_LEAD_WEBHOOK_URL` | Webhook para envio de leads do formulário |
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
