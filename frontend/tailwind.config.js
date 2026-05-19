/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        rose: { brand: '#8B3A52', light: '#F5E8ED' },
        gold: { accent: '#A67C3D' },
        cream: '#F7F5F2',
        ink: '#1A1614',
        surface: { card: '#FFFFFF', border: '#E8E4DF', muted: '#6B6560' },
        trust: { green: '#1F6B4E', blue: '#0A4D8C' },
        success: '#1F6B4E',
      },
      fontFamily: {
        display: ['"El Messiri"', 'serif'],
        body: ['"IBM Plex Sans Arabic"', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 3px rgba(26,22,20,0.06), 0 4px 12px rgba(26,22,20,0.04)',
        lift: '0 8px 24px rgba(26,22,20,0.08)',
      },
    },
  },
  plugins: [],
}
