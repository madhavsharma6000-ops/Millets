/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        cream: '#F9F6F0',
        terracotta: {
          DEFAULT: '#C85A32',
          light: '#D97B55',
          dark: '#A84826',
        },
        forest: {
          DEFAULT: '#3B5D43',
          light: '#4E7357',
          dark: '#2A3B30',
        },
        sage: {
          DEFAULT: '#7A9A70',
          light: '#9DB894',
          dark: '#5F7D56',
        },
        ochre: {
          DEFAULT: '#E09F3E',
          light: '#EBB86A',
          dark: '#C0822A',
        },
        charcoal: '#2C221E',
        primary: {
          DEFAULT: '#1e3a5f',
          light: '#2d4a6f',
          dark: '#152a47',
        },
        secondary: {
          DEFAULT: '#475569',
          light: '#64748b',
          dark: '#334155',
        },
        accent: {
          DEFAULT: '#d4af37',
          light: '#e0c050',
          dark: '#b8951f',
        },
      },
      fontFamily: {
        heading: ['var(--font-heading)', 'Georgia', 'serif'],
        body: ['var(--font-body)', 'Segoe UI', 'sans-serif'],
        serif: ['var(--font-heading)', 'Georgia', 'serif'],
        sans: ['var(--font-body)', 'Segoe UI', 'sans-serif'],
      },
      borderRadius: {
        '4xl': '2.5rem',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        floaty: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-12px) rotate(2deg)' },
        },
      },
      animation: {
        marquee: 'marquee 28s linear infinite',
        floaty: 'floaty 6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
