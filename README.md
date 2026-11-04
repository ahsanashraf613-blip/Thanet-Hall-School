# Thanet Hall School

A dynamic school website built with Express and vanilla frontend code. This project includes a public school website plus working contact and admission form processing backed by a local JSON data store.

## Features

- Public website homepage
- Dynamic contact form submissions
- Dynamic admission form submissions
- Admin dashboard to view form submissions
- Simple Express backend with persistent JSON storage
- Ready for future integration with email, database, authentication, or CMS features

## Project structure

```text
.
├── admin.html
├── admission.html
├── contact.html
├── css/
│   └── style.css
├── data/
│   └── submissions.json
├── js/
│   └── script.js
├── .env.example
├── .gitignore
├── README.md
├── index.html
├── package.json
├── server.js
└── LICENSE
```

## Local development

1. Install dependencies:

```bash
npm install
```

2. Start the app in development mode:

```bash
npm run dev
```

3. Open the site in the browser:

```text
http://localhost:3000
```

## Production start

```bash
npm start
```

## API endpoints

- `GET /api/health` — health check
- `POST /api/contact` — saves a contact message
- `POST /api/admission` — saves an admission inquiry
- `GET /api/submissions` — returns saved submissions

## Admin dashboard

Open:

```text
http://localhost:3000/admin
```

This dashboard displays all saved contact and admission submissions.

## Notes

This project has moved beyond a static brochure site by adding a lightweight backend and persistent storage. It can grow into a full school management system with admin authentication, database integration, and email notifications.

## License

MIT
