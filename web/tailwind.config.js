/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        scan: {
          '0%': { transform: 'scaleX(0)' },
          '50%': { transform: 'scaleX(1)' },
          '100%': { transform: 'scaleX(0)' },
        }
      }
    },
  },
  plugins: [],
}
