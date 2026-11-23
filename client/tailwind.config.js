/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: 'var(--color-ink)',
          muted: 'var(--color-ink-muted)',
        },
        paper: {
          DEFAULT: 'var(--color-paper)',
          card: 'var(--color-paper-card)',
          muted: 'var(--color-paper-muted)',
          border: 'var(--color-paper-border)',
        },
        tomato: {
          DEFAULT: 'var(--color-tomato)',
          hover: 'var(--color-tomato-hover)',
          light: 'var(--color-tomato-light)',
        },
        basil: {
          DEFAULT: 'var(--color-basil)',
          hover: 'var(--color-basil-hover)',
          light: 'var(--color-basil-light)',
        },
        butter: {
          DEFAULT: 'var(--color-butter)',
          hover: 'var(--color-butter-hover)',
          light: 'var(--color-butter-light)',
        },
        plum: {
          DEFAULT: 'var(--color-plum)',
          dark: 'var(--color-plum-dark)',
          light: 'var(--color-plum-light)',
          paper: 'var(--color-plum-paper)',
        },
        // Backwards compatibility aliases
        charcoal: {
          DEFAULT: 'var(--color-ink)',
          light: 'var(--color-ink-muted)',
          muted: 'var(--color-ink-muted)',
        },
        cream: {
          DEFAULT: 'var(--color-paper)',
          dark: 'var(--color-paper-muted)',
        },
        sage: {
          DEFAULT: 'var(--color-basil)',
          hover: 'var(--color-basil-hover)',
          light: 'var(--color-basil-light)',
        },
        mustard: {
          DEFAULT: 'var(--color-butter)',
          hover: 'var(--color-butter-hover)',
          light: 'var(--color-butter-light)',
        },
        aged: {
          DEFAULT: 'var(--color-paper-muted)',
          card: 'var(--color-paper-card)',
          border: 'var(--color-paper-border)',
        },
      },
      fontFamily: {
        heading: ['"Bricolage Grotesque"', 'sans-serif'],
        serif: ['"Bricolage Grotesque"', 'sans-serif'],
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
        handwritten: ['"DM Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      borderRadius: {
        'card': '20px',
        'btn': '14px',
        '2xl': '20px',
        'xl': '14px',
      },
      boxShadow: {
        'card-soft': '0 4px 20px -2px rgba(31, 27, 22, 0.05), 0 2px 6px -1px rgba(31, 27, 22, 0.03)',
        'card-elevated': '0 16px 36px -4px rgba(31, 27, 22, 0.09), 0 4px 12px -2px rgba(31, 27, 22, 0.04)',
        'stamp': '0 2px 8px rgba(232, 69, 44, 0.25)',
        'box-rim': '0 8px 24px rgba(31, 27, 22, 0.08)',
      },
    },
  },
  plugins: [],
};
