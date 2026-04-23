import { useState, useEffect } from 'react'
import { parsePGNFile } from '../utils/pgnParser'
import { config } from '../applyTheme.js'

export function useTournamentData() {
  const [state, setState] = useState({
    rounds: [],
    games: [],
    eventName: '',
    loading: true,
    error: null,
  })

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const t = Date.now()
        const res = await fetch(`${config.dataUrl}/pgn/manifest.json?t=${t}`)
        if (!res.ok) throw new Error(`Could not load manifest (HTTP ${res.status})`)
        const manifest = await res.json()

        const allGames = []
        const rounds = []

        for (const roundInfo of manifest.rounds ?? []) {
          const pgnRes = await fetch(`${config.dataUrl}/pgn/${roundInfo.filename}?t=${t}`)
          if (!pgnRes.ok) continue
          const pgnText = await pgnRes.text()
          const games = parsePGNFile(pgnText, roundInfo.filename)
          allGames.push(...games)
          rounds.push({ ...roundInfo, gameCount: games.length })
        }

        const eventName = allGames.find(g => g.event)?.event ?? 'Chess Tournament'

        if (!cancelled) {
          setState({ rounds, games: allGames, eventName, loading: false, error: null })
        }
      } catch (err) {
        if (!cancelled) {
          setState({ rounds: [], games: [], eventName: '', loading: false, error: err.message })
        }
      }
    }

    load()
    const interval = setInterval(load, 30_000)
    return () => { cancelled = true; clearInterval(interval) }
  }, [])

  return state
}
