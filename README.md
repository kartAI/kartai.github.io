# KartAI — Sluttrapport (scrollytelling startprosjekt)

## Filstruktur

```
kartai-report/
├── index.html        ← Innhold og struktur
├── style.css         ← All styling (CSS-variabler øverst)
├── script.js         ← Scroll-animasjoner, accordion, slider, teller
├── assets/           ← Opprett og legg til egne mediafiler her
│   ├── hero.mp4      ← Hero-video (TiltaksAid / KRS / Karianne Tung)
│   ├── goal-bg.jpg   ← Bakgrunnsbilde for Målsetting-seksjonen
│   └── students.jpg  ← Studentbilde for Hvordan-seksjonen
└── README.md
```

## Kom i gang

```bash
# Åpne direkte i nettleser
open index.html

# Eller kjør en lokal server (anbefalt for video)
npx serve .
# eller
python3 -m http.server 8080
```

## Hva du MÅ bytte ut

### 1. Tall (fakta og statistikk)
Søk etter `→ Bytt inn faktisk tall` i index.html.
Endre `data-target`-attributtet på hvert element:
```html
<div class="fact-number counter" data-target="60" data-suffix="%">0%</div>
```

### 2. Bilder og video
Legg til filer i `assets/`-mappen:
- `assets/hero.mp4` — Hero-video (bakgrunnsVideo, autoplay, muted)
- `assets/goal-bg.jpg` — Bakgrunnsbilde for målsetting
- `assets/students.jpg` — Studentbilde

For bakgrunnsbilde i Målsetting-seksjonen, bytt ut `.goal-bg-placeholder` med:
```html
<img src="assets/goal-bg.jpg" alt="KartAI foredrag" style="width:100%;height:100%;object-fit:cover;">
```

### 3. Partnere
I `#hvem`-seksjonen:
- Bytt ut `.partner-logo-placeholder` med faktiske logo-bilder
- Legg til/fjern partnerkort etter behov

### 4. Prosjektlenker
Søk etter `href="#"` i accordion-seksjonen og legg inn faktiske URL-er.

### 5. Referanser
Oppdater lenker i `#referanser`-seksjonen.

## Tilpasse farger
Øverst i `style.css`:
```css
:root {
  --col-accent: #1A46C4;   /* Blå aksent → bytt for annet fargetema */
  --col-accent2: #0BC47A;  /* Grønn aksent */
  --col-dark: #0A0F1E;     /* Mørk bakgrunn (hero, footer, ringvirkninger) */
}
```

## Legge til nye seksjoner

### Scrollama sticky-seksjon
Legg til i HTML:
```html
<section class="sticky-section">
  <div class="sticky-graphic"><!-- det som er sticky --></div>
  <div class="steps">
    <div class="step">Steg 1-tekst</div>
    <div class="step">Steg 2-tekst</div>
  </div>
</section>
```
Scrollama er allerede lastet inn og klar i `script.js`.

### Ny accordion-fane
Kopier et eksisterende `.accordion-item`-element og oppdater innhold.

## Avhengigheter (CDN, ingen npm nødvendig)
- **Scrollama 3.2** — scroll-triggering
- **Google Fonts** — DM Sans, Space Mono, DM Serif Display

## Hosting
Siden er 100% statisk HTML/CSS/JS — kan hostes på:
- **Vercel**: `vercel deploy`
- **Netlify**: drag-and-drop mappen
- **GitHub Pages**: push til repo, aktiver Pages
- Kommunens egne servere

## Videre utvikling
- Legg til GSAP ScrollTrigger for mer avanserte animasjoner
- Bruk Swiper.js for bildeserier med thumbnails
- Integrer Mapbox/Leaflet for kartvisualisering
- D3.js for datavisualisering av faktaene
