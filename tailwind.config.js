/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "indigo-deep": {
          950: "#10173A",
          900: "#141B3C",
          800: "#1E2A5E",
          700: "#2A3A78",
        },
        brocade: {
          gold: "#F2A93B",
          goldlight: "#FFD98A",
          rose: "#D91F7A",
          sky: "#4FA8D8",
          ivory: "#FAF6EE",
        },
        ink: {
          900: "#1A1A1A",
          600: "#4A4A4A",
        },
      },
      fontFamily: {
        serif: ['"Noto Serif SC"', '"STSong"', "serif"],
        sans: ['"Noto Sans SC"', '"Microsoft YaHei"', "sans-serif"],
      },
      backgroundImage: {
        "ink-mountain":
          "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(79,168,216,0.15), transparent), linear-gradient(180deg, #FDFBF6 0%, #FAF6EE 100%)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.8s ease-out both",
      },
    },
  },
  plugins: [],
};
