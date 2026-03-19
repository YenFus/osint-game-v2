// ─────────────────────────────────────────────────────────────────
// NODE STYLES — Unified styling for all investigation nodes
//
// This file ensures consistency across all node components.
// Import these styles instead of inline styles for buttons, headers, etc.
// ─────────────────────────────────────────────────────────────────

// Colors
export const COLORS = {
  // Primary action (blue)
  primary: '#4a90d9',
  primaryText: '#8ac0f0',
  primaryBg: 'rgba(74, 144, 217, 0.1)',
  primaryHover: 'rgba(74, 144, 217, 0.2)',

  // Success (green)
  success: '#4a9060',
  successText: '#80c090',
  successBg: 'rgba(74, 144, 96, 0.1)',
  successBorder: '#2a5040',

  // Error (red)
  error: '#8a4050',
  errorText: '#c08090',
  errorBg: 'rgba(138, 64, 80, 0.1)',
  errorBorder: '#6a3040',

  // Warning/Gold
  gold: '#d4a84b',
  goldText: '#f0c860',
  goldBg: 'rgba(212, 168, 75, 0.1)',
  goldBorder: '#b8860b',

  // Neutral
  text: '#d8d0c0',
  textMuted: '#8a8a88',
  textDim: '#5a5a68',
  border: '#2a2a38',
  borderLight: '#3a3a48',
  borderDark: '#1a1a28',
  bg: '#0a0a12',
  bgDark: '#06060c',

  // Muted states (wrong guesses, disabled)
  mutedBorder: '#4a3038',
  mutedText: '#7a5060',

  // Accent
  accent: '#6a90b0',

  // Background variants
  bgSuccess: '#0c140a',
  bgError: '#100a0c',
  bgInfo: '#0a0a14',
  bgFooter: '#08080c',

  // Info state (blue-purple)
  infoBorder: '#4a4060',
  infoText: '#a0a0d0',

  // Sepia/warm tones for notes
  sepia: '#a09888',
  sepiaDim: '#908878',
}

// Typography
export const FONTS = {
  mono: "'Share Tech Mono', monospace",
  serif: "'Crimson Pro', serif",
  display: "'Barlow Condensed', sans-serif",
}

// ─── UNIFIED BUTTON STYLES ────────────────────────────────────────

// Primary continue button - use for all "Continue →" buttons
export const BUTTON_PRIMARY = {
  fontFamily: FONTS.mono,
  fontSize: 14,
  fontWeight: 500,
  letterSpacing: '0.15em',
  textTransform: 'uppercase',
  border: `2px solid ${COLORS.primary}`,
  color: COLORS.primaryText,
  background: COLORS.primaryBg,
  padding: '12px 24px',
  cursor: 'pointer',
  transition: 'all 0.2s',
  minHeight: 48,
  borderRadius: 0,
}

// Disabled button state
export const BUTTON_DISABLED = {
  ...BUTTON_PRIMARY,
  border: `2px solid ${COLORS.border}`,
  color: COLORS.textDim,
  background: 'none',
  cursor: 'default',
}

// Secondary button (smaller actions)
export const BUTTON_SECONDARY = {
  fontFamily: FONTS.mono,
  fontSize: 12,
  fontWeight: 500,
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  border: `1px solid ${COLORS.borderLight}`,
  color: COLORS.textMuted,
  background: 'transparent',
  padding: '8px 16px',
  cursor: 'pointer',
  transition: 'all 0.2s',
  minHeight: 40,
}

// Flag/Tag button
export const BUTTON_FLAG = {
  fontFamily: FONTS.mono,
  fontSize: 12,
  fontWeight: 500,
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  border: `2px solid ${COLORS.borderLight}`,
  color: COLORS.textMuted,
  background: 'transparent',
  padding: '10px 16px',
  cursor: 'pointer',
  transition: 'all 0.2s',
  minWidth: 80,
  minHeight: 44,
}

// Flag button - correct state
export const BUTTON_FLAG_CORRECT = {
  ...BUTTON_FLAG,
  border: `2px solid ${COLORS.goldBorder}`,
  color: COLORS.goldText,
  background: COLORS.goldBg,
  cursor: 'default',
}

// Flag button - wrong state
export const BUTTON_FLAG_WRONG = {
  ...BUTTON_FLAG,
  border: `1px solid ${COLORS.mutedBorder}`,
  color: COLORS.mutedText,
  cursor: 'default',
}

// Back button
export const BUTTON_BACK = {
  fontFamily: FONTS.mono,
  fontSize: 12,
  letterSpacing: '0.12em',
  color: COLORS.textMuted,
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  padding: '8px 0',
  minHeight: 44,
  display: 'flex',
  alignItems: 'center',
  gap: 6,
}

// ─── UNIFIED HEADER STYLES ────────────────────────────────────────

// Section header bar (progress, status)
export const HEADER_BAR = {
  padding: '12px 24px',
  borderBottom: `1px solid ${COLORS.borderDark}`,
  display: 'flex',
  alignItems: 'center',
  gap: 16,
  fontFamily: FONTS.mono,
  fontSize: 12,
  color: COLORS.textMuted,
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
}

// Subheader (smaller)
export const HEADER_SUB = {
  fontFamily: FONTS.mono,
  fontSize: 10,
  color: COLORS.accent,
  letterSpacing: '0.15em',
  textTransform: 'uppercase',
  marginBottom: 8,
}

// ─── UNIFIED PROGRESS BAR ─────────────────────────────────────────

export const PROGRESS_BAR_CONTAINER = {
  flex: 1,
  height: 4,
  background: COLORS.borderDark,
  borderRadius: 2,
  overflow: 'hidden',
}

export const PROGRESS_BAR_FILL = {
  height: '100%',
  background: COLORS.successBorder,
  transition: 'width 0.4s ease',
  borderRadius: 2,
}

// ─── UNIFIED FEEDBACK STYLES ──────────────────────────────────────

export const FEEDBACK_BASE = {
  padding: '12px 18px',
  fontFamily: FONTS.serif,
  fontSize: 14,
  lineHeight: 1.6,
  display: 'flex',
  alignItems: 'flex-start',
  gap: 12,
}

export const FEEDBACK_SUCCESS = {
  ...FEEDBACK_BASE,
  background: COLORS.bgSuccess,
  border: `2px solid ${COLORS.goldBorder}`,
  color: COLORS.goldText,
}

export const FEEDBACK_ERROR = {
  ...FEEDBACK_BASE,
  background: COLORS.bgError,
  border: `2px solid ${COLORS.errorBorder}`,
  color: COLORS.errorText,
}

export const FEEDBACK_INFO = {
  ...FEEDBACK_BASE,
  background: COLORS.bgInfo,
  border: `2px solid ${COLORS.infoBorder}`,
  color: COLORS.infoText,
}

// ─── UNIFIED FOOTER STYLES ────────────────────────────────────────

export const FOOTER = {
  borderTop: `1px solid ${COLORS.borderDark}`,
  padding: '16px 24px',
  background: COLORS.bgFooter,
}

export const FOOTER_HINT = {
  fontFamily: FONTS.serif,
  fontSize: 14,
  color: COLORS.sepiaDim,
  fontStyle: 'italic',
  lineHeight: 1.6,
}

// ─── UNIFIED CONTENT STYLES ───────────────────────────────────────

export const CONTENT_SCROLL = {
  flex: 1,
  overflowY: 'auto',
  padding: '20px 24px',
}

export const CONTENT_TEXT = {
  fontFamily: FONTS.serif,
  fontSize: 15,
  color: COLORS.text,
  lineHeight: 1.85,
}

export const CONTENT_HANDWRITTEN = {
  ...CONTENT_TEXT,
  fontStyle: 'italic',
  fontSize: 16,
}

// ─── COMPLETION NOTE ──────────────────────────────────────────────

export const COMPLETION_NOTE = {
  fontFamily: FONTS.serif,
  fontStyle: 'italic',
  fontSize: 15,
  color: COLORS.sepia,
  lineHeight: 1.7,
  marginBottom: 16,
}
