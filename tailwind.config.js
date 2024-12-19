/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'fucsia': '#e50064', // Color Fucsia
        'turquesa': '#00aab7', // Color Turquesa
        'gris-medio': '#757575', // Gris Medio
        'gris-claro': '#f6f7f2', // Gris Claro
        'gris-sutil': '#efefef', // Gris Sutil
        'naranja-vibrante': '#ea5d0b', // Naranja Vibrante
      },

    },
  },
  plugins: [],
}

