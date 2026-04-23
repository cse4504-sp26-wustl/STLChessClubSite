import styles from './GameCard.module.css'

const RESULT_META = {
  'white-win':         { label: 'White Wins',      className: styles.badgeWhiteWin },
  'black-win':         { label: 'Black Wins',       className: styles.badgeBlackWin },
  'draw':              { label: 'Draw',              className: styles.badgeDraw },
  'bye':               { label: 'Bye',               className: styles.badgeBye },
  'forfeit-white-win': { label: 'Forfeit — White',  className: styles.badgeForfeit },
  'forfeit-black-win': { label: 'Forfeit — Black',  className: styles.badgeForfeit },
  'pending':           { label: 'In Progress',      className: styles.badgePending },
}

export default function GameCard({ game }) {
  const meta = RESULT_META[game.result] ?? RESULT_META['pending']
  const whiteDisplay = /^bye$/i.test(game.white) ? '— BYE —' : game.white
  const blackDisplay = /^bye$/i.test(game.black) ? '— BYE —' : game.black

  return (
    <div className={styles.card}>
      {game.board && <div className={styles.boardLabel}>Board {game.board}</div>}

      <div className={styles.player}>
        <span className={styles.colorDot} style={{ background: '#f0f0f0', border: '1px solid #999' }} />
        <span className={styles.playerName}>{whiteDisplay}</span>
        {game.whiteElo && <span className={styles.elo}>{game.whiteElo}</span>}
        {game.whiteUSCF && <span className={styles.uscf}>USCF {game.whiteUSCF}</span>}
      </div>

      <div className={styles.resultRow}>
        <span className={`${styles.badge} ${meta.className}`}>{meta.label}</span>
      </div>

      <div className={styles.player}>
        <span className={styles.colorDot} style={{ background: '#333', border: '1px solid #666' }} />
        <span className={styles.playerName}>{blackDisplay}</span>
        {game.blackElo && <span className={styles.elo}>{game.blackElo}</span>}
        {game.blackUSCF && <span className={styles.uscf}>USCF {game.blackUSCF}</span>}
      </div>
    </div>
  )
}
