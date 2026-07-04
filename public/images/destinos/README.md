# Destinos — galeria das páginas hub

Uma pasta por destino. O **nome da pasta** deve ser o slug do hub (ex.: `olimpia` para `/olimpia/`).

## Arquivos da galeria

| Arquivo | Uso |
|---------|-----|
| `capa.jpg` | Primeira foto do carrossel |
| `01.jpg` | Segunda foto |
| `02.jpg` | Terceira foto |
| `03.jpg` … `05.jpg` | Fotos adicionais (até 6 no total) |

## Pastas preparadas

| Pasta | Destino |
|-------|---------|
| `olimpia/` | Hub Olímpia |
| `rio-quente/` | Hub Rio Quente |
| `nordeste/` | Hub Nordeste |
| `pacotes-brasil/` | Pacotes Brasil |
| `rio-de-janeiro/` | Rio de Janeiro |
| `gramado/` | Gramado e Serra Gaúcha |

## Frontmatter opcional

No arquivo `src/content/paginas/<slug>.md` (páginas `pageType: hub`):

```yaml
images:
  - /images/destinos/olimpia/capa.jpg
  - /images/destinos/olimpia/01.jpg
```

Se `images` estiver vazio, o site tenta descobrir os arquivos na pasta. Sem fotos locais, o carrossel usa placeholders.

Referência: `src/lib/image-paths.ts` → `IMAGE_PATHS.destinos`
