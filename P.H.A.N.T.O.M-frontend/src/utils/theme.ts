// Theme configuration for P.H.A.N.T.O.M
export const theme = {
  colors: {
    primary: {
      main: '#00F5FF', // Cyan
      light: '#33F7FF',
      dark: '#00C4CC',
    },
    secondary: {
      main: '#FF00FF', // Magenta
      light: '#FF33FF',
      dark: '#CC00CC',
    },
    background: {
      default: '#0A0A0A',
      paper: '#1A1A1A',
      elevated: '#2A2A2A',
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#B3B3B3',
      disabled: '#666666',
    },
    success: {
      main: '#00FF00',
      light: '#33FF33',
      dark: '#00CC00',
    },
    error: {
      main: '#FF0000',
      light: '#FF3333',
      dark: '#CC0000',
    },
    warning: {
      main: '#FFA500',
      light: '#FFB733',
      dark: '#CC8400',
    },
    info: {
      main: '#00F5FF',
      light: '#33F7FF',
      dark: '#00C4CC',
    },
    chart: {
      line: '#00F5FF',
      area: 'rgba(0, 245, 255, 0.1)',
      grid: 'rgba(255, 255, 255, 0.1)',
    },
  },
  typography: {
    fontFamily: '"Rajdhani", "Inter", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 600,
      letterSpacing: '0.02em',
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      letterSpacing: '0.02em',
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
      letterSpacing: '0.02em',
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
      letterSpacing: '0.02em',
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
      letterSpacing: '0.02em',
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 600,
      letterSpacing: '0.02em',
    },
    body1: {
      fontSize: '1rem',
      fontWeight: 400,
      letterSpacing: '0.01em',
    },
    body2: {
      fontSize: '0.875rem',
      fontWeight: 400,
      letterSpacing: '0.01em',
    },
    button: {
      fontSize: '0.875rem',
      fontWeight: 600,
      letterSpacing: '0.05em',
      textTransform: 'uppercase',
    },
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    xxl: '3rem',
  },
  borderRadius: {
    sm: '0.25rem',
    md: '0.5rem',
    lg: '1rem',
    xl: '2rem',
    round: '50%',
  },
  shadows: {
    sm: '0 2px 4px rgba(0, 0, 0, 0.1)',
    md: '0 4px 8px rgba(0, 0, 0, 0.1)',
    lg: '0 8px 16px rgba(0, 0, 0, 0.1)',
    xl: '0 12px 24px rgba(0, 0, 0, 0.1)',
  },
  transitions: {
    default: '0.3s ease-in-out',
    fast: '0.15s ease-in-out',
    slow: '0.5s ease-in-out',
  },
  zIndex: {
    drawer: 1200,
    modal: 1300,
    snackbar: 1400,
    tooltip: 1500,
  },
} as const;

// Type for theme colors
export type ThemeColors = typeof theme.colors;

// Type for theme typography
export type ThemeTypography = typeof theme.typography;

// Type for theme spacing
export type ThemeSpacing = typeof theme.spacing;

// Type for theme border radius
export type ThemeBorderRadius = typeof theme.borderRadius;

// Type for theme shadows
export type ThemeShadows = typeof theme.shadows;

// Type for theme transitions
export type ThemeTransitions = typeof theme.transitions;

// Type for theme z-index
export type ThemeZIndex = typeof theme.zIndex;

// Type for the entire theme
export type Theme = typeof theme; 