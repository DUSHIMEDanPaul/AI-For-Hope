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
        brand: {
          50: '#eef8f8',
          100: '#d2eded',
          200: '#aadcde',
          300: '#75c2c6',
          400: '#48a1a6',
          500: '#2e8489',
          600: '#256b70',
          700: '#21575c',
          800: '#1f484c',
          900: '#1e3d41',
          950: '#0e2225',
        },
      },
    },
  },
  plugins: [],
}
