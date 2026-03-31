import { useState, useEffect, useCallback } from 'react'
import { useTournamentData } from './hooks/useTournamentData'
import { config } from './applyTheme.js'
import Standings from './components/Standings'
import Rounds from './components/Rounds'
import styles from './App.module.css'

const STORAGE_KEY = 'chess-td-adjustments'

function loadAdjustments() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}')
  } catch {
    return {}
  }
}

export default function App() {
  const { rounds, games, eventName, loading, error } = useTournamentData()
  const [activeTab, setActiveTab] = useState('standings')
  const [adjustments, setAdjustments] = useState(loadAdjustments)

  // Persist adjustments to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(adjustments))
  }, [adjustments])

  const handleAdjustmentChange = useCallback((gameId, result) => {
    setAdjustments(prev => {
      if (result === null) {
        const next = { ...prev }
        delete next[gameId]
        return next
      }
      return { ...prev, [gameId]: result }
    })
  }, [])

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.brand}>
            {config.logo
              ? <img src={config.logo} alt="Logo" className={styles.logoImg} />
              : <span className={styles.logo}>&#9822;</span>
            }
            <h1 className={styles.title}>
              {loading ? 'Chess Tournament' : (config.name || eventName || 'Chess Tournament')}
            </h1>
          </div>
          <nav className={styles.nav}>
            <button
              className={`${styles.navBtn} ${activeTab === 'standings' ? styles.navActive : ''}`}
              onClick={() => setActiveTab('standings')}
            >
              Standings
            </button>
            <button
              className={`${styles.navBtn} ${activeTab === 'rounds' ? styles.navActive : ''}`}
              onClick={() => setActiveTab('rounds')}
            >
              Rounds
            </button>
          </nav>
        </div>
      </header>

      <main className={styles.main}>
        {loading && (
          <div className={styles.status}>Loading tournament data…</div>
        )}

        {!loading && error && (
          <div className={styles.error}>
            <strong>Could not load tournament data.</strong>
            <span>{error}</span>
          </div>
        )}

        {!loading && !error && activeTab === 'standings' && (
          <Standings games={games} adjustments={adjustments} />
        )}

        {!loading && !error && activeTab === 'rounds' && (
          <Rounds
            rounds={rounds}
            games={games}
            adjustments={adjustments}
            onAdjustmentChange={handleAdjustmentChange}
          />
        )}
      </main>

      <footer className={styles.footer}>
        {config.sponsors?.length > 0 && (
          <div className={styles.sponsors}>
            <span className={styles.sponsoredBy}>Sponsored by</span>
            {config.sponsors.map(s =>
              s.url
                ? <a key={s.name} href={s.url} target="_blank" rel="noopener noreferrer">
                    <img src={s.logo} alt={s.name} className={styles.sponsorLogo} />
                  </a>
                : <img key={s.name} src={s.logo} alt={s.name} className={styles.sponsorLogo} />
            )}
          </div>
        )}
        <span>TD adjustments are saved locally in your browser.</span>
      </footer>
    </div>
  )
}
