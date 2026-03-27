# Folio Inventory Teleprompter

A card-based training walkthrough for Folio Inventory, deployed behind Google OAuth so only `@folio.co` team members can access it.

**Live:** https://teleprompter.folio.co

## How It Works

- **Single HTML file** (`public/teleprompter.html`) — standalone teleprompter with no build step
- **Next.js + NextAuth.js** — wraps the HTML with server-side Google OAuth
- **Vercel** — hosts and deploys automatically on push to `main`

## Local Development

```bash
npm install
npm run dev
```

Then visit http://localhost:3000. You'll need a `.env.local` file:

```
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=<any-random-string>
GOOGLE_CLIENT_ID=<from-google-cloud-console>
GOOGLE_CLIENT_SECRET=<from-google-cloud-console>
```

Google OAuth credentials are in the **Hotel Map** project in [Google Cloud Console](https://console.cloud.google.com/apis/credentials?project=hotel-map-419305). The redirect URIs configured are:

- `http://localhost:3000/api/auth/callback/google`
- `https://teleprompter.folio.co/api/auth/callback/google`

## Editing the Teleprompter Content

All training content lives in `public/teleprompter.html`. It's a self-contained HTML file with inline CSS and JS — no framework, no build step.

### Structure

The content is defined as a JavaScript array of card objects:

```javascript
const cards = [
  {
    step: "Part 1",
    title: "Introduction",
    duration: "3 min",
    body: say(`<p>Your script here</p>`) + demo(`<p>Demo steps</p>`)
  },
  // ...
];
```

### Block Types

- `say(html)` — Orange block. What the trainer says out loud.
- `demo(html)` — Green block. Actions to demonstrate on screen.
- `tip(html)` — Green dashed block. Tips to mention.

### Adding a New Card

Add an entry to the `cards` array and a corresponding entry to the `steps` array (for the table of contents).

### Styling

Uses Folio's design system tokens (Be Vietnam Pro font, orange + lime green palette). Material Icons loaded via CDN.

## Deployment

Pushes to `main` auto-deploy to https://teleprompter.folio.co via Vercel.

### Environment Variables (Vercel)

Set in the Folio team's Vercel project settings:

| Variable | Description |
|---|---|
| `GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret |
| `NEXTAUTH_SECRET` | Random string for session encryption |
| `NEXTAUTH_URL` | `https://teleprompter.folio.co` |

## Auth

- Only `@folio.co` Google accounts can sign in
- Controlled in `app/api/auth/[...nextauth]/route.ts` via the `ALLOWED_DOMAINS` array
- To add more domains or specific emails, edit the `signIn` callback in that file

## Project Structure

```
public/
  teleprompter.html       # The actual teleprompter (all content lives here)
app/
  layout.tsx              # Minimal Next.js shell
  page.tsx                # Redirects / to /teleprompter.html
  api/auth/[...nextauth]/
    route.ts              # Google OAuth config + domain allowlist
middleware.ts             # Auth gate — blocks unauthenticated requests
```
