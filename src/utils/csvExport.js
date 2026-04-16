function escapeCell(value) {
  const str = String(value)
  // Wrap in quotes if value contains comma, quote, or newline
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return '"' + str.replace(/"/g, '""') + '"'
  }
  return str
}

export function standingsToCSV(rows) {
  const header = ['Rank', 'Player', 'Points', 'Wins', 'Draws', 'Losses', 'Byes']
  const formatPoints = pts => pts % 1 === 0 ? pts.toString() : pts.toFixed(1)
  const lines = rows.map(r =>
    [r.rank, r.name, formatPoints(r.points), r.wins, r.draws, r.losses, r.byes || 0]
      .map(escapeCell)
      .join(',')
  )
  return [header.map(escapeCell).join(','), ...lines].join('\n')
}

export function downloadCSV(csv, filename) {
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
