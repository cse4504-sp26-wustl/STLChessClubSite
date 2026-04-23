import { useMemo, useState } from 'react'
import { computeStandings } from '../utils/pgnParser'
import { standingsToCSV, downloadCSV } from '../utils/csvExport'
import styles from './Standings.module.css'

/**
 * Returns today's date as a YYYY-MM-DD string using the local system timezone.
 *
 * @returns {string} Local date string in YYYY-MM-DD format.
 */
function localDateString() {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/**
 * Triggers a CSV download of the provided standings rows.
 * Does nothing if the standings array is empty.
 *
 * @param {Array<object>} standings - Standings rows from `computeStandings`.
 */
function handleDownload(standings) {
  if (!standings || standings.length === 0) return
  downloadCSV(standingsToCSV(standings), `standings-${localDateString()}.csv`)
}

/**
 * Displays tournament standings as a sortable, searchable table with a CSV download button.
 *
 * @param {object} props
 * @param {Array<object>} props.games - Parsed game objects used to compute standings.
 */
export default function Standings({ games }) {
  const [query, setQuery] = useState('')

  const standings = useMemo(
    () => computeStandings(games),
    [games]
  )

  const filtered = query.trim()
    ? standings.filter(row => row.name.toLowerCase().includes(query.toLowerCase()))
    : standings

  if (standings.length === 0) {
    return (
      <p className={styles.empty}>
        No standings yet. Upload PGN files to <code>public/pgn/</code> to get started.
      </p>
    )
  }

  return (
    <div>
      <div className={styles.searchRow}>
        <input
          className={styles.search}
          type="search"
          placeholder="Search players…"
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
        <button
          className={styles.downloadBtn}
          onClick={() => handleDownload(standings)}
          title="Download standings as CSV"
        >
          ⬇ Download CSV
        </button>
      </div>
      <div className={styles.wrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.rankCol}>#</th>
              <th>Player</th>
              <th className={styles.numCol} title="Total points">Pts</th>
              <th className={styles.numCol} title="Wins">W</th>
              <th className={styles.numCol} title="Draws">D</th>
              <th className={styles.numCol} title="Losses">L</th>
              <th className={styles.numCol} title="Byes">B</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0
              ? <tr><td colSpan={7} className={styles.noResults}>No players match "{query}"</td></tr>
              : filtered.map((row, i) => (
                <tr key={row.name} className={i % 2 === 0 ? styles.rowEven : styles.rowOdd}>
                  <td className={styles.rankCol}>
                    {row.rank <= 3
                      ? <span className={`${styles.medal} ${styles[`medal${row.rank}`]}`}>{row.rank}</span>
                      : row.rank
                    }
                  </td>
                  <td className={styles.playerCell}>{row.name}</td>
                  <td className={`${styles.numCol} ${styles.points}`}>{formatPoints(row.points)}</td>
                  <td className={styles.numCol}>{row.wins}</td>
                  <td className={styles.numCol}>{row.draws}</td>
                  <td className={styles.numCol}>{row.losses}</td>
                  <td className={styles.numCol}>{row.byes || '—'}</td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
    </div>
  )
}

/**
 * Formats a points value for display: whole numbers are shown without a decimal,
 * fractional values are shown with one decimal place.
 *
 * @param {number} pts - The points value.
 * @returns {string} Formatted string.
 */
function formatPoints(pts) {
  // Show as integer if whole number, otherwise show one decimal
  return pts % 1 === 0 ? pts.toString() : pts.toFixed(1)
}
