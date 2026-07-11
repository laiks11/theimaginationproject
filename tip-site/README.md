# The Imagination Project — Website

Static site. No build step.

## Deploy to Netlify
1. Push this folder to a GitHub repo (files at repo root).
2. In Netlify: **Add new site → Import from Git**, pick the repo.
3. Build command: *(leave empty)* · Publish directory: `/` (root).

## Forms
All five Get Involved forms use built-in Netlify Forms (`data-netlify="true"`).
Submissions appear under **Site → Forms** in the Netlify dashboard after the first deploy.
Enable email notifications there if you want them forwarded.

## Structure
- `index.html` — hero (WebGL background, 8-language switcher), mission, pillars, stats, program feature, quote, CTA
- `about.html` — problem / solution / theory of change & action (accordions) / values / leadership
- `get-involved.html` — translate · chapter · research · volunteer · partner (Netlify forms)
- `programs.html`, `impact.html` — reachable from the ☰ drawer
- `css/main.css`, `js/main.js`, `js/hero.js`, `assets/`

Fonts load from Google Fonts (Instrument Serif, Archivo, IBM Plex Mono).
