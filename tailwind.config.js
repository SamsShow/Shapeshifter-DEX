/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f5f7ff',
          100: '#ebf0fe',
          200: '#d6e0fd',
          300: '#b3c7fb',
          400: '#809df7',
          500: '#5b7ef1',
          600: '#3654e3',
          700: '#2c43c7',
          800: '#2639a2',
          900: '#233281',
        },
      },
    },
  },
  plugins: [],
}
