---
workflow: general-video
flow: automation
storyboard: no
message: "Oferta Relâmpago: até 20% OFF no Wyndham Olímpia Royal Hotels — vendas de 21/10 a 31/10/2026, hospedagens até 03/01/2027"
destination: instagram-reels
aspect: 1080x1920
language: pt-BR
length: 30s
angle: promo
---

## Intent

A 30-second vertical ad for Tuki Viagens selling the Wyndham Olímpia Royal Hotels flash offer.
Premium travel footage plus vibrant, playful motion graphics in the poster's identity (orange, purple,
yellow, white; dimensional type; lightning bolts; rounded photo cards; Tuki toucan). Viewers should
picture a family break from routine in Olímpia. Must read fully with sound off.

Storyboard (user's): 0–3 hook "Sua próxima pausa tem destino: OLÍMPIA!" · 3–7 "OFERTA RELÂMPAGO" /
"ATÉ 20% OFF" + toucan slide/bounce · 7–12 "WYNDHAM / Olímpia Royal Hotels" over footage + main photo card ·
12–19 amenity cards "Piscina coberta" / "Espaço kids" / "Diversão em família" · 19–24 dates
"HOSPEDAGENS ATÉ 03/01/2027" (orange) / "VENDAS DE 21/10 A 31/10/2026" (purple) · 24–30 final lockup:
logo, toucan, hotel name, ATÉ 20% OFF, "APROVEITE E COMPRE AGORA!", dates, condition line; complete by 26s, hold to 30.

## Assets

- ../Tuki-_-04.jpg.jpeg — reference poster; source of amenity crops (kids room, water playground) and layout.
- ../Novo Wyndham Olímpia Royal Hotels.mp4 — hotel video (1280×720, 50s); footage throughout + its soundtrack as the music bed.
- ../tuki boia.png — toucan mascot on inflatable ring (transparent), exactly the poster's character.
- ../../public/logotipo/logo-color.svg — Tuki Viagens logo.
- ../../public/images/hoteis/wyndham-olimpia-royal-hotels/01.jpg — indoor pool (amenity 1). 02.jpg — outdoor pool + towers (main hotel photo).

## Customizations

- Music: the hotel video's own soundtrack, edited to 30s, plus restrained whooshes/pops/impacts on reveals.

## Notes

- Sales start confirmed by user as 21/10/2026 (poster fine print says 20/10; do not use it).
- Use "ATÉ 20% OFF" consistently. Never invent prices, meals, park tickets, availability claims, countdowns or benefits.
- Avoid capa/03/04/05 hotel-folder images: they show the Thermas dos Laranjais water park, which would imply park access.
- Condition line: "Oferta sujeita à disponibilidade e às condições da promoção."

## 2026-10-23 — Versão narrada (v2, this directory)

Follow-on of the same film (same workflow, same 1080×1920 aspect), rebuilt around the user's locked
ElevenLabs voiceover. Built in `videos/wyndham-olimpia-reels-narrado/` because another session was
actively editing `videos/wyndham-oferta-relampago/` at the same time.

- Voice: `../ElevenLabs_2026-10-23T13_55_02_Nassif - Persuasive Sales & Ads_pvc_sp100_s44_sb73_v4.mp3`
  → `assets/audio/narracao-v2.mp3` (26.2s), split at its six sentence pauses and spread over 30s.
- Locked script (do not change words): "Quando foi a última vez que você deixou os problemas de lado e só
  curtiu sua família? / Essa pausa pode ser em Olímpia! / Com a Tuki Viagens, você tem até vinte por cento
  de desconto no Wyndham Olímpia Royal Hotels. / Piscina coberta, espaço kids e diversão para toda a
  família! / Reserve até trinta e um de outubro, para hospedagens até três de janeiro de dois mil e vinte e
  sete. / Fale agora com a Tuki e transforme essa vontade em viagem!"
- Arc: emotional hook (0–5) → destination (5–7.75) → offer + hotel (7.75–13.6) → amenities (13.6–17.95)
  → dates (17.95–23.75) → CTA + closing lockup (23.75–30, complete by 27).
- New copy: "Deixe os problemas de lado." / "Curta sua família." / "ESSA PAUSA TEM DESTINO" / "OLÍMPIA!" /
  "RESERVE ATÉ 31/10/2026" / "HOSPEDAGENS ATÉ 03/01/2027" / "Vendas de 21/10 a 31/10/2026." /
  "FALE AGORA COM A TUKI" / "Transforme essa vontade em viagem!".
- Music: hotel film soundtrack re-edited (`assets/audio/trilha-narrado.wav`): src 5.64–12.52 (soft intro,
  drop lands on "Olímpia!" at 6.86) + 12.48–30.22 + 44.13–49.9 (ending sting ≈24.9), carved under the voice.
- Captions: on-screen copy is the caption treatment wherever it carries the spoken phrase; a caption line
  carries "Quando foi a última vez que você…" in the hook.
- Mix (user request, 2026-10-23): delivery at −12 LUFS integrated (measured −11.9, true peak −1.0 dBTP), voice
  clearly above the bed. Voice bus (`hf-audio-group#voiceover`: highpass, compressor, +2 dB @3 kHz), bed 0.42 +
  carve 0.8, SFX ~−10 dB, master chain gain → compressor → truepeak −1.5. Voice sits 6–11 LU over music+SFX.
