# Portfolio — Juan Camilo Melo

Portfolio personal construido con **Astro + Tailwind CSS v4 + React islands**,
según la especificación de `DESIGN_BRIEF.md`.

## Comandos

```bash
npm install
npm run dev      # servidor de desarrollo en http://localhost:4321
npm run build    # build estático en dist/
npm run preview  # previsualizar el build
```

## Dónde está cada cosa

| Qué | Dónde |
| --- | --- |
| **Todo el contenido** (bio, proyectos, skills, contacto) | `src/data/site.ts` — única fuente tipada |
| Wordmark halftone del hero | `src/react/HalftoneHero.tsx` |
| Cursor personalizado (punto + anillo) | `src/react/CustomCursor.tsx` |
| Smooth scroll con inercia (Lenis) | `src/react/SmoothScroll.tsx` |
| Ticker de skills reactivo al scroll | `src/react/VelocityTicker.tsx` |
| CTA magnético | `src/react/MagneticLink.tsx` |
| Reveal de texto con blur | `src/react/BlurReveal.tsx` |
| Rutas | `src/pages/` — `index`, `about`, `cv`, `proyectos/[slug]` |

## Pendientes para personalizar

1. **Tu foto**: reemplaza `public/images/portrait-placeholder.svg` por tu foto
   real (puede ser `.jpg`/`.png` — actualiza la ruta `portrait` en
   `src/data/site.ts`).
2. **Fotos de proyectos**: reemplaza los `.svg` de `public/images/projects/`
   por capturas reales y actualiza el campo `image` de cada proyecto en
   `src/data/site.ts`.
3. **URLs de repos**: rellena los campos `repo` marcados con `TODO` en
   `src/data/site.ts` (el botón "Ver repositorio" aparece solo cuando existe).
4. **CV**: el visor y la descarga apuntan a `public/cv.pdf`. Para actualizarlo,
   reemplaza ese archivo.
5. **Wordmark**: por defecto es `['JUAN CAMILO', 'MELO']`; la alternativa corta
   `['MELO088']` se cambia en `src/data/site.ts`.
