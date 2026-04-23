/**
 * generate-manifest.js
 *
 * Scans public/pgn/ for *.pgn files and writes public/pgn/manifest.json.
 * Run automatically as part of `npm run dev` and `npm run build`.
 *
 * PGN files may be named anything; they are sorted alphabetically and each
 * receives a human-readable label derived from the filename:
 *   round1.pgn      → "Round 1"
 *   round_02.pgn    → "Round 2"
 *   week3.pgn       → "Week 3"
 *   anything.pgn    → "Anything"
 */

import { readdirSync, writeFileSync, mkdirSync, existsSync } from 'fs'
import { join, basename, extname, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const pgnDir = join(__dirname, '..', 'public', 'pgn')
const manifestPath = join(pgnDir, 'manifest.json')

if (!existsSync(pgnDir)) {
  mkdirSync(pgnDir, { recursive: true })
}

const files = existsSync(pgnDir)
  ? readdirSync(pgnDir)
      .filter(f => extname(f).toLowerCase() === '.pgn')
      .sort()
  : []

const rounds = files.map(filename => ({
  filename,
  label: labelFromFilename(filename),
}))

writeFileSync(manifestPath, JSON.stringify({ rounds }, null, 2) + '\n')
console.log(`[manifest] ${rounds.length} round(s) → ${manifestPath}`)

function labelFromFilename(filename) {
  const base = basename(filename, extname(filename))

  // Try "round1", "round_1", "round-1", "round 1" etc.
  const m = base.match(/^([a-z]+)[_\-\s]*0*(\d+)$/i)
  if (m) {
    const word = m[1].charAt(0).toUpperCase() + m[1].slice(1).toLowerCase()
    return `${word} ${parseInt(m[2], 10)}`
  }

  // Fallback: title-case the filename
  return base
    .replace(/[_\-]/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase())
}
