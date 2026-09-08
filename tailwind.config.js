/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./context/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#131313",
        "surface-lowest": "#0e0e0e",
        surface: "#201f1f",
        "surface-2": "#2a2a2a",
        "surface-3": "#353534",
        marigold: { DEFAULT: "#F4D03F", dark: "#3b2f00" },
        hibiscus: { DEFAULT: "#ffb4ab", dark: "#690005" },
        ivory: "#e5e2e1",
        muted: "#cfc6ae",
        outline: "#98907a",
        "outline-variant": "#4c4634",
      },
      fontFamily: {
        display: ["'Protest Revolution'", "sans-serif"],
        body: ["'Space Grotesk'", "sans-serif"],
        mono: ["'Space Grotesk'", "sans-serif"],
      },
      borderRadius: {
        card: "0px",
      },
    },
  },
  plugins: [],
};
