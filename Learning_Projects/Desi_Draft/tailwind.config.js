/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#EEEAE3',
        ink: '#0A0A0A',
        royal: '#4B63E8',
        periwinkle: '#8499F8',
        forest: '#2E7D5B',
        tangerine: '#E8603C',
        berry: '#9B2155',
        lilac: '#E8B4F5',
        lime: '#E4FBA8',
      },
      fontFamily: {
        display: ['Archivo', 'system-ui', 'sans-serif'],
        serif: ['"Instrument Serif"', 'Georgia', 'serif'],
        body: ['"DM Sans"', 'system-ui', 'sans-serif'],
        script: ['Yellowtail', 'cursive'],
      },
      borderRadius: {
        frame: '24px',
      },
    },
  },
  plugins: [],
};
