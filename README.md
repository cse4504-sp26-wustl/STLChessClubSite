# Chess Tournament Site

A Vite + React website for displaying chess tournament standings and pairings.
Deployed automatically to GitHub Pages on every push to `main`.

## How it works

| Step | What happens |
|------|--------------|
| 1 | Tournament organizer uploads a `.pgn` file to `public/pgn/` |
| 2 | A push to `main` triggers the GitHub Actions workflow |
| 3 | The build script generates `public/pgn/manifest.json` from all PGN files |
| 4 | Vite builds the site; GitHub Pages deploys it |
| 5 | Visitors see updated standings and pairings automatically |

## PGN file conventions

- Place files in `public/pgn/` (e.g. `round1.pgn`, `round2.pgn`)
- Files are sorted alphabetically — name them so alphabetical order matches round order
- One or more games per file; each game is a standard PGN game block
- **Bye** — set the opponent's name to `BYE` (case-insensitive)
- **Forfeit** — add `[Termination "Forfeit"]` to the game headers

## Tournament Director — adjusting results

On the **Rounds** view, every game card has an **Edit** button.
Click it to override the result for that game.
Adjustments are stored in your browser's `localStorage` and reflected immediately in standings.
Adjusted results are marked with `*` on the card.

## Setup for a new tournament

1. **Fork** (or use as a template) this repository into your GitHub organisation
2. In the forked repo go to **Settings → Pages** and set the source to **GitHub Actions**
3. Customise the page title in `index.html` and colour variables in `src/index.css`
4. Upload PGN files to `public/pgn/` and push — the site deploys automatically

## Local development

```bash
npm install
npm run dev     # starts Vite dev server at http://localhost:5173
```

```bash
npm run build   # production build → dist/
npm run preview # preview the production build locally
```

## Project structure

```
public/
  pgn/
    manifest.json   ← auto-generated; do not edit manually
    round1.pgn      ← upload PGN files here
    round2.pgn
src/
  components/
    GameCard.jsx    ← single game card with edit support
    Rounds.jsx      ← round selector + game grid
    Standings.jsx   ← points table
  hooks/
    useTournamentData.js  ← fetches and parses PGN data
  utils/
    pgnParser.js    ← PGN parsing + standings calculation
  App.jsx
scripts/
  generate-manifest.js  ← prebuild script; auto-discovers PGN files
.github/workflows/deploy.yml  ← GitHub Actions CI/CD
```
