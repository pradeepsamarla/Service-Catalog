/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        canvas: '#0a0a12',
        glass: {
          DEFAULT: 'rgba(18, 18, 30, 0.55)',
          strong: 'rgba(12, 12, 22, 0.78)',
          soft: 'rgba(30, 30, 48, 0.4)',
        },
        hairline: 'rgba(255, 255, 255, 0.10)',
        violetGlow: '#8b5cf6',
        blueGlow: '#3b82f6',
        tealGlow: '#2dd4bf',
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(255,255,255,0.06), 0 8px 32px -8px rgba(139,92,246,0.35)',
        'glow-strong':
          '0 0 0 1px rgba(255,255,255,0.12), 0 18px 48px -10px rgba(139,92,246,0.6), 0 0 60px -20px rgba(45,212,191,0.4)',
        'glow-green': '0 0 0 1px rgba(52,211,153,0.35), 0 10px 36px -10px rgba(52,211,153,0.55)',
        'glow-red': '0 0 0 1px rgba(248,113,113,0.4), 0 10px 36px -10px rgba(248,113,113,0.6)',
      },
      backdropBlur: {
        glass: '18px',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'ui-sans-serif', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
