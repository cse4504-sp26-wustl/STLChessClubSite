import { useMemo } from 'react'
import { computeStandings } from '../utils/pgnParser'
import styles from './Standings.module.css'

export default function Standings({ games, adjustments }) {
  const standings = useMemo(
    () => computeStandings(games, adjustments),
    [games, adjustments]
  )

  if (standings.length === 0) {
    return (
      <p className={styles.empty}>
        No standings yet. Upload PGN files to <code>public/pgn/</code> to get started.
      </p>
    )
  }

  return (
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
          {standings.map((row, i) => (
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
          ))}
        </tbody>
      </table>
    </div>
  )
}

function formatPoints(pts) {
  // Show as integer if whole number, otherwise show one decimal
  return pts % 1 === 0 ? pts.toString() : pts.toFixed(1)
}
