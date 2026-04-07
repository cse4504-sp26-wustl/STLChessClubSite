# Chess Tournament Site

A Vite + React website for displaying chess tournament standings and pairings.

## How it works

| Step | What happens |
|------|--------------|
| 1 | Tournament organizer uploads a `.pgn` file to `public/pgn/` |
| 2 | The build script generates `public/pgn/manifest.json` from all PGN files |
| 3 | Vite builds the site; GitHub Pages deploys it |

## PGN file conventions

- Place files in `public/pgn/` (e.g. `round1.pgn`, `round2.pgn`)
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
3. Open `tournament.config.js` and set your tournament name, colors, and logo
4. Upload PGN files to `public/pgn/` and push — the site deploys automatically

## Local development

```bash
npm install
npm run dev 
```

```bash
npm run build
npm run preview
```

---

## What we built and how to test it

```bash
npm install
npm run dev
```

Go to **http://localhost:5173**. You'll land on the Standings tab with sample data from a 3-round tournament already loaded. This is what the site looks like for anyone visiting during a real tournament.

---

### Standings

The standings table is the first thing people see. It ranks every player by their total points — wins are worth 1, draws 0.5, byes 1, losses 0. Click the **Standings** tab and you should see all six sample players listed in order with their points, wins, draws, and losses. The top three get a gold, silver, and bronze badge.

To test that standings actually update, jump ahead to the TD adjustments section, change a result.

---

### Rounds

Click **Rounds**. You'll see three tabs along the top — Round 1, Round 2, Round 3. Each tab shows the game cards for that round: who played white, who played black, and what the result was.

A few things to look for:
- **Round 1** has a pending game (Frank Chen vs Grace Taylor). That card shows *In Progress* and there's a yellow banner at the top of the page saying the round isn't over yet.
- **Round 3** has a forfeit (Dave Wilson over Bob Jones) and a bye (Eve Martinez). These show different badge colors so they're easy to tell apart at a glance.

---

### Adding a new round

This simulates what happens when a tournament organizer uploads the next round's PGN file.

1. Stop the dev server if it's running (once integrated with github pages this will not be necessary).
2. Add a new file — say `public/pgn/round4.pgn` — with at least one game in standard PGN format. Use the existing round files as a reference.
3. Run `npm run dev` again.
4. A **Round 4** tab will appear automatically.

---

### Customising tournament

Open `tournament.config.js`. While the dev server is running, try these changes and watch the browser update instantly:

- Set `name: 'My Tournament'` — the header title changes.
- Change `accent` to `'#cc2936'` — all the gold highlights turn red.
- Set `logo: '/logo.png'` — the logo in the header is replaced by your logo (the ACF logo is already in `public/`).
- Add a sponsor: `sponsors: [{ name: 'ACME', logo: '/logo.png' }]` (there is currently two sponsors)

