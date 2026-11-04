# Thanet Hall School

A dynamic school website built with Express and vanilla frontend code. This project includes a public school website plus working contact and admission form processing backed by a local JSON data store.

## Features

- Public website homepage
- Dynamic contact form submissions
- Dynamic admission form submissions
- Password-protected admin dashboard to view form submissions
- Simple Express backend with persistent JSON storage
- Ready for future integration with email, database, or CMS features

## Project structure

```text
.
├── public/
│   ├── admin.html
│   ├── admission.html
│   ├── contact.html
│   ├── index.html
│   ├── css/
│   │   ├── style.css
│   │   └── tailwind.css
│   ├── images/
│   └── js/
│       └── script.js
├── src/
│   └── tailwind.css
├── netlify/
│   └── functions/
│       ├── _auth.mjs
│       ├── _storage.mjs
│       └── api.mjs
├── data/
│   └── submissions.json
├── docs/
│   └── DEPLOYMENT.md
├── .env.example
├── .gitignore
├── LICENSE
├── README.md
├── netlify.toml
├── package.json
├── server.js
└── tailwind.config.js
```

`server.js` runs the site locally. On Netlify, the same API is served by `netlify/functions/api.mjs`, which stores submissions in Netlify Blobs instead of the local JSON file.

## Local development

1. Install dependencies:

```bash
npm install
```

2. Create a local `.env` from `.env.example` and set `ADMIN_PASSWORD`:

```bash
cp .env.example .env
```

3. Start the app in development mode:

```bash
npm run dev
```

`npm run dev` rebuilds `public/css/tailwind.css` and then starts the server. Run `npm run build:css` on its own after changing Tailwind classes in the HTML.

4. Open the site in the browser:

```text
http://localhost:3000
```

Set `PORT` in `.env` if port 3000 is already taken.

## Production start

```bash
npm start
```

## API endpoints

- `GET /api/health` — health check
- `POST /api/contact` — saves a contact message
- `POST /api/admission` — saves an admission inquiry
- `POST /api/login` — exchanges `ADMIN_PASSWORD` for an 8-hour session cookie
- `POST /api/logout` — clears the session cookie
- `GET /api/submissions` — returns saved submissions (requires an admin session)

## Admin dashboard

Set `ADMIN_PASSWORD` in `.env` (local) or in the host's environment variables, then open:

```text
http://localhost:3000/admin
```

The dashboard asks for the password before it loads submissions. The session is stored in a signed, HttpOnly, SameSite=Strict cookie and expires after 8 hours. Set `ADMIN_SESSION_SECRET` to sign cookies with a key separate from the password; it defaults to `ADMIN_PASSWORD`.

## Notes

This project has moved beyond a static brochure site by adding a lightweight backend, persistent storage, and authenticated admin access. It can grow into a full school management system with database integration and email notifications.

## Deployment

The live site is https://thanet-hall-school.netlify.app. Netlify publishes `public/` and routes `/api/*` to `netlify/functions/api.mjs`, which persists submissions in Netlify Blobs. See `docs/DEPLOYMENT.md` for details.

## License

MIT
