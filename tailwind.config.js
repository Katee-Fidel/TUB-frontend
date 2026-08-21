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
        ink: "#170F28",
        surface: "#241A3D",
        "surface-2": "#2E2150",
        marigold: { DEFAULT: "#F4B740", dark: "#4A2E06" },
        hibiscus: { DEFAULT: "#FF5470", dark: "#4A0E1A" },
        ivory: "#F7F3EC",
        muted: "#B7A9CE",
      },
      fontFamily: {
        display: ["Anton", "sans-serif"],
        body: ["'Plus Jakarta Sans'", "sans-serif"],
        mono: ["'Space Mono'", "monospace"],
      },
      borderRadius: {
        card: "14px",
      },
    },
  },
  plugins: [],
};