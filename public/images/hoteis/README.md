# Hotéis e resorts — galeria das páginas de detalhe

Uma pasta por propriedade. O **nome da pasta** segue o slug da galeria (pode ser diferente da URL).

Usado em:
- `/hoteis/<slug>/` e `/resorts/<slug>/`
- Páginas de propriedade em `/olimpia/<slug>/`, `/rio-quente/<slug>/`, etc.
- Card da home (`capa.jpg`)

## Arquivos da galeria

| Arquivo | Uso |
|---------|-----|
| `capa.jpg` | Primeira foto do carrossel (também usada na home e OG social) |
| `01.jpg` | Segunda foto |
| `02.jpg` | Terceira foto |
| `03.jpg` … `05.jpg` | Fotos adicionais (até 6 no total) |

**Formato:** `.jpg`, `.jpeg`, `.webp` ou `.png` (maiúsculas/minúsculas aceitas). Ajuste o frontmatter se usar extensão diferente de `.jpg`.  
**Dimensões:** 1200×900 ou 1600×1200 (proporção **4:3**). Ver [README principal](../../../README.md#imagens).

## Pastas — Olímpia

| Pasta | URL principal |
|-------|---------------|
| `enjoy-olimpia-park-resort/` | `/olimpia/enjoy-olimpia-park-resort/` |
| `wyndham-olimpia-royal-hotels/` | `/olimpia/wyndham-olimpia-royal-hotels/` |
| `enjoy-solar-das-aguas/` | `/olimpia/enjoy-solar-das-aguas/` |
| `hot-beach-olimpia/` | `/olimpia/hot-beach/` |
| `hot-beach-resort/` | `/olimpia/hot-beach-resort/` |
| `thermas-park-resort-hot-beach-raizes/` | `/olimpia/thermas-park-resort-hot-beach-raizes/` |
| `celebration-resort-olimpia/` | `/olimpia/celebration-resort-olimpia/` |
| `carpe-diem-eco-resort-olimpia/` | `/olimpia/carpe-diem-eco-resort-olimpia/` |
| `thermas-olimpia-resorts-mercure/` | `/olimpia/thermas-olimpia-resorts-mercure/` |
| `hot-beach-suites/` | `/olimpia/hot-beach-suites/` |
| `wyndham-royal-star-thermas-resort/` | `/olimpia/wyndham-royal-star-thermas-resort/` |
| `villa-italia-olimpia/` | `/olimpia/villa-italia-olimpia/` |
| `parque-das-aguas/` | `/olimpia/parque-das-aguas/` |
| `hotel-fazenda-haras/` | `/olimpia/hotel-fazenda-haras/` |
| `hotel-dolce-dulce/` | `/olimpia/hotel-dolce-dulce/` |
| `agua-viva-hotel/` | `/olimpia/agua-viva-hotel/` |
| `tiffany-hotel/` | `/olimpia/tiffany-hotel/` |
| `villa-rebellato/` | `/olimpia/villa-rebellato/` |
| `gloria-hotel/` | `/olimpia/gloria-hotel/` |
| `js-thermas-hotel/` | `/olimpia/js-thermas-hotel/` |

## Pastas — Rio Quente

| Pasta | URL principal |
|-------|---------------|
| `prime-hotel-aguas-da-serra/` | `/rio-quente/prime-hotel-aguas-da-serra/` |
| `serra-madre-hotel/` | `/rio-quente/serra-madre-hotel/` |
| `thermas-paradise/` | `/rio-quente/thermas-paradise/` |
| `aguas-da-serra-rio-quente/` | `/rio-quente/aguas-da-serra-rio-quente/` |
| `hotel-giardino-rio-quente/` | `/rio-quente/hotel-giardino-rio-quente/` |
| `img-hotel-rio-quente/` | `/rio-quente/img-hotel-rio-quente/` |
| `park-veredas-resort/` | `/rio-quente/park-veredas-resort/` |
| `apartamentos-em-rio-quente/` | `/rio-quente/apartamentos-em-rio-quente/` |
| `hotel-luupi-rio-quente/` | `/rio-quente/hotel-luupi-rio-quente/` |
| `refugio-grand-premium/` | `/rio-quente/refugio-grand-premium/` |
| `hotel-cristal-rio-quente/` | `/rio-quente/hotel-cristal-rio-quente/` |
| `hotel-pousada-rio-quente/` | `/rio-quente/hotel-pousada-rio-quente/` |
| `eco-chales-rio-quente/` | `/rio-quente/eco-chales-rio-quente/` |
| `thermas-paradise-residence/` | `/rio-quente/thermas-paradise-residence/` |
| `rio-quente-resorts/` | `/rio-quente/resorts/` |

## Outras pastas

| Pasta | Uso |
|-------|-----|
| `nordeste-all-inclusive/` | Nordeste |

## Frontmatter opcional

Em `src/content/hoteis/<slug>.md`, `src/content/resorts/<slug>.md` ou `src/content/paginas/<destino>/<slug>.md`:

```yaml
images:
  - /images/hoteis/enjoy-solar-das-aguas/capa.jpg
  - /images/hoteis/enjoy-solar-das-aguas/01.jpg
```

Se `images` estiver vazio, o site tenta descobrir os arquivos na pasta automaticamente. Enquanto não houver fotos locais, o carrossel usa placeholders (Unsplash).

Mapeamento de slugs especiais: `src/lib/property-gallery.ts` e `src/lib/image-paths.ts`
