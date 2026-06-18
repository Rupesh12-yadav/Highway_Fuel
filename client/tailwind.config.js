/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#f97316', dark: '#ea580c', light: '#fed7aa' },
        secondary: { DEFAULT: '#1e3a5f', dark: '#0f2040' },
      },
    },
  },
  plugins: [],
};
