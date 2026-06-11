/** @type {import('tailwindcss').Config} */

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'orbitron': ['Orbitron', 'sans-serif'],
      },
      colors: {
        // Phantom Theme Colors
        'phantom-primary': '#00f2ff',
        'phantom-secondary': '#f0b323',
        'phantom-accent': '#ff3d3d',
        'phantom-success': '#00ff9d',
        'phantom-warning': '#ffb800',
        'phantom-info': '#0099ff',
        
        // Background Colors
        'phantom-bg-primary': '#0a0a0a',
        'phantom-bg-secondary': '#1a1a1a',
        'phantom-bg-card': '#2a2a2a',
        'phantom-bg-hover': '#3a3a3a',
        'phantom-bg-overlay': 'rgba(0, 0, 0, 0.8)',
        
        // Text Colors
        'phantom-text-primary': '#ffffff',
        'phantom-text-secondary': '#a0a0a0',
        'phantom-text-muted': '#666666',
        'phantom-text-inverse': '#0a0a0a',
        
        // Border Colors
        'phantom-border-primary': '#3a3a3a',
        'phantom-border-secondary': '#4a4a4a',
        'phantom-border-accent': '#00f2ff',
        
        // Shadow Colors
        'phantom-shadow-primary': 'rgba(0, 242, 255, 0.15)',
        'phantom-shadow-secondary': 'rgba(240, 179, 35, 0.15)',
        'phantom-shadow-success': 'rgba(0, 255, 157, 0.15)',
        'phantom-shadow-warning': 'rgba(255, 184, 0, 0.15)',
        'phantom-shadow-danger': 'rgba(255, 61, 61, 0.15)',
        
        // Legacy Colors (for backward compatibility)
        'phantom-blue': '#00f2ff',
        'phantom-dark': '#0a0a0a',
        'phantom-gray': '#1a1a1a',
        'primary': '#00f2ff',
        'accent-warning': '#ffb800',
        'accent-success': '#00ff9d',
        'accent-danger': '#ff3d3d',
        'text-secondary': '#a0a0a0',
        'bg-hover': '#2a2a2a',
      },
      animation: {
        'glow': 'glow 2s ease-in-out infinite alternate',
        'float': 'float 6s ease-in-out infinite',
        'phantom-pulse': 'phantom-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'phantom-bounce': 'phantom-bounce 0.6s ease-out',
        'phantom-shimmer': 'phantom-shimmer 1.5s infinite',
        'phantom-spin': 'phantom-spin 1s linear infinite',
        'phantom-float': 'phantom-float 6s ease-in-out infinite',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px #00f2ff, 0 0 10px #00f2ff, 0 0 15px #00f2ff' },
          '100%': { boxShadow: '0 0 10px #00f2ff, 0 0 20px #00f2ff, 0 0 30px #00f2ff' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'phantom-pulse': {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.5', transform: 'scale(1.05)' },
        },
        'phantom-bounce': {
          '0%': { transform: 'scale(0.3)', opacity: '0' },
          '50%': { transform: 'scale(1.05)' },
          '70%': { transform: 'scale(0.9)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'phantom-shimmer': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        'phantom-spin': {
          'from': { transform: 'rotate(0deg)' },
          'to': { transform: 'rotate(360deg)' },
        },
        'phantom-float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
        '7xl': ['4.5rem', { lineHeight: '1' }],
        '8xl': ['6rem', { lineHeight: '1' }],
        '9xl': ['8rem', { lineHeight: '1' }],
      },
      borderRadius: {
        '4xl': '2rem',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
} 