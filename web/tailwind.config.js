/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: '#2563EB',   // Azul eléctrico principal
          dark: '#050505',   // Negro profundo
          panel: '#0A0A0A',  // Gris muy oscuro para paneles
          border: '#1A1A1A', // Gris para bordes
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
