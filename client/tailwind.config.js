/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          DEFAULT: '#F7F2E9',
          dark: '#EDE5D5',
        },
        charcoal: {
          DEFAULT: '#2B2320',
          light: '#483C38',
          muted: '#71635D',
        },
        tomato: {
          DEFAULT: '#C1502E',
          hover: '#A94022',
          light: '#F8E8E3',
        },
        sage: {
          DEFAULT: '#6B8F71',
          hover: '#57755C',
          light: '#EAF1EC',
        },
        aged: {
          DEFAULT: '#FBF7EE',
          card: '#FAF4E6',
          border: '#E8DEC8',
        },
        mustard: {
          DEFAULT: '#D9A441',
          hover: '#C28F30',
          light: '#FBF4E2',
        },
      },
      fontFamily: {
        serif: ['"Fraunces"', '"DM Serif Display"', 'Georgia', 'serif'],
        sans: ['"Work Sans"', '"Inter"', 'system-ui', 'sans-serif'],
        handwritten: ['"Caveat"', 'cursive'],
      },
      boxShadow: {
        'card-soft': '0 4px 20px -2px rgba(43, 35, 32, 0.08), 0 2px 6px -1px rgba(43, 35, 32, 0.04)',
        'card-elevated': '0 12px 32px -4px rgba(43, 35, 32, 0.12), 0 4px 12px -2px rgba(43, 35, 32, 0.08)',
        'stamp': 'inset 0 0 0 2px #C1502E, 0 2px 8px rgba(193, 80, 46, 0.25)',
        'box-rim': 'inset 0 2px 4px rgba(43, 35, 32, 0.1), 0 8px 24px rgba(43, 35, 32, 0.15)',
      },
      backgroundImage: {
        'grid-ledger': 'linear-gradient(to right, rgba(43, 35, 32, 0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(43, 35, 32, 0.04) 1px, transparent 1px)',
        'lined-ledger': 'repeating-linear-gradient(transparent, transparent 27px, rgba(107, 143, 113, 0.15) 28px)',
      },
    },
  },
  plugins: [],
};
