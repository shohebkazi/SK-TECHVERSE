/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary:   '#A855F7',
        secondary: '#9333EA',
        accent:    '#C084FC',
        pink:      '#D946EF',
        green:     '#10b981',
        dark:      '#060309',
        card:      'rgba(168,85,247,0.05)',
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
