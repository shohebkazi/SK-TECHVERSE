/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary:   '#00d4ff',
        secondary: '#a855f7',
        accent:    '#06b6d4',
        pink:      '#ec4899',
        green:     '#10b981',
        dark:      '#020409',
        card:      'rgba(255,255,255,0.03)',
      },
      fontFamily: {
        display: ['Orbitron', 'monospace'],
        body:    ['Rajdhani', 'sans-serif'],
        ui:      ['Space Grotesk', 'sans-serif'],
      },
      animation: {
        'float':      'float 6s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'spin-slow':  'spin 20s linear infinite',
        'scroll':     'scroll 25s linear infinite',
      },
      keyframes: {
        float:     { '0%,100%': { transform: 'translateY(0px)' }, '50%': { transform: 'translateY(-20px)' } },
        pulseGlow: { '0%,100%': { boxShadow: '0 0 20px rgba(0,212,255,0.3)' }, '50%': { boxShadow: '0 0 40px rgba(168,85,247,0.6)' } },
        scroll:    { '0%': { transform: 'translateX(0)' }, '100%': { transform: 'translateX(-50%)' } },
      },
      backdropBlur: { xs: '2px' },
    },
  },
  plugins: [],
}
