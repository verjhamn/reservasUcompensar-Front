/** @type {import('tailwindcss').Config} */


/* colors: {
  'fucsia': '#e50064', // Color Fucsia
  'turquesa': '#00aab7', // Color Turquesa
  'gris-medio': '#757575', // Gris Medio
  'gris-claro': '#f6f7f2', // Gris Claro
  'gris-sutil': '#efefef', // Gris Sutil
  'naranja-vibrante': '#ea5d0b', // Naranja Vibrante  
}, */


export default {
  content: ["./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@tremor/**/.{js,ts,jsx,tsx}",],
  theme: {
    extend: {
      colors: {
        // COLORES PRINCIPALES - Identidad UCompensar

        // Naranja (Principal 1)
        primary: {
          50: '#fff4e6',
          100: '#ffe8cc',
          200: '#ffd199',
          300: '#ffba66',
          400: '#ffa333',
          500: '#ff6600',  // BASE - Naranja institucional
          600: '#cc5200',
          700: '#993d00',
          800: '#662900',
          900: '#331400',
        },

        // Morado (Principal 2)
        purple: {
          50: '#f5f3f7',
          100: '#ebe7ef',
          200: '#d7cfdf',
          300: '#c3b7cf',
          400: '#af9fbf',
          500: '#722070',  // BASE - Morado institucional (menos saturado)
          600: '#5b1a5a',
          700: '#451444',
          800: '#2e0d2d',
          900: '#170717',
        },

        // COLORES SECUNDARIOS COMPLEMENTARIOS

        // Magenta
        magenta: {
          50: '#fef1f7',
          100: '#fde3ef',
          200: '#fbc7df',
          300: '#f88cbe',
          400: '#f14a95',
          500: '#e60064',  // BASE - Magenta
          600: '#c70054',
          700: '#a00044',
          800: '#7a0033',
          900: '#540023',
        },

        // Amarillo
        yellow: {
          50: '#fef9e6',
          100: '#fef3cc',
          200: '#fde799',
          300: '#fcdb66',
          400: '#fbcf33',
          500: '#f7a400',  // BASE - Amarillo
          600: '#c68300',
          700: '#946200',
          800: '#634200',
          900: '#312100',
        },

        // Azul Claro
        'blue-light': {
          50: '#e8f4f8',
          100: '#d1e9f1',
          200: '#a3d3e3',
          300: '#75bdd5',
          400: '#47a7c7',
          500: '#5890c6',  // BASE - Azul claro
          600: '#46739e',
          700: '#355677',
          800: '#23394f',
          900: '#121d28',
        },

        // Azul Oscuro (Navy)
        'blue-dark': {
          50: '#e8ebf0',
          100: '#d1d7e1',
          200: '#a3afc3',
          300: '#7587a5',
          400: '#475f87',
          500: '#243455',  // BASE - Azul oscuro
          600: '#1d2a44',
          700: '#161f33',
          800: '#0e1522',
          900: '#070a11',
        },

        // Turquesa
        turquoise: {
          50: '#e6f9fb',
          100: '#ccf3f7',
          200: '#99e7ef',
          300: '#66dbe7',
          400: '#33cfdf',
          500: '#00aab7',  // BASE - Turquesa
          600: '#008892',
          700: '#00666e',
          800: '#004449',
          900: '#002225',
        },

        // Verde Lima
        lime: {
          50: '#f4fce3',
          100: '#e9f9c7',
          200: '#d3f38f',
          300: '#bded57',
          400: '#a7e71f',
          500: '#95c11f',  // BASE - Verde lima
          600: '#779a19',
          700: '#597413',
          800: '#3c4d0c',
          900: '#1e2706',
        },

        // Verde
        green: {
          50: '#e8f5ed',
          100: '#d1ebdb',
          200: '#a3d7b7',
          300: '#75c393',
          400: '#47af6f',
          500: '#00a554',  // BASE - Verde
          600: '#008443',
          700: '#006332',
          800: '#004222',
          900: '#002111',
        },

        // COLORES NEUTROS
        neutral: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#757575',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        },

        // COLORES SEMÁNTICOS
        success: {
          DEFAULT: '#00a554',
          light: '#47af6f',
          dark: '#006332',
        },
        warning: {
          DEFAULT: '#f7a400',
          light: '#fbcf33',
          dark: '#c68300',
        },
        error: {
          DEFAULT: '#e60064',
          light: '#f14a95',
          dark: '#a00044',
        },
        info: {
          DEFAULT: '#5890c6',
          light: '#75bdd5',
          dark: '#46739e',
        },

        // ALIASES LEGACY (compatibilidad con código existente)
        'fucsia': '#e60064',
        'turquesa': '#00aab7',
        'gris-medio': '#757575',
        'gris-claro': '#f6f7f2',
        'gris-sutil': '#efefef',
        'naranja-vibrante': '#ff6600',
      },
      keyframes: {
        hide: {
          from: { opacity: "1" },
          to: { opacity: "0" },
        },
        slideDownAndFade: {
          from: { opacity: "0", transform: "translateY(-6px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        slideLeftAndFade: {
          from: { opacity: "0", transform: "translateX(6px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        slideUpAndFade: {
          from: { opacity: "0", transform: "translateY(6px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        slideRightAndFade: {
          from: { opacity: "0", transform: "translateX(-6px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        accordionOpen: {
          from: { height: "0px" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        accordionClose: {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: { height: "0px" },
        },
        dialogOverlayShow: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        dialogContentShow: {
          from: {
            opacity: "0",
            transform: "translate(-50%, -45%) scale(0.95)",
          },
          to: { opacity: "1", transform: "translate(-50%, -50%) scale(1)" },
        },
        drawerSlideLeftAndFade: {
          from: { opacity: "0", transform: "translateX(100%)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        drawerSlideRightAndFade: {
          from: { opacity: "1", transform: "translateX(0)" },
          to: { opacity: "0", transform: "translateX(100%)" },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        hide: "hide 150ms cubic-bezier(0.16, 1, 0.3, 1)",
        slideDownAndFade:
          "slideDownAndFade 150ms cubic-bezier(0.16, 1, 0.3, 1)",
        slideLeftAndFade:
          "slideLeftAndFade 150ms cubic-bezier(0.16, 1, 0.3, 1)",
        slideUpAndFade: "slideUpAndFade 150ms cubic-bezier(0.16, 1, 0.3, 1)",
        slideRightAndFade:
          "slideRightAndFade 150ms cubic-bezier(0.16, 1, 0.3, 1)",
        // Accordion
        accordionOpen: "accordionOpen 150ms cubic-bezier(0.87, 0, 0.13, 1)",
        accordionClose: "accordionClose 150ms cubic-bezier(0.87, 0, 0.13, 1)",
        // Dialog
        dialogOverlayShow:
          "dialogOverlayShow 150ms cubic-bezier(0.16, 1, 0.3, 1)",
        dialogContentShow:
          "dialogContentShow 150ms cubic-bezier(0.16, 1, 0.3, 1)",
        // Drawer
        drawerSlideLeftAndFade:
          "drawerSlideLeftAndFade 150ms cubic-bezier(0.16, 1, 0.3, 1)",
        drawerSlideRightAndFade: "drawerSlideRightAndFade 150ms ease-in",
        'fade-in': 'fade-in 0.5s ease-out forwards',
        'fade-in-up': 'fade-in-up 0.5s ease-out forwards',
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
}

