import { useState } from 'react'
import { useTournamentData } from './hooks/useTournamentData'
import { config } from './applyTheme.js'
import Standings from './components/Standings'
import Rounds from './components/Rounds'
import styles from './App.module.css'

const BASE = import.meta.env.BASE_URL

export default function App() {
  const { rounds, games, eventName, loading, error } = useTournamentData()
  const [activeTab, setActiveTab] = useState('standings')

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.brand}>
            {config.logo
              ? <img src={`${BASE}${config.logo}`} alt="Logo" className={styles.logoImg} />
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
          <Standings games={games} />
        )}

        {!loading && !error && activeTab === 'rounds' && (
          <Rounds rounds={rounds} games={games} />
        )}
      </main>

      <footer className={styles.footer}>
        {config.sponsors?.length > 0 && (
          <div className={styles.sponsors}>
            <span className={styles.sponsoredBy}>Sponsored by</span>
            {config.sponsors.map(s =>
              s.url
                ? <a key={s.name} href={s.url} target="_blank" rel="noopener noreferrer">
                    <img src={`${BASE}${s.logo}`} alt={s.name} className={styles.sponsorLogo} />
                  </a>
                : <img key={s.name} src={`${BASE}${s.logo}`} alt={s.name} className={styles.sponsorLogo} />
            )}
          </div>
        )}
      </footer>
    </div>
  )
}
