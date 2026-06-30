# Hotéis e resorts — imagens da home

Uma pasta por propriedade. Nome da pasta = slug da URL.

**Arquivo esperado em cada pasta:** `capa.jpg` (ou `.webp`)

| Pasta | Propriedade |
|-------|-------------|
| `enjoy-olimpia-park-resort/` | Enjoy Olímpia Park Resort |
| `wyndham-olimpia-royal-hotels/` | Wyndham Olímpia Royal Hotels |
| `enjoy-solar-das-aguas/` | Enjoy Solar das Águas |
| `hot-beach-olimpia/` | Hot Beach Olímpia |
| `rio-quente-resorts/` | Resorts Rio Quente |
| `nordeste-all-inclusive/` | Resorts All-Inclusive Nordeste |

Mapeamento no código: `src/lib/image-paths.ts`

Enquanto `capa.jpg` não existir, a home usa fotos Unsplash de fallback.
