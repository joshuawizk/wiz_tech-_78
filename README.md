# WIZTECH

A responsive personal portfolio for WIZTECH, built with React, Vite, Tailwind CSS, Framer Motion, and Lucide icons.

## Development

```sh
npm install
npm run dev
```

## Checks and production build

```sh
npm run lint
npm run build
npm run preview
```

## Project structure

- `src/components/` — shared navigation, footer, section headings, and reveal animation
- `src/sections/` — the home, about, skills, projects, experience, blog, and contact sections
- `src/data/` — editable project and skill content
- `public/` — static favicon and other public assets

## Deployment

The site is static and can be deployed to Vercel or another static host using `npm run build`; the output directory is `dist`. A backend is not required for the portfolio. The contact form currently validates in the browser only and does not send or store submissions. Connect it to a secure backend or Supabase Edge Function before accepting messages, and keep service credentials out of frontend code.

Replace the clearly marked contact and social profile placeholders when those details are available. Project links and draft article ideas are also intentionally not presented as live URLs or published posts.
