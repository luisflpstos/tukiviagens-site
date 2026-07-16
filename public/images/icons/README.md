# Ícones 3D Tuki Viagens

PNG fonte em `public/images/icons/`. O site consome **WebP** (max **304 px**, gerado por `pnpm run optimize-images` / `prebuild`).

Usar via `TUKI_ICONS` (`src/lib/icons.ts`) e o componente `<TukiIcon />`.

| Arquivo fonte | Chave | Uso no site |
|---------------|-------|-------------|
| `icone-aviao-tuki-viagens.png` | `aviao` | Badge mascote, marquee |
| `icone-cadeira-praia-tuki-viagens.png` | `cadeiraPraia` | Marquee |
| `icone-cama-tuki-viagens.png` | `cama` | Marquee |
| `icone-carro-tuki-viagens.png` | `carro` | Marquee |
| `icone-gramado-tuki-viagens.png` | `gramado` | Destino Gramado |
| `icone-hotel-tuki-viagens.png` | `hotel` | Trust / marquee |
| `icone-mala-tuki-viagens.png` | `mala` | Marquee |
| `icone-mapa-tuki-viagens.png` | `mapa` | Trust / marquee |
| `icone-nordeste-tuki-viagens.png` | `nordeste` | Destino Nordeste |
| `icone-oculos-boia-tuki-viagens.png` | `oculosBoia` | Marquee |
| `icone-olimpia-tuki-viagens.png` | `olimpia` | Destino Olímpia |
| `icone-pacotes-brasil-tuki-viagens.png` | `pacotesBrasil` | Destino Pacotes Brasil |
| `icone-passaporte-tuki-viagens.png` | `passaporte` | Marquee |
| `icone-piscina-tuki-viagens.png` | `piscina` | Marquee |
| `icone-placa-ferias-tuki-viagens.png` | `placaFerias` | Marquee |
| `icone-rio-de-janeiro-tuki-viagens.png` | `rioDeJaneiro` | Destino Rio de Janeiro |
| `icone-rio-quente-tuki-viagens.png` | `rioQuente` | Destino Rio Quente |
| `icone-sol-tuki-viagens.png` | `sol` | Marquee |
| `icone-atendimento-humano-tuki-viagens.png` | `atendimento` | Why Tuki / trust |
| `icone-seguranca-tuki-viagens.png` | `seguranca` | Why Tuki / trust |
| `icone-pacote-completo-tuki-viagens.png` | `pacote` | Why Tuki |
| `icone-calendario-reservas-tuki-viagens.png` | `calendario` | Why Tuki |
| `icone-conte-planos-tuki-viajens.png` | `contePlano` | How it works |
| `icone-receba-opcoes-tuki-viajens.png` | `recebaOpcoes` | How it works |
| `icone-viajar-com-seguranca-tuki-viajens.png` | `viajarSeguranca` | How it works |

**Pipeline:** após adicionar/atualizar um PNG, rode `pnpm run optimize-images` (já roda no `prebuild`).

**Não substituir:** logos SVG (`/logotipo/`), favicon, ícone WhatsApp (marca da plataforma).
