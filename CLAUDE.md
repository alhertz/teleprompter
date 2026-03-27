# Teleprompter — AI Agent Guide

## What This Is

A training teleprompter for Folio Inventory, deployed on Vercel behind Google OAuth (`@folio.co` only). The actual content is a single standalone HTML file; Next.js is only here to provide server-side auth.

## Key Decisions

- **Single HTML file** — All teleprompter content is in `public/teleprompter.html`. No React, no components, no build step for the content itself. This is intentional — keep it simple.
- **Next.js is just an auth wrapper** — The only reason Next.js exists in this project is to run NextAuth.js middleware that blocks unauthenticated access to the static HTML. Do not add pages, components, or complexity to the Next.js layer.
- **Folio design system** — The HTML uses Folio's color tokens (orange + lime green only), Be Vietnam Pro font, and component patterns (cards, alerts, badges, buttons). Do not introduce Tailwind or other CSS frameworks.
- **Material Icons** — Loaded via Google Fonts CDN. Use icon names from https://fonts.google.com/icons.

## File Layout

```
public/teleprompter.html  — THE file. All content, styles, and JS.
middleware.ts              — Auth gate. Runs on every request.
app/api/auth/[...nextauth]/route.ts — Google OAuth config + domain allowlist.
app/layout.tsx             — Minimal shell (do not add to this).
app/page.tsx               — Redirects / to /teleprompter.html.
```

## Editing Content

The teleprompter content is a JS array called `cards` in `public/teleprompter.html`. Each card has:

```javascript
{ step: "Part 1", title: "Title", duration: "3 min", body: say(`...`) + demo(`...`) }
```

Three helper functions generate styled blocks:
- `say(html)` — Orange. Trainer script.
- `demo(html)` — Green. Demo steps.
- `tip(html)` — Green dashed. Tips.

The `steps` array near the top generates the table of contents. Keep it in sync with `cards`.

## Auth Configuration

Domain allowlist is in `app/api/auth/[...nextauth]/route.ts`:

```typescript
const ALLOWED_DOMAINS = ["folio.co"];
```

To allow additional domains or specific emails, edit the `signIn` callback.

## Terminology

- Use "Counts" not "Snapshots" for inventory count sessions in all user-facing content. The codebase uses `Snapshot` internally but customers see "Count."
- Use "Items" and "Locations" as-is.

## Environment Variables

Secrets are set in Vercel (Folio team), not committed:
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` — from Google Cloud Console (Hotel Map project)
- `NEXTAUTH_SECRET` — random session encryption key
- `NEXTAUTH_URL` — `https://teleprompter.folio.co`

For local dev, copy these into `.env.local` (gitignored).

## Deployment

Pushes to `main` auto-deploy via Vercel. No manual deploy needed.

## Do Not

- Add complexity to the Next.js layer — it's an auth wrapper, not an app
- Use Tailwind, styled-components, or CSS modules — inline styles with Folio tokens only
- Commit `.env.local` or secrets
- Use blue/teal/rose colors — only orange and lime green from Folio's palette
- Use "Snapshot" in user-facing content — always "Count"
