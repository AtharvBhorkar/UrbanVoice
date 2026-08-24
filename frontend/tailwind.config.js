/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#08090A',
          900: '#111214',
          800: '#1B1C1F',
          700: '#26272B',
          600: '#3A3B40',
        },
        paper: {
          50: '#FAFAF8',
          100: '#FFFFFF',
          200: '#EDEBE4',
          300: '#DBD8CE',
        },
        volt: {
          DEFAULT: '#F3E9D2',
          dim: '#E4D4AC',
          soft: 'rgba(243, 233, 210, 0.12)',
        },
        signal: {
          DEFAULT: '#C9A227',
          dim: '#A9871E',
          soft: 'rgba(201, 162, 39, 0.12)',
        },
        navy: {
          DEFAULT: '#122A52',
          dim: '#1C3E73',
          soft: 'rgba(18, 42, 82, 0.12)',
        },
        'text-dark': '#F3F3EF',
        'text-dark-muted': '#94969C',
        'text-light': '#101113',
        'text-light-muted': '#6B6D72',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
      },
      boxShadow: {
        volt: '0 0 0 1px rgba(198,255,61,0.4), 0 8px 24px -8px rgba(198,255,61,0.35)',
      },
    },
  },
  plugins: [],
}