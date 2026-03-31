import config from '../tournament.config.js'

// Maps config color keys → CSS custom property names defined in index.css
const CSS_VAR_MAP = {
  bgPrimary:     '--bg-primary',
  bgSurface:     '--bg-surface',
  bgCard:        '--bg-card',
  bgCardHover:   '--bg-card-hover',
  border:        '--border',
  textPrimary:   '--text-primary',
  textSecondary: '--text-secondary',
  textMuted:     '--text-muted',
  accent:        '--accent-gold',
  accentHover:   '--accent-gold-hover',
}

/**
 * Apply color overrides from tournament.config.js to CSS custom properties
 * on the document root. Call once at app startup (before first render).
 */
export function applyTheme() {
  const colors = config.colors ?? {}
  const root = document.documentElement
  for (const [key, cssVar] of Object.entries(CSS_VAR_MAP)) {
    if (colors[key]) root.style.setProperty(cssVar, colors[key])
  }
}

export { config }
