import { useState } from 'react'
import GameCard from './GameCard'
import styles from './Rounds.module.css'

export default function Rounds({ rounds, games, adjustments, onAdjustmentChange }) {
  const [selectedRound, setSelectedRound] = useState(rounds[0]?.filename ?? null)

  if (rounds.length === 0) {
    return (
      <div className={styles.empty}>
        <p>No rounds available yet. Upload a PGN file to <code>public/pgn/</code> to get started.</p>
      </div>
    )
  }

  // Keep selectedRound in sync when rounds load
  const activeFile = selectedRound ?? rounds[0]?.filename
  const roundGames = games.filter(g => g.roundFile === activeFile)

  const inProgress = roundGames.some(g => (adjustments[g.id] ?? g.result) === 'pending')

  return (
    <div className={styles.container}>
      <div className={styles.roundTabs} role="tablist">
        {rounds.map(r => (
          <button
            key={r.filename}
            role="tab"
            aria-selected={r.filename === activeFile}
            className={`${styles.tab} ${r.filename === activeFile ? styles.tabActive : ''}`}
            onClick={() => setSelectedRound(r.filename)}
          >
            {r.label}
          </button>
        ))}
      </div>

      {inProgress && (
        <p className={styles.inProgressNote}>Round in progress — some results are pending.</p>
      )}

      {roundGames.length === 0 ? (
        <p className={styles.empty}>No games found for this round.</p>
      ) : (
        <div className={styles.grid}>
          {roundGames.map(game => (
            <GameCard
              key={game.id}
              game={game}
              adjustedResult={adjustments[game.id] ?? null}
              onAdjustmentChange={onAdjustmentChange}
            />
          ))}
        </div>
      )}
    </div>
  )
}
