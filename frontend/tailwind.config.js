/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        /* Quiet retail palette — black CTAs, warm stone, no flashy urgency colors */
        rose: { brand: '#1A1A1A', light: '#F0EEEA' },
        gold: { accent: '#8A857C' },
        cream: '#F7F5F1',
        ink: '#1A1A1A',
        surface: { card: '#FFFFFF', border: '#E5E2DC', muted: '#6F6B64' },
        trust: { green: '#3D5A4C', blue: '#4A5C68' },
        success: '#3D5A4C',
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        body: ['"Figtree"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(26,26,26,0.04)',
        lift: '0 12px 32px rgba(26,26,26,0.06)',
      },
    },
  },
  plugins: [],
}
