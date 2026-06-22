/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.module.css",
  ],
  theme: {
    extend: {
      colors: {
        'gray': {
          100: '#f9fafb',
          200: '#d2d6db',
          300: '#9ca3af',
          400: '#6b7280',
          500: '#4b5563',
          600: '#374151',
        },
        // Semantic design tokens (StyleNest). Prefer these over raw hex values.
        ink: '#171717', // headings / primary text
        muted: '#525252', // secondary text & icons
        line: '#e5e7eb', // hairline borders
        surface: '#f3f4f6', // media / placeholder backgrounds
        brand: {
          DEFAULT: '#6366f1', // primary action, links, focus ring, selection
          dark: '#4f46e5', // primary hover
        },
        star: '#f9cb15', // rating stars
        sale: {
          DEFAULT: '#c8870c', // discount badge text
          soft: '#fdf1dd', // discount badge background
        },
        danger: '#dc2626', // error text
      },
      fontFamily: {
        sans: ['Noto Sans', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Open Sans', 'Helvetica Neue', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
