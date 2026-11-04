# Deployment Guide

The live site runs on Netlify at **https://thanet-hall-school.netlify.app**, connected to the `main` branch of this repository. Every push to `main` triggers a new deploy automatically.

## How Netlify serves this project

- `netlify.toml` publishes the static site from `public/`.
- `/api/*` requests are rewritten to `netlify/functions/api.mjs`.
- Submission data is stored in **Netlify Blobs** (`submissions` store, `contact` and `admission` keys).
- `server.js` is only used for local development and for Node hosts that run a long-lived process.

## Netlify configuration

| Setting | Value |
| --- | --- |
| Publish directory | `public` |
| Functions directory | `netlify/functions` |
| Build command | none required |
| Environment variables | none required |

Netlify installs the dependencies from `package.json` before bundling the function. No build step is needed because the site is plain HTML/CSS/JS.

## Local development

Two options:

```bash
npm install
npm run dev
```

This runs `server.js` on http://localhost:3000 and stores submissions in `data/submissions.json`.

To exercise the actual Netlify Function and Blobs locally, install the Netlify CLI and run:

```bash
netlify dev
```

Without a Netlify context the function falls back to `data/submissions.json`, so the API behaves the same either way.

## API endpoints

- `GET /api/health`
- `POST /api/contact`
- `POST /api/admission`
- `GET /api/submissions`

## Data storage

Netlify Blobs is durable across deploys and function instances, so submissions survive redeploys. To inspect or clear them, use the Netlify dashboard (Project → Blobs) or the Netlify CLI:

```bash
netlify blobs:list submissions
netlify blobs:delete submissions contact
```

Deleting a key resets that list on the next page load. The function also recreates empty lists automatically.

## Other hosts

A Node.js host such as Render, Railway, or Fly.io can run `npm start` instead. In that mode submissions are written to `data/submissions.json` on the host's filesystem, so attach a persistent volume if you need them to survive restarts.

GitHub Pages is not suitable: it cannot execute the API, so the forms and admin dashboard would not work.
