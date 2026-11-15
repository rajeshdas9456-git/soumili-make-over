/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brandPink: {
          DEFAULT: '#EF3478',
          50: '#FCEAF1',
          100: '#FAD5E3',
          200: '#F5ABC7',
          300: '#F081AB',
          400: '#EB578F',
          500: '#EF3478', // Primary Brand Pink
          600: '#D91E62',
          700: '#B5124D',
          800: '#8F0B3B',
          900: '#6A052A',
        },
        brandBlack: {
          DEFAULT: '#111111',
          light: '#1A1A1A',
          card: '#161616',
          border: '#2A2A2A',
        },
        brandLightPink: '#FCEAF1',
        brandWhite: '#FFFFFF',
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
        accent: ['Cormorant Garamond', 'serif'],
      },
      boxShadow: {
        'pink-soft': '0 10px 30px -5px rgba(239, 52, 120, 0.15)',
        'pink-glow': '0 0 25px rgba(239, 52, 120, 0.35)',
      }
    },
  },
  plugins: [],
};
