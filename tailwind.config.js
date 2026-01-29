/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          purple: "#7b68ee",
          "purple-dark": "#6a5acd",
          "purple-light": "#9b8ef7",
        },
        accent: {
          pink: "#ff6b9d",
          blue: "#49ccf9",
          green: "#00d4aa",
          orange: "#ffa800",
          red: "#ff6b6b",
        }
      }
    },
  },
  plugins: [],
}

