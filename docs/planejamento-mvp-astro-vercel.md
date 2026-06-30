# Planejamento MVP — Site Astro para Hotéis, Resorts e Landing Pages

## 1. Objetivo do projeto

Criar um site rápido, escalável e simples de manter para:

- Site institucional.
- Páginas de hotéis.
- Páginas de resorts.
- Páginas de destinos.
- Blog/conteúdo SEO.
- Landing pages para tráfego pago.
- Captura de leads via formulário.
- Rastreamento de origem dos leads com UTM, `gclid`, `fbclid`, `gbraid`, `wbraid` e página de origem.

Neste MVP, o projeto **não terá CMS**, **não terá backend próprio** e **não usará banco de dados**.

A ideia é começar com uma arquitetura simples, estática e performática, hospedada inicialmente na **Vercel**, com formulários enviados para uma API externa ou webhook.

---

## 2. Decisão principal do MVP

A decisão principal é manter o projeto o mais simples possível:

```txt
Astro estático
+ conteúdo em arquivos
+ formulários com JavaScript
+ envio para webhook/API externa
+ tracking via GTM/GA4/Meta/Google Ads
+ deploy na Vercel
```

O objetivo agora não é criar um WordPress, CMS ou painel administrativo, mas sim validar rapidamente:

- Páginas.
- Ofertas.
- Tráfego pago.
- Conversão.
- Captação de leads.
- SEO inicial.
- Estrutura de conteúdo reutilizável.

---

## 3. Stack recomendada

### Framework

```txt
Astro
```

Astro será a base do site porque é excelente para sites de conteúdo, landing pages e páginas estáticas de alta performance.

### Linguagem

```txt
TypeScript
```

Usar TypeScript para dar mais segurança na estrutura do projeto, nos schemas de conteúdo e nos scripts de formulário/tracking.

### Estilização

```txt
Tailwind CSS
```

Tailwind será usado para criar uma interface rápida, responsiva e fácil de reaproveitar entre páginas.

### Conteúdo

```txt
Astro Content Collections
Markdown
MDX, se necessário
JSON, se necessário
```

O conteúdo ficará em arquivos dentro do próprio projeto.

Exemplos:

```txt
src/content/hoteis/
src/content/resorts/
src/content/destinos/
src/content/landingpages/
src/content/blog/
```

### Hospedagem

```txt
Vercel
```

A Vercel será usada inicialmente para deploy do site Astro.

### Formulários

```txt
JavaScript/TypeScript client-side
Validação no navegador
Envio para webhook/API externa
```

O formulário não terá backend próprio neste MVP.

### Tracking

```txt
Google Tag Manager
GA4
Google Ads Conversion
Meta Pixel
Microsoft Clarity, opcional
```

### Imagens

No MVP:

```txt
Imagens locais no projeto
Astro Assets/Image
```

Evolução futura:

```txt
Cloudflare R2
Cloudinary
S3-compatible storage
Vercel Blob
```

---

## 4. O que não será usado no MVP

Para manter o projeto simples, não usar inicialmente:

```txt
CMS
Directus
Payload
Keystatic
Backend próprio
Postgres
MySQL
Redis
Railway
Docker
SSR
Área logada
Admin customizado
TanStack Router
TanStack Query
Autenticação
Fila
Banco de dados
```

Mesmo já existindo infraestrutura com servidor, Postgres, MySQL, Redis, Docker Swarm e Portainer, a recomendação é **não usar isso no MVP**.

A infra atual pode entrar depois, quando houver necessidade real de:

- CMS.
- Banco.
- API própria.
- Regras de negócio.
- Integrações com tokens privados.
- Painel administrativo.
- Área logada.
- Tracking server-side.
- Meta CAPI com token seguro.
- Integrações mais sensíveis.

---

## 5. Astro + TanStack: decisão para o MVP

### TanStack Router

Não usar TanStack Router no site público.

Motivo: o Astro já resolve muito bem:

- Rotas.
- Páginas estáticas.
- Páginas dinâmicas por slug.
- Blog.
- Landing pages.
- SEO.
- Build estático.

TanStack Router faria mais sentido em um app ou painel administrativo separado.

Exemplos futuros:

```txt
admin.dominio.com.br
app.dominio.com.br
crm.dominio.com.br
```

### TanStack Query

Também não é necessário no começo.

TanStack Query faria sentido depois, quando existir:

- Backend.
- API própria.
- Dados dinâmicos.
- Busca de disponibilidade.
- Consulta de preço.
- Área logada.
- Dashboard.
- Cache de requests.
- Mutations complexas.

No MVP, formulários e scripts simples resolvem.

---

## 6. Arquitetura geral do MVP

```txt
GitHub
  ↓
Vercel
  ↓
Astro estático
  ↓
Páginas institucionais + SEO + landing pages
  ↓
JavaScript captura UTMs, gclid, fbclid e dados da página
  ↓
Formulário faz validação client-side
  ↓
Envio para webhook/API externa
  ↓
GTM/GA4/Meta/Google Ads registram eventos
  ↓
Lead segue para WhatsApp, CRM, planilha, n8n ou outro destino
```

---

## 7. Estrutura de pastas recomendada

```txt
src/
  content/
    hoteis/
    resorts/
    destinos/
    landingpages/
    blog/

  components/
    common/
      Header.astro
      Footer.astro
      WhatsAppButton.astro
      LeadForm.astro

    sections/
      Hero.astro
      Benefits.astro
      Gallery.astro
      Faq.astro
      Testimonials.astro
      OfferBox.astro
      LocationSection.astro
      CtaSection.astro
      LeadCaptureSection.astro

  layouts/
    BaseLayout.astro
    LandingLayout.astro
    HotelLayout.astro
    ResortLayout.astro
    DestinationLayout.astro
    BlogLayout.astro

  pages/
    index.astro
    contato.astro

    hoteis/
      [slug].astro

    resorts/
      [slug].astro

    destinos/
      [slug].astro

    lp/
      [slug].astro

    blog/
      [slug].astro

  scripts/
    utm.ts
    lead-form.ts
    tracking.ts
    masks.ts
    validators.ts

  styles/
    global.css

  lib/
    seo.ts
    formatters.ts
    constants.ts
```

---

## 8. Estrutura das URLs

### Site institucional

```txt
/
 /sobre
 /contato
 /hoteis
 /resorts
 /destinos
 /blog
```

### Páginas SEO

```txt
/hoteis/enjoy-solar-das-aguas
/resorts/wyndham-olimpia
/destinos/olimpia
/blog/melhores-resorts-em-olimpia
```

### Landing pages para tráfego pago

```txt
/lp/enjoy-solar-das-aguas-google
/lp/enjoy-solar-das-aguas-meta
/lp/enjoy-solar-das-aguas-familia
/lp/enjoy-solar-das-aguas-ferias-julho
/lp/wyndham-olimpia-google
/lp/wyndham-olimpia-meta
```

---

## 9. Estratégia de indexação

### Páginas que devem ser indexadas

Páginas com valor para SEO:

```txt
/
 /hoteis/enjoy-solar-das-aguas
 /resorts/wyndham-olimpia
 /destinos/olimpia
 /blog/melhores-resorts-em-olimpia
```

### Páginas que podem usar noindex

Landing pages muito parecidas ou criadas especificamente para campanhas:

```txt
/lp/enjoy-solar-das-aguas-google
/lp/enjoy-solar-das-aguas-meta
/lp/wyndham-olimpia-campanha-x
```

Regra prática:

- Página evergreen e útil para busca orgânica: `index`.
- Página duplicada, muito parecida ou específica de campanha: `noindex`.

---

## 10. Organização do conteúdo

### Exemplo de arquivos

```txt
src/content/landingpages/enjoy-solar-das-aguas-google.md
src/content/landingpages/enjoy-solar-das-aguas-meta.md
src/content/landingpages/wyndham-olimpia-familia.md

src/content/hoteis/enjoy-solar-das-aguas.md
src/content/resorts/wyndham-olimpia.md
src/content/destinos/olimpia.md
src/content/blog/melhores-resorts-em-olimpia.md
```

### Exemplo de frontmatter para landing page

```yaml
---
title: "Enjoy Solar das Águas em Olímpia"
slug: "enjoy-solar-das-aguas-google"
type: "landingpage"
hotel: "Enjoy Solar das Águas"
cidade: "Olímpia"
estado: "SP"

headline: "Reserve sua hospedagem em Olímpia com conforto para toda a família"
subheadline: "Hospede-se próximo ao Thermas dos Laranjais com estrutura completa de resort."

cta: "Consultar disponibilidade"
whatsapp: "5517999999999"

campaign: "google-search-enjoy-solar"
channel: "google"
noindex: true

seo:
  title: "Enjoy Solar das Águas em Olímpia | Consulte disponibilidade"
  description: "Reserve sua hospedagem no Enjoy Solar das Águas em Olímpia. Estrutura completa para famílias, lazer e conforto."
---
```

### Exemplo de frontmatter para hotel

```yaml
---
title: "Enjoy Solar das Águas"
slug: "enjoy-solar-das-aguas"
type: "hotel"
cidade: "Olímpia"
estado: "SP"
categoria: "Resort"

headline: "Enjoy Solar das Águas: hospedagem completa em Olímpia"
description: "Conheça o Enjoy Solar das Águas, uma opção de hospedagem em Olímpia para famílias que buscam lazer, conforto e praticidade."

whatsapp: "5517999999999"
cta: "Consultar hospedagem"

amenities:
  - Piscinas
  - Restaurante
  - Área de lazer
  - Próximo ao Thermas dos Laranjais

seo:
  title: "Enjoy Solar das Águas em Olímpia"
  description: "Conheça o Enjoy Solar das Águas em Olímpia e consulte opções de hospedagem para sua viagem."
---
```

---

## 11. Schemas de conteúdo

Usar `zod` junto com Astro Content Collections para validar os campos dos arquivos.

Coleções recomendadas:

```txt
hoteis
resorts
destinos
landingpages
blog
```

Campos importantes para `landingpages`:

```txt
title
slug
type
hotel
cidade
estado
headline
subheadline
cta
whatsapp
campaign
channel
noindex
seo.title
seo.description
```

Campos importantes para `hoteis` e `resorts`:

```txt
title
slug
cidade
estado
categoria
headline
description
amenities
images
whatsapp
cta
seo.title
seo.description
```

---

## 12. Componentes principais

### Componentes comuns

```txt
Header.astro
Footer.astro
WhatsAppButton.astro
LeadForm.astro
Seo.astro
Container.astro
Button.astro
```

### Componentes de seção

```txt
Hero.astro
Benefits.astro
Gallery.astro
Faq.astro
Testimonials.astro
OfferBox.astro
LocationSection.astro
CtaSection.astro
LeadCaptureSection.astro
HotelDetails.astro
ResortDetails.astro
DestinationHighlights.astro
```

### Componentes para landing pages

```txt
LandingHero.astro
LandingBenefits.astro
LandingOffer.astro
LandingForm.astro
LandingFaq.astro
LandingStickyCta.astro
```

---

## 13. Layouts recomendados

### BaseLayout

Usado como estrutura base do site.

Responsável por:

- HTML base.
- Head.
- Meta tags.
- SEO.
- GTM.
- Scripts globais.
- Header e Footer opcionais.

### LandingLayout

Usado em landing pages.

Características:

- Header reduzido ou inexistente.
- Foco em conversão.
- Menos distrações.
- CTA visível.
- Possibilidade de botão fixo de WhatsApp.
- Controle de `noindex`.

### HotelLayout

Usado em páginas de hotéis.

Características:

- Conteúdo mais detalhado.
- SEO.
- Galeria.
- Comodidades.
- Localização.
- FAQ.
- CTA para contato.

### BlogLayout

Usado em posts de conteúdo.

Características:

- SEO.
- Sumário, se necessário.
- Conteúdo MD/MDX.
- CTA contextual.
- Links internos para hotéis, resorts e destinos.

---

## 14. Formulários

### Objetivo

Capturar leads com o mínimo de fricção possível e enviar para uma API externa, webhook, CRM, n8n, planilha ou WhatsApp.

### Campos visíveis recomendados

```txt
nome
telefone
quantidade de pessoas
data desejada, opcional
hotel/resort de interesse, opcional
mensagem, opcional
```

### Campos ocultos recomendados

```txt
utm_source
utm_medium
utm_campaign
utm_content
utm_term
gclid
gbraid
wbraid
fbclid
referrer
landing_page
landing_slug
hotel
resort
destination
campaign_id
form_id
```

### Fluxo do formulário

```txt
Usuário acessa página
  ↓
Script captura parâmetros da URL
  ↓
Dados são salvos no localStorage
  ↓
Usuário preenche formulário
  ↓
JS valida os campos
  ↓
JS monta payload
  ↓
Envio para webhook/API externa
  ↓
Evento é enviado para dataLayer
  ↓
Usuário vê mensagem de sucesso ou é redirecionado
```

---

## 15. Cuidados importantes com formulários sem backend

Como o projeto não terá backend próprio, não colocar no frontend:

```txt
tokens privados
bearer tokens sensíveis
chaves secretas
credenciais de banco
tokens da Meta CAPI
tokens da Google Ads API
tokens de CRM privado
```

Pode enviar direto do frontend apenas para endpoints que aceitem isso com segurança, como:

```txt
webhook público do n8n
endpoint público preparado para receber leads
Formspree
Tally
Make webhook
Google Apps Script público
API externa sem segredo privado no cliente
```

Se a integração exigir token privado, será necessário criar uma camada server-side no futuro.

---

## 16. Captura de UTMs e identificadores

### Parâmetros que devem ser capturados

```txt
utm_source
utm_medium
utm_campaign
utm_content
utm_term
gclid
gbraid
wbraid
fbclid
msclkid
```

### Dados adicionais

```txt
referrer
landing_page
first_landing_page
current_url
page_title
timestamp
user_agent, se fizer sentido e respeitando privacidade
```

### Estratégia

1. Ao acessar o site, capturar parâmetros da URL.
2. Salvar no `localStorage`.
3. Não sobrescrever a primeira origem sem necessidade.
4. Preencher campos ocultos do formulário.
5. Enviar tudo junto com o lead.
6. Disparar eventos no `dataLayer`.

---

## 17. Tracking e eventos

### Google Tag Manager

Instalar GTM globalmente no layout base.

Eventos sugeridos:

```txt
page_view
lead_form_start
lead_form_submit
lead_form_success
lead_form_error
whatsapp_click
cta_click
```

### Exemplo de evento no dataLayer

```js
window.dataLayer = window.dataLayer || []

window.dataLayer.push({
  event: 'lead_form_success',
  form_id: 'landing-main-form',
  landing_page: window.location.pathname,
  utm_source: storedUtm.utm_source,
  utm_campaign: storedUtm.utm_campaign,
})
```

### Google Ads

Usar eventos de conversão via GTM.

Capturar principalmente:

```txt
lead_form_success
whatsapp_click
```

### Meta Pixel

Usar eventos como:

```txt
Lead
Contact
ViewContent
```

### Microsoft Clarity

Opcional para análise de comportamento:

```txt
scroll
cliques
gravação de sessão
mapa de calor
```

---

## 18. WhatsApp

### Botão de WhatsApp

Criar componente reutilizável:

```txt
WhatsAppButton.astro
```

O botão deve permitir:

- Número do WhatsApp.
- Mensagem personalizada.
- Dados da página.
- Dados da campanha, quando possível.
- Evento de clique no `dataLayer`.

### Mensagem sugerida

```txt
Olá! Vi a página sobre [Hotel/Resort] e gostaria de consultar disponibilidade.
```

Para campanhas específicas:

```txt
Olá! Vi a oferta do [Hotel/Resort] e gostaria de consultar disponibilidade para minha viagem.
```

### Possível estratégia de identificação

Incluir uma referência simples na mensagem:

```txt
Origem: LP Enjoy Solar Google
```

Ou um código curto:

```txt
Código: ENJOY-GOOGLE-01
```

Isso ajuda quando o lead chega diretamente no WhatsApp e as UTMs não chegam no atendimento.

---

## 19. SEO técnico

### Cada página deve ter

```txt
title
description
canonical
og:title
og:description
og:image
robots index/noindex
structured data, quando fizer sentido
```

### Páginas de hotel/resort

Podem usar dados estruturados como:

```txt
Hotel
LodgingBusiness
FAQPage
BreadcrumbList
```

### Blog

Pode usar:

```txt
Article
BreadcrumbList
FAQPage, quando houver FAQ
```

### Sitemap

Gerar sitemap.

Pacote recomendado:

```bash
npx astro add sitemap
```

### Robots

Criar `robots.txt` para permitir indexação das páginas públicas e controlar LPs `noindex` pela meta tag.

---

## 20. Performance

### Princípios

- Priorizar páginas estáticas.
- Evitar JavaScript desnecessário.
- Evitar componentes React no MVP, salvo necessidade real.
- Otimizar imagens.
- Usar lazy loading.
- Evitar bibliotecas pesadas.
- Carregar scripts de terceiros com cuidado.

### Pontos críticos em landing pages

```txt
tempo de carregamento
LCP
CLS
peso das imagens
scripts de tracking
fontes
```

### Imagens

Boas práticas:

```txt
usar formatos modernos
comprimir imagens
definir width/height
lazy load em imagens abaixo da dobra
evitar carrosséis pesados no MVP
```

---

## 21. Comandos iniciais

### Criar projeto Astro

```bash
npm create astro@latest
```

### Adicionar Tailwind

```bash
npx astro add tailwind
```

### Adicionar Sitemap

```bash
npx astro add sitemap
```

### Instalar dependências úteis

```bash
npm install zod clsx
```

### Dependências opcionais

```bash
npm install lucide-astro
```

### React, se realmente necessário

```bash
npx astro add react
```

No MVP, tentar resolver a maior parte com `.astro` e JavaScript simples antes de adicionar React.

---

## 22. Variáveis de ambiente

### Exemplo

```env
PUBLIC_SITE_URL=https://seudominio.com.br
PUBLIC_LEAD_WEBHOOK_URL=https://webhook.exemplo.com/lead
PUBLIC_GTM_ID=GTM-XXXXXXX
```

Importante:

- Variáveis com prefixo público ficam disponíveis no cliente.
- Não colocar segredo em variável pública.
- Não colocar tokens privados no frontend.

---

## 23. Deploy na Vercel

### Fluxo

```txt
Criar repositório no GitHub
  ↓
Conectar na Vercel
  ↓
Configurar variáveis públicas
  ↓
Deploy automático a cada push
  ↓
Configurar domínio
  ↓
Configurar Cloudflare/DNS, se necessário
```

### Build command

```bash
npm run build
```

### Output

```txt
dist/
```

### Estratégia

Manter o site como estático no início.

---

## 24. Roadmap de evolução

### Fase 1 — MVP atual

```txt
Astro
TypeScript
Tailwind
Content Collections
Markdown/MDX
Formulário client-side
Webhook externo
Vercel
GTM/GA4/Meta/Google Ads
```

### Fase 2 — Melhorias de conteúdo

```txt
Mais templates
Mais seções reutilizáveis
Mais páginas SEO
Blog estruturado
FAQ com schema
Sitemap refinado
Links internos
```

### Fase 3 — Editor simples

Quando editar via arquivo começar a ficar ruim:

```txt
Keystatic
```

Usar se a necessidade for apenas ter uma interface simples para editar conteúdo versionado em Git.

### Fase 4 — CMS real

Quando houver mais volume, equipe ou clientes editando:

```txt
Directus ou Payload
Postgres
Storage externo para mídia
Webhook de rebuild
```

### Fase 5 — Backend próprio

Quando houver necessidade de:

```txt
tokens privados
integração com Meta CAPI
integração com Google Ads API
CRM próprio
área logada
disponibilidade/preço em tempo real
salvar leads em banco próprio
anti-spam mais avançado
autenticação
fila
```

---

## 25. Checklist do MVP

### Setup

- [ ] Criar projeto Astro.
- [ ] Configurar TypeScript.
- [ ] Configurar Tailwind.
- [ ] Configurar Content Collections.
- [ ] Configurar sitemap.
- [ ] Configurar estrutura de layouts.
- [ ] Configurar componentes base.

### Conteúdo

- [ ] Criar coleção de hotéis.
- [ ] Criar coleção de resorts.
- [ ] Criar coleção de destinos.
- [ ] Criar coleção de landing pages.
- [ ] Criar coleção de blog.
- [ ] Criar primeira página institucional.
- [ ] Criar primeira página de hotel.
- [ ] Criar primeira landing page.

### Formulário

- [ ] Criar componente de formulário.
- [ ] Criar validação client-side.
- [ ] Criar máscara de telefone.
- [ ] Capturar UTMs.
- [ ] Capturar `gclid`, `fbclid`, `gbraid`, `wbraid`.
- [ ] Enviar para webhook externo.
- [ ] Tratar sucesso.
- [ ] Tratar erro.
- [ ] Disparar evento no `dataLayer`.

### Tracking

- [ ] Instalar GTM.
- [ ] Configurar GA4.
- [ ] Configurar Meta Pixel.
- [ ] Configurar Google Ads Conversion.
- [ ] Configurar evento de submit.
- [ ] Configurar evento de clique no WhatsApp.
- [ ] Testar eventos no debug do GTM.
- [ ] Testar conversões.

### SEO

- [ ] Criar componente de SEO.
- [ ] Configurar title/description por página.
- [ ] Configurar canonical.
- [ ] Configurar OG tags.
- [ ] Configurar robots index/noindex.
- [ ] Gerar sitemap.
- [ ] Criar robots.txt.
- [ ] Adicionar schema FAQ quando houver FAQ.
- [ ] Adicionar schema de hotel/resort quando fizer sentido.

### Deploy

- [ ] Criar repositório no GitHub.
- [ ] Conectar projeto na Vercel.
- [ ] Configurar variáveis públicas.
- [ ] Fazer primeiro deploy.
- [ ] Configurar domínio.
- [ ] Testar páginas.
- [ ] Testar formulário em produção.
- [ ] Testar tracking em produção.

---

## 26. Decisão final

A stack final do MVP será:

```txt
Astro
TypeScript
Tailwind CSS
Content Collections
Markdown/MDX
JavaScript/TypeScript client-side
Vercel
GTM
GA4
Meta Pixel
Google Ads Conversion
Webhook externo/API externa para leads
```

A stack futura, se o projeto crescer, pode evoluir para:

```txt
Keystatic para editor simples
ou
Directus/Payload + Postgres para CMS real
ou
Backend próprio para integrações privadas e tracking server-side
```

A prioridade agora é:

```txt
subir rápido
criar páginas
testar ofertas
capturar leads
medir conversão
validar tráfego pago
criar conteúdo SEO
```

Este MVP deve evitar complexidade desnecessária e manter a arquitetura simples o suficiente para publicar e iterar rápido, mas organizada o bastante para evoluir depois sem precisar recomeçar do zero.
