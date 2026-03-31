/**
 * Parse [Key "Value"] PGN header tags from a game string.
 */
function parseHeaders(gameText) {
  const headers = {}
  const pattern = /\[(\w+)\s+"([^"]*)"\]/g
  let match
  while ((match = pattern.exec(gameText)) !== null) {
    headers[match[1]] = match[2]
  }
  return headers
}

/**
 * Try to extract a round number from a filename like "round1.pgn", "r2.pgn", "week3.pgn".
 */
function extractRoundFromFilename(filename) {
  const m = filename.match(/(\d+)/)
  return m ? m[1] : '?'
}

/**
 * Determine the canonical result type from PGN headers.
 *
 * Returns one of:
 *   'white-win' | 'black-win' | 'draw' |
 *   'forfeit-white-win' | 'forfeit-black-win' |
 *   'bye' | 'pending'
 */
function normalizeResult(headers) {
  const white = (headers.White || '').trim()
  const black = (headers.Black || '').trim()
  const result = headers.Result || '*'
  const termination = (headers.Termination || '').toLowerCase()

  if (/^bye$/i.test(white) || /^bye$/i.test(black)) {
    return 'bye'
  }

  const isForfeit = termination.includes('forfeit')

  if (result === '1-0') return isForfeit ? 'forfeit-white-win' : 'white-win'
  if (result === '0-1') return isForfeit ? 'forfeit-black-win' : 'black-win'
  if (result === '1/2-1/2') return 'draw'
  return 'pending'
}

/**
 * Parse a full PGN file (potentially containing multiple games) into an array
 * of game objects.
 *
 * @param {string} text  - Raw PGN file content
 * @param {string} filename - Source filename (used to derive round label)
 * @returns {Array<object>}
 */
export function parsePGNFile(text, filename = '') {
  const normalized = text.replace(/\r\n/g, '\n').trim()

  // Split on blank lines immediately followed by a [ tag line.
  // Within a single game the blank line separating headers from moves is
  // NOT followed by [, so the split correctly separates games only.
  const gameTexts = normalized.split(/\n[ \t]*\n(?=\[)/)

  const games = []
  for (const gameText of gameTexts) {
    const trimmed = gameText.trim()
    if (!trimmed) continue

    const headers = parseHeaders(trimmed)
    if (!headers.White && !headers.Black) continue

    const round = headers.Round || extractRoundFromFilename(filename)
    const white = headers.White || 'Unknown'
    const black = headers.Black || 'Unknown'

    games.push({
      id: `${filename}::${round}::${white}::${black}`,
      white,
      black,
      whiteElo: headers.WhiteElo || '',
      blackElo: headers.BlackElo || '',
      result: normalizeResult(headers),
      rawResult: headers.Result || '*',
      round,
      event: headers.Event || '',
      date: headers.Date || '',
      roundFile: filename,
    })
  }

  return games
}

/**
 * Compute standings from all games, optionally merging TD adjustments.
 *
 * @param {Array<object>} games
 * @param {object} adjustments  - Map of game.id → result string
 * @returns {Array<object>}  Sorted array of player standing rows
 */
export function computeStandings(games, adjustments = {}) {
  const players = {}

  function ensure(name) {
    if (!players[name]) {
      players[name] = { name, points: 0, wins: 0, draws: 0, losses: 0, byes: 0, games: 0 }
    }
  }

  for (const game of games) {
    const result = adjustments[game.id] ?? game.result
    const { white, black } = game
    const isByeGame = /^bye$/i.test(white) || /^bye$/i.test(black)
    const realPlayer = isByeGame
      ? (/^bye$/i.test(white) ? black : white)
      : null

    if (isByeGame) {
      if (realPlayer) {
        ensure(realPlayer)
        if (result === 'bye') {
          players[realPlayer].points += 1
          players[realPlayer].byes += 1
          players[realPlayer].games += 1
        }
      }
      continue
    }

    ensure(white)
    ensure(black)

    switch (result) {
      case 'white-win':
      case 'forfeit-white-win':
        players[white].points += 1
        players[white].wins += 1
        players[white].games += 1
        players[black].losses += 1
        players[black].games += 1
        break
      case 'black-win':
      case 'forfeit-black-win':
        players[black].points += 1
        players[black].wins += 1
        players[black].games += 1
        players[white].losses += 1
        players[white].games += 1
        break
      case 'draw':
        players[white].points += 0.5
        players[black].points += 0.5
        players[white].draws += 1
        players[black].draws += 1
        players[white].games += 1
        players[black].games += 1
        break
      default:
        // 'pending' — no points awarded yet
        players[white].games += 1
        players[black].games += 1
    }
  }

  return Object.values(players)
    .sort((a, b) => b.points - a.points || a.name.localeCompare(b.name))
    .map((p, i) => ({ ...p, rank: i + 1 }))
}
