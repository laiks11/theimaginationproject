# The Imagination Project — Website

A static, no-build website for The Imagination Project. Plain HTML, CSS, and a
small JS file, so it can be hosted anywhere, including GitHub Pages, with no
toolchain.

## Pages
- `index.html` — Home (hero, scroll-spy table of contents, mission, four values, programs preview, animated imagination interlude, Policy Lab teaser, founder's word, FAQ, donate, footer)
- `programs.html` — All programs grouped Now / Next / Future
- `policy.html` — The Policy Lab manifesto and roadmap
- `about.html` — Mission, vision, the problem, values, and founder bio
- `materials.html` — Core Skills Lab: the "Free materials" page, with monthly challenge cards, download buttons, language tags, and an embed slot for inline file previews

The homepage uses a "theatre" scroll feel: top-level sections snap to fill the
viewport as you scroll (desktop only), with a gold scroll-progress bar, giant
faint section numerals, an editorial drop cap, and a hero scroll cue.

Nav: links sit left (Programs, Policy, About us), the logo + title is centered and
links home, and Free materials / Read / Donate sit right, in the style of the
reference site. On the homepage a sticky "On this page" bar reveals each section
title as you scroll past it.

## Structure
```
website/
  index.html
  programs.html
  policy.html
  about.html
  css/site.css
  js/site.js
  assets/        logos, founder photo, group photo, navy mark
```

## Deploy to GitHub Pages (repo: laiks11/theimaginationproject)

This site lives in the `website/` folder. To publish it at the repo root so
GitHub Pages serves it cleanly:

1. Copy the **contents** of `website/` into the root of the repository
   (so `index.html`, `css/`, `js/`, `assets/` sit at the top level).
2. Commit and push to the `main` branch.
3. In the repo: **Settings → Pages → Build and deployment → Source: Deploy from
   a branch**, choose `main` / `/ (root)`, save.
4. The site goes live at `https://laiks11.github.io/theimaginationproject/`
   within a minute or two. (For a custom domain like theimaginationproject.org,
   add it under Settings → Pages → Custom domain.)

If you prefer to keep the folder, set Pages source to the `/website` directory
isn't supported directly; either move files to root (step 1) or use a `docs/`
folder and select `/docs` as the Pages source.

## Things to fill in later
- **Free materials embed:** `materials.html` has a `#embed-slot` placeholder and
  `Download` buttons pointing at `#`. Drop in real PDF / Drive links to embed the
  monthly challenge inline and enable downloads.
- **Donate link:** every "Donate" button currently points to `#donate`
  (the gold CTA band). Replace those `href="#donate"` / `href="index.html#donate"`
  values with your real donation URL when ready.
- **Newsletter:** the footer form is a front-end placeholder (shows a thank-you
  message). Wire it to your email provider's form action when ready.
- **Photos:** the gradient blocks marked "Program photo" / "Assembly photo" are
  placeholders. Drop in real images and swap the `.ph` blocks for `<img>` tags.

## Brand
Navy `#0C2F5D`, gold `#FFDE59`, Libre Baskerville (display) + Libre Franklin
(text), loaded from Google Fonts. Full system lives in the parent design-system
project.
