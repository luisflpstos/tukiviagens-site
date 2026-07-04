# Hotéis e resorts — galeria das páginas de detalhe

Uma pasta por propriedade. O **nome da pasta** segue o slug da galeria (veja tabela abaixo).

Usado em:
- `/hoteis/<slug>/` e `/resorts/<slug>/`
- Páginas de propriedade em `/olimpia/<slug>/` (e demais destinos em `src/content/paginas/`)

## Arquivos da galeria

| Arquivo | Uso |
|---------|-----|
| `capa.jpg` | Primeira foto do carrossel (também usada na home) |
| `01.jpg` | Segunda foto |
| `02.jpg` | Terceira foto |
| `03.jpg` … `05.jpg` | Fotos adicionais (até 6 no total) |

Formatos aceitos: `.jpg` ou `.webp` (ajuste o frontmatter se usar `.webp`).

## Pastas preparadas

| Pasta | Propriedade | URL principal |
|-------|-------------|---------------|
| `enjoy-olimpia-park-resort/` | Enjoy Olímpia Park Resort | `/olimpia/enjoy-olimpia-park-resort/` |
| `wyndham-olimpia-royal-hotels/` | Wyndham Olímpia Royal Hotels | `/olimpia/wyndham-olimpia-royal-hotels/` |
| `enjoy-solar-das-aguas/` | Enjoy Solar das Águas | `/olimpia/enjoy-solar-das-aguas/` |
| `hot-beach-olimpia/` | Hot Beach Olímpia | `/olimpia/hot-beach/` |
| `rio-quente-resorts/` | Resorts Rio Quente | `/rio-quente/resorts/` |
| `nordeste-all-inclusive/` | Resorts All-Inclusive Nordeste | `/nordeste/resorts-all-inclusive/` |

## Frontmatter opcional

Em `src/content/hoteis/<slug>.md`, `src/content/resorts/<slug>.md` ou `src/content/paginas/<destino>/<slug>.md`:

```yaml
images:
  - /images/hoteis/enjoy-solar-das-aguas/capa.jpg
  - /images/hoteis/enjoy-solar-das-aguas/01.jpg
```

Se `images` estiver vazio, o site tenta descobrir os arquivos na pasta automaticamente. Enquanto não houver fotos locais, o carrossel usa imagens de placeholder (Unsplash).

Mapeamento de slugs especiais: `src/lib/property-gallery.ts` e `src/lib/image-paths.ts`
