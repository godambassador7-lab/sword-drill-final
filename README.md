# Sword Drill

Bible memorization and study companion built with React. Includes Sword Drill Ultimate quizzes, Bible reader, verse detective, achievements, and progress tracking backed by Firebase. Deploys to GitHub Pages and is PWA-ready once the service worker and manifest are wired in.

## Features
- Sword Drill Ultimate timed quiz with sound effects, background music, and streaks.
- Bible reader with references, lexicon links, and study plans (97+ plans in data files).
- Achievements and progress saved to Firebase Realtime Database.
- Personal Verse Detective, multiple-choice flows, Hebrew calendar integrations, and more ancillary study tools.
- Responsive Tailwind UI (Tailwind via CDN in `public/index.html`).

## Tech Stack
- React 19 / react-scripts 5
- Firebase SDK 12 (auth + realtime database)
- TailwindCSS (CDN) and Recharts
- Deployed via `gh-pages` to `https://godambassador7-lab.github.io/sword_drill`

## Project Structure
- `src/App.js` – main app logic, routing by view, quiz/game flows, audio controls.
- `src/index.js` – React entry point.
- `src/serviceWorkerRegistration.js` – CRA service worker helper (not yet wired).
- `public/` – static assets, large Bible/lexicon datasets, PWA manifests (`manifest.json`, `site.webmanifest`), icons, sounds, and HTML shell.

## Getting Started
1) Install: `npm install`
2) Run dev server: `npm start` (http://localhost:3000)
3) Build: `npm run build`
4) Deploy to GitHub Pages: `npm run deploy` (uses `homepage` from package.json)

## Environment
- `.env` should contain your Firebase config keys and any API endpoints used by `dbService`/`esvProvider`.
- The app assumes public assets under `/sword_drill/` when deployed to GitHub Pages.

## PWA Notes
- Manifests and icons exist in `public/`, but `public/index.html` still needs a `<link rel="manifest" ...>` and `src/index.js` should call `serviceWorkerRegistration.register()` to enable offline/install.

## Testing
- `npm test` runs CRA’s Jest/Testing Library suite. No custom tests are defined yet.

## Legal
Copyright (c) 2025 Demetrius Smith.  
All Rights Reserved.

Unauthorized copying, modification, redistribution, or use of this software in whole or in part is strictly prohibited.
