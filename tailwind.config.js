/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Bebas Neue"', 'cursive'],
        mono: ['"JetBrains Mono"', 'monospace'],
        body: ['"DM Sans"', 'sans-serif'],
      },
      colors: {
        snap: {
          bg: '#0a0a0a',
          surface: '#141414',
          card: '#1c1c1c',
          border: '#272727',
          lime: '#c8ff00',
          cyan: '#00d4ff',
          red: '#ff3b3b',
          green: '#00ff87',
          muted: '#555',
          text: '#efefef',
        },
      },
      animation: {
        'slide-in': 'slideIn 0.25s ease forwards',
        'fade-up': 'fadeUp 0.3s ease forwards',
        'pulse-dot': 'pulseDot 2s infinite',
      },
      keyframes: {
        slideIn: {
          from: { opacity: 0, transform: 'translateX(-8px)' },
          to: { opacity: 1, transform: 'translateX(0)' },
        },
        fadeUp: {
          from: { opacity: 0, transform: 'translateY(6px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
        pulseDot: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.2 },
        },
      },
    },
  },
  plugins: [],
}
