# WIZTECH

A responsive personal portfolio for WIZTECH, built with React, Vite, Tailwind CSS, Framer Motion, and Lucide icons.

## Development

```sh
npm install
npm run dev
```

## Supabase client configuration

Copy `.env.example` to `.env.local` and replace the placeholders for
`VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` with your project
configuration. Restart the Vite dev server after changing environment values.
These `VITE_` values are exposed in the browser bundle; never put a service-role
key or other server secret in `.env.local` or frontend code. The `/admin` area
uses Supabase Auth and checks administrator authorization through the database.

## Admin authentication and database foundation

The migration in `supabase/migrations/` creates the content tables and Row Level
Security policies. It has been applied to the WIZTECH Supabase project.
Published portfolio content and the public profile row are readable without
sign-in; draft content and all writes require the allowlisted administrator.
Contact messages are not included because the current contact form does not
submit or store messages.

To provision the single administrator after reviewing and applying the
migration, create or invite the account through Supabase Authentication, then
insert that user's Auth ID into `public.admin_users` using the Supabase SQL
Editor. The browser has no permission to modify that allowlist. Do not add a
public sign-up flow or rely on user-editable metadata for administrator access.

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
