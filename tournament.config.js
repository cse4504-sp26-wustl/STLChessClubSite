/**
 * tournament.config.js
 *
 * Edit this file to customise the site for your tournament.
 * No other source files need to be touched.
 *
 * After editing, commit and push — GitHub Actions will redeploy automatically.
 */

export default {

  // ── Tournament name ─────────────────────────────────────────────────────
  // Shown in the browser tab and site header.
  // Set to null to use the Event name from the PGN files instead.
  name: 'Sample Tournament',

  // ── Color theme ─────────────────────────────────────────────────────────
  // Override any or all values. Omitted keys fall back to the defaults.
  colors: {
    bgPrimary:     '#1a1a2e',   // page background
    bgSurface:     '#16213e',   // header / table header background
    bgCard:        '#0f3460',   // game card background
    bgCardHover:   '#1a4070',   // game card hover
    border:        '#2a4a7f',   // borders and dividers
    textPrimary:   '#e8e8e8',   // main text
    textSecondary: '#a0aec0',   // secondary text
    textMuted:     '#718096',   // muted / label text
    accent:        '#c9a227',   // accent colour (buttons, active tab, gold medals)
    accentHover:   '#e6b830',   // accent hover state
  },

  // ── Logo ─────────────────────────────────────────────────────────────────
  // Path to a logo image, relative to the public/ folder.
  // Place your file in public/ and set the path here, e.g. '/logo.png'.
  // Set to null to show the default chess-piece icon instead.
  logo: '/logo.png',

  // ── Sponsors ─────────────────────────────────────────────────────────────
  // List of sponsor logos shown in the footer.
  // Place image files in public/sponsors/ and list them here.
  //
  // Each entry:  { name: 'Display name', logo: '/sponsors/acme.png', url: 'https://acme.com' }
  // url is optional — omit it if you don't want a clickable link.
  sponsors: [],

}
