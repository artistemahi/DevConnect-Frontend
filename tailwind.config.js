import daisyui from "daisyui";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      boxShadow: {
        glow: "0 40px 120px rgba(56, 189, 248, 0.12)",
      },
    },
  },
  darkMode: "class",
  plugins: [daisyui],
  daisyui: {
    themes: [
      {
        DevConnect: {
          primary: "#38bdf8",
          secondary: "#0ea5e9",
          accent: "#8b5cf6",
          neutral: "#111827",
          "base-100": "#0f172a",
          info: "#60a5fa",
          success: "#34d399",
          warning: "#fbbf24",
          error: "#f87171",
        },
      },
      "dark",
    ],
    darkTheme: "dark",
  },
};
