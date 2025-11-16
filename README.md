# ASUKA-MODS — Package

This bundle contains:

- `static_site/` — a ready static HTML/CSS site (ASUKA-MODS) you can deploy to GitHub Pages, Netlify or Vercel.
- `react_tailwind_starter/` — a minimal React + Vite + Tailwind starter with a simple admin panel stored in localStorage.

## ZIP content

- static_site/
- react_tailwind_starter/

## How to deploy static_site (GitHub Pages)

1. Create a new GitHub repository.
2. Upload the `static_site` folder contents to the `main` branch.
3. In repository Settings -> Pages, choose `main` branch and `/ (root)` folder, save. The site will be available at `https://<your-username>.github.io/<repo-name>/`.

## How to deploy static_site (Netlify)

1. Create a Netlify account.
2. Drag & drop the `static_site` folder into the Netlify dashboard `Sites` panel.
3. Netlify will publish a free URL.

## How to run the React + Tailwind starter (locally)

1. Install Node.js (v18+ recommended).
2. Open terminal in `react_tailwind_starter` folder.
3. Run `npm install` to install deps.
4. Run `npm run dev` to start the dev server (Vite).
5. Open the shown local URL in your browser.

### Notes about admin panel

- The admin UI stores the cards list in `localStorage` under key `asuka_cards`.
- You can add/delete cards and export the JSON file.
- For a production-ready admin, connect to a backend (Node/Express + database).

## Converting to full production

- For file uploads use a storage service (S3/Yandex Cloud/Google Cloud). Store metadata in a DB.
- Replace localStorage admin with an authenticated admin and an API.

---

If you want, I can:
- prepare a GitHub repo and push this code there for you;
- set up a simple Node/Express backend for file storage and a tiny admin;
- customize styles, icons and texts further.

