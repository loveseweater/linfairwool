/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1B2A4A',
          light: '#2C4068',
          dark: '#0F1A30',
        },
        accent: {
          DEFAULT: '#C19A6B',
          light: '#D4B48A',
          dark: '#A88050',
        },
        warm: {
          DEFAULT: '#FAF5EF',
          dark: '#F0E8DE',
        },
        khaki: {
          DEFAULT: '#8B7355',
          light: '#A08A6E',
        },
        gold: {
          DEFAULT: '#C8A882',
          light: '#DCC09E',
        },
        rust: {
          DEFAULT: '#C0392B',
          light: '#D55A4A',
        },
        text: {
          DEFAULT: '#333333',
          light: '#6B7280',
        },
      },
      fontFamily: {
        display: ['Playfair Display', 'Georgia', 'serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
