# Sword Drill

Bible memorization and study companion built with React. Includes Sword Drill Ultimate quizzes, Bible reader, verse detective, achievements, and progress tracking backed by Firebase. Deploys to GitHub Pages and is PWA-ready once the service worker and manifest are wired in.

## Features
- **Sword Drill Ultimate** timed quiz with sound effects, background music, and streaks.
- **Biblical or Nah?** 🆕 - 200+ quiz testing if common phrases are actually in the Bible
- **Storyline Quiz** - Chronological drag-and-drop event ordering with 44+ packs
- **Bible Word Search Journey** - 250 puzzles with hints, time bonuses, and progress tracking
- **Words of Jesus or Not?** - Fast-paced 30-second challenge
- **Biblical Spelling Bee** - Unscramble biblical words
- **Bible Trivia Challenge** - 750+ questions across 3 difficulty levels
- **Bible reader** with references, lexicon links, and 97+ study plans
- **Courses**: Kings of Israel, Ancient Hebrew, Koine Greek, Hermeneutics, Church History, Textual Criticism
- **Biblical Bloodlines** - Ancestry DNA-style family tree exploration
- **Spiritual Gifts Exam** - Discover your spiritual gifts with detailed analysis
- **Points Bank** - Investment system with ROI based on activity
- **Achievements and progress** saved to Firebase with cross-device sync
- **Personal Verse Detective**, multiple-choice flows, Hebrew calendar integrations
- **Responsive mobile-optimized** Tailwind UI

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
