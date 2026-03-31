import { useState, useEffect } from 'react'
import { parsePGNFile } from '../utils/pgnParser'

const BASE = import.meta.env.BASE_URL

/**
 * Fetches the PGN manifest and all PGN files, returning parsed game data.
 *
 * The manifest lives at <base>/pgn/manifest.json and lists available rounds.
 * Each PGN file is fetched from <base>/pgn/<filename>.
 */
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
        const res = await fetch(`${BASE}pgn/manifest.json`)
        if (!res.ok) throw new Error(`Could not load manifest (HTTP ${res.status})`)
        const manifest = await res.json()

        const allGames = []
        const rounds = []

        for (const roundInfo of manifest.rounds ?? []) {
          const pgnRes = await fetch(`${BASE}pgn/${roundInfo.filename}`)
          if (!pgnRes.ok) continue
          const pgnText = await pgnRes.text()
          const games = parsePGNFile(pgnText, roundInfo.filename)
          allGames.push(...games)
          rounds.push({ ...roundInfo, gameCount: games.length })
        }

        // Derive event name from the first game that has one
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
    return () => { cancelled = true }
  }, [])

  return state
}
