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
        obsidian: "#0A0812",
        champagne: { DEFAULT: "#E7C97A", dark: "#4A3A12" },
        copper: "#B8774B",
        success: "#7FD88F",
      },
      fontFamily: {
        display: ["Anton", "sans-serif"],
        body: ["'Plus Jakarta Sans'", "sans-serif"],
        mono: ["'Space Mono'", "monospace"],
        hero: ['"Protest Revolution"', "cursive"],
      },
      borderRadius: {
        card: "14px",
        panel: "22px",
        shell: "28px",
      },
      boxShadow: {
        glow: "0 0 28px rgba(231, 201, 122, 0.18)",
        "card-lift": "0 18px 48px -24px rgba(0, 0, 0, 0.8)",
      },
    },
  },
  plugins: [],
};