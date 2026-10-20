# Thanet Hall School

A static school website built with HTML, CSS, and JavaScript. The project includes a landing page and supporting assets for a school brand and content presentation.

## Overview

This repository contains the front-end for a school website, split into the following areas:

- `index.html` — main page structure and content
- `css/style.css` — styling and site themes
- `js/script.js` — client-side behavior and interactions
- `images/` — image assets used throughout the site

## Project structure

```text
.
├── .github/
│   └── workflows/
├── css/
│   └── style.css
├── images/
├── js/
│   └── script.js
├── .gitignore
├── LICENSE
├── README.md
├── index.html
├── package.json
└── docs/
    └── DEPLOYMENT.md
```

## Local development

You can run the site locally using either Node.js or a simple static file server.

### Option 1: with Node.js

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the local server:

   ```bash
   npm run dev
   ```

3. Open your browser at:

   ```text
   http://localhost:3000
   ```

### Option 2: Python static server

If you do not want to use Node.js, you can serve the site directly from Python:

```bash
python3 -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

## Validation

To validate the HTML files:

```bash
npm run validate
```

## Deployment

This site is designed for static hosting and can be deployed to:

- GitHub Pages
- Vercel
- Netlify
- any static hosting provider

For deployment notes and environment-specific guidance, see [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md).

## License

This project is licensed under the [MIT License](LICENSE).
