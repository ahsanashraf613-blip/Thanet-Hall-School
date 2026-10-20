# Deployment Guide

This project is a static website, so deployment is straightforward.

## Recommended options

### GitHub Pages

1. Push the repository to GitHub.
2. Open the repository settings.
3. Enable GitHub Pages.
4. Select the `main` branch as the deploy source.
5. Publish the site.

### Vercel

1. Import the repository into Vercel.
2. Keep the default build settings for a static site.
3. Set the project root to the repository root.
4. Deploy.

### Netlify

1. Import the repository.
2. Use the default static site settings.
3. Publish the site.

## Notes

- The site does not require a backend or database.
- Images and CSS are served as static assets.
- Any future JavaScript enhancements should remain browser-safe and lightweight.

## Local preview

```bash
npm run dev
```

Then open:

```text
http://localhost:3000
```
