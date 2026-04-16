const ANCHOR_TAG = 'a'
const CSV_MIME_TYPE = 'text/csv'
const DECIMAL_PLACES = 1

/**
 * Escapes a single CSV cell value per RFC 4180.
 * Wraps the value in double-quotes when it contains a comma, double-quote, or newline,
 * and escapes any embedded double-quotes by doubling them.
 *
 * @param {*} value - The cell value to escape.
 * @returns {string} The escaped cell string.
 */
function escapeCell(value) {
  const str = String(value)
  // Wrap in quotes if value contains comma, quote, or newline
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return '"' + str.replace(/"/g, '""') + '"'
  }
  return str
}

/**
 * Formats a numeric points value as a string.
 * Whole numbers are returned without a decimal; fractional values use one decimal place.
 *
 * @param {number} pts - The points value. Must be a finite number.
 * @returns {string} The formatted points string.
 */
function formatPoints(pts) {
  if (typeof pts !== 'number' || !isFinite(pts)) return '0'
  return pts % 1 === 0 ? pts.toString() : pts.toFixed(DECIMAL_PLACES)
}

/**
 * Converts an array of standings rows into a CSV string.
 * The first row is a header; subsequent rows contain each player's statistics.
 *
 * @param {Array<{rank: number, name: string, points: number, wins: number, draws: number, losses: number, byes: number}>} rows
 *   Standings rows as returned by `computeStandings`.
 * @returns {string} A UTF-8 CSV string suitable for download.
 */
export function standingsToCSV(rows) {
  const header = ['Rank', 'Player', 'Points', 'Wins', 'Draws', 'Losses', 'Byes']
  const lines = rows.map(r =>
    [r.rank, r.name, formatPoints(r.points), r.wins, r.draws, r.losses, r.byes || 0]
      .map(escapeCell)
      .join(',')
  )
  return [header.map(escapeCell).join(','), ...lines].join('\n')
}

/**
 * Triggers a browser file download for the given CSV string.
 *
 * @param {string} csv - The CSV content to download.
 * @param {string} filename - The suggested filename for the download.
 */
export function downloadCSV(csv, filename) {
  const csvBlob = new Blob([csv], { type: CSV_MIME_TYPE })
  const objectUrl = URL.createObjectURL(csvBlob)
  const anchorEl = document.createElement(ANCHOR_TAG)
  anchorEl.href = objectUrl
  anchorEl.download = filename
  anchorEl.click()
  URL.revokeObjectURL(objectUrl)
}
