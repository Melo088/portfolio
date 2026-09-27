# Juan Camilo Melo · Portfolio

Personal portfolio: Cloud & DevOps engineering. Ink on paper: a static
Astro site with a WebGL hero, SVG ink-bleed type and a print grain over
everything.

## Stack

- [Astro](https://astro.build) (static output) with React islands for the
  interactive pieces
- Tailwind CSS v4
- WebGL (hand-written shader) for the hero, SVG filters for the type
- Lenis for inertial scrolling
- Archivo (variable width) and JetBrains Mono, self-hosted via Fontsource

## Commands

```bash
npm ci
npm run dev      # dev server at http://localhost:4321
npm run build    # static build in dist/
npm run preview  # serve the build locally
```

## Where things live

| What | Where |
| --- | --- |
| All content (profile, now, projects, experience, skills) | `src/data/site.ts`, the single typed source |
| Hero: bleeding wordmark over a halftone butterfly | `src/react/InkHero.tsx` |
| Ink filters, print grain, nav surface switch | `src/layouts/Base.astro` |
| Design tokens (paper and carbon surfaces), type | `src/styles/global.css` |
| "m" mark, also the favicon | `src/components/Mark.astro`, `public/favicon.svg` |
| Pages | `src/pages/`: `index`, `about`, `cv`, `projects/[slug]` |

## Credits

Hero butterfly: *Nymphalis antiopa*, plate from *Birds Illustrated* (Nature
Study Publishing Co., Chicago, c. 1900), public domain via
[Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Nymphalis_antiopa-black.jpg).
