# Deployment Guide

This project has an Express backend and stores form submissions in `data/submissions.json`, so it must run on a Node.js host. Static-only hosts such as GitHub Pages, Netlify, or a plain S3 bucket will serve the pages but **cannot process the contact, admission, or admin endpoints**.

## Requirements

- Node.js 18 or newer
- Write access to the `data/` directory at runtime (submissions are written to `data/submissions.json`)

## Environment variables

Copy `.env.example` to `.env` and adjust as needed:

```text
PORT=3000
NODE_ENV=production
```

## Local preview

```bash
npm install
npm run dev
```

Then open:

```text
http://localhost:3000
```

## Production start

```bash
npm install --omit=dev
npm start
```

The server listens on `process.env.PORT` and falls back to `3000`.

## Hosts that support this setup

Any Node.js host will work, for example Render, Railway, Fly.io, or a VPS with a process manager. Set the build command to `npm install` and the start command to `npm start`.

### Important storage caveat

Submissions are stored on the local filesystem, so they are lost when the host rebuilds or uses an ephemeral filesystem. For durable storage, attach a persistent volume to the deployment or move submissions to a database.

## GitHub Pages

GitHub Pages cannot run `server.js`. If you only need the brochure site, publish `index.html`, `css/`, `js/`, and `images/` as a static site and accept that the forms and admin dashboard will not work. Pointing the forms at an external API is the alternative.
