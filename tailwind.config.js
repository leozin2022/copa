
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "primary": "#FFD700",
        "background-light": "#ffffff",
        "background-dark": "#000000",
        "accent-green": "#2d3a1a",
        "workspace": "#ffffff",
        "sidebar": "#000000",
        "border-accent": "#000000",
      },
      fontFamily: {
        "display": ["Lexend", "sans-serif"]
      },
      borderRadius: {
        "DEFAULT": "0px",
        "lg": "0px",
        "xl": "0px",
        "full": "9999px"
      },
      animation: {
        'scroll': 'scroll 40s linear infinite',
        'pulse-slow': 'pulse-slow 3s ease-in-out infinite',
      },
      keyframes: {
        'scroll': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'pulse-slow': {
          '0%, 100%': { transform: 'scale(1)', boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)' },
          '50%': { transform: 'scale(1.02)', boxShadow: '8px 8px 0px 0px rgba(0,0,0,1)' },
        }
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
