import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // "Sealed Ledger" palette — an institution's record room, not a crypto dashboard.
        vellum: "#EDE6D6", // parchment background
        "vellum-dark": "#E1D8C3", // recessed panels on parchment
        ink: "#1F2A24", // near-black, warm, for body text
        "ink-soft": "#4A5850", // muted body copy
        seal: "#8C2F2F", // wax-seal crimson — primary accent, used sparingly
        "seal-dark": "#6E2323",
        ledger: "#2F4C3B", // ledger-book green — verified / success state
        "ledger-dark": "#233A2C",
        brass: "#A9812F", // foil/brass — borders, dividers, official marks
        "brass-light": "#C7A45A",
        ash: "#5B5A52", // slate-ash secondary text
      },
      fontFamily: {
        display: ["Fraunces", "ui-serif", "Georgia", "serif"],
        serif: ["\"Source Serif 4\"", "ui-serif", "Georgia", "serif"],
        mono: ["\"IBM Plex Mono\"", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      backgroundImage: {
        "paper-grain":
          "radial-gradient(circle at 20% 20%, rgba(169,129,47,0.06), transparent 45%), radial-gradient(circle at 80% 60%, rgba(140,47,47,0.05), transparent 40%)",
      },
      boxShadow: {
        dossier: "0 1px 0 rgba(31,42,36,0.08), 0 20px 40px -20px rgba(31,42,36,0.35)",
      },
    },
  },
  plugins: [],
} satisfies Config;
