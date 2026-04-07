import { useState } from 'react'
import styles from './GameCard.module.css'

const RESULT_OPTIONS = [
  { value: 'white-win',         label: 'White Wins' },
  { value: 'black-win',         label: 'Black Wins' },
  { value: 'draw',              label: 'Draw' },
  { value: 'bye',               label: 'Bye' },
  { value: 'forfeit-white-win', label: 'Forfeit — White Wins' },
  { value: 'forfeit-black-win', label: 'Forfeit — Black Wins' },
  { value: 'pending',           label: 'Pending' },
]

const RESULT_META = {
  'white-win':         { label: 'White Wins',          className: styles.badgeWhiteWin },
  'black-win':         { label: 'Black Wins',          className: styles.badgeBlackWin },
  'draw':              { label: 'Draw',                 className: styles.badgeDraw },
  'bye':               { label: 'Bye',                  className: styles.badgeBye },
  'forfeit-white-win': { label: 'Forfeit — White',     className: styles.badgeForfeit },
  'forfeit-black-win': { label: 'Forfeit — Black',     className: styles.badgeForfeit },
  'pending':           { label: 'In Progress',         className: styles.badgePending },
}

export default function GameCard({ game, adjustedResult, onAdjustmentChange }) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(adjustedResult ?? game.result)

  const effectiveResult = adjustedResult ?? game.result
  const meta = RESULT_META[effectiveResult] ?? RESULT_META['pending']
  const isOverridden = adjustedResult != null

  function handleSave() {
    onAdjustmentChange(game.id, draft)
    setEditing(false)
  }

  function handleReset() {
    onAdjustmentChange(game.id, null)
    setDraft(game.result)
    setEditing(false)
  }

  function handleCancel() {
    setDraft(adjustedResult ?? game.result)
    setEditing(false)
  }

  const whiteDisplay = /^bye$/i.test(game.white) ? '— BYE —' : game.white
  const blackDisplay = /^bye$/i.test(game.black) ? '— BYE —' : game.black

  return (
    <div className={`${styles.card} ${isOverridden ? styles.cardOverridden : ''}`}>
      {game.board && <div className={styles.boardLabel}>Board {game.board}</div>}

      <div className={styles.player}>
        <span className={styles.colorDot} style={{ background: '#f0f0f0', border: '1px solid #999' }} />
        <span className={styles.playerName}>{whiteDisplay}</span>
        {game.whiteElo && <span className={styles.elo}>{game.whiteElo}</span>}
        {game.whiteUSCF && <span className={styles.uscf}>USCF {game.whiteUSCF}</span>}
      </div>

      <div className={styles.resultRow}>
        <span className={`${styles.badge} ${meta.className}`}>
          {meta.label}
          {isOverridden && <span className={styles.overrideMark}> *</span>}
        </span>
      </div>

      <div className={styles.player}>
        <span className={styles.colorDot} style={{ background: '#333', border: '1px solid #666' }} />
        <span className={styles.playerName}>{blackDisplay}</span>
        {game.blackElo && <span className={styles.elo}>{game.blackElo}</span>}
        {game.blackUSCF && <span className={styles.uscf}>USCF {game.blackUSCF}</span>}
      </div>

      {!editing ? (
        <button
          className={styles.editBtn}
          onClick={() => { setDraft(adjustedResult ?? game.result); setEditing(true) }}
          title="Adjust result (TD only)"
        >
          Edit
        </button>
      ) : (
        <div className={styles.editArea}>
          <select
            className={styles.select}
            value={draft}
            onChange={e => setDraft(e.target.value)}
          >
            {RESULT_OPTIONS.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
          <div className={styles.editButtons}>
            <button className={styles.saveBtn} onClick={handleSave}>Save</button>
            {isOverridden && (
              <button className={styles.resetBtn} onClick={handleReset}>Reset</button>
            )}
            <button className={styles.cancelBtn} onClick={handleCancel}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  )
}
