/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: 'class', // <-- Habilitar modo oscuro por clase
  theme: {
    extend: {
      colors: {
        brand: {
          blue: '#2563EB',
          dark: '#050505',
          panel: '#0A0A0A',
          border: '#1A1A1A',
        }
      },
      fontFamily: {
        sans: ['Space Grotesk', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      }
    },
  },
  plugins: [],
}
