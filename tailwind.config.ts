import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // deep institutional midnight — constitutional blue-slate void
        void: {
          950: "#070a12",
          900: "#0a0f1c",
          800: "#0f1626",
          700: "#172033",
          600: "#212c44",
          500: "#2d3a57",
        },
        // freedom / institutions / the charter — UN sky blue
        liberty: {
          500: "#4f9cf0",
          400: "#74b4f6",
          300: "#a6d0fb",
        },
        // intrinsic worth / the luminous person — dignity gold
        dignity: {
          500: "#e9b54e",
          400: "#f3c976",
          300: "#fadfa6",
        },
        // law / balance / fairness — justice teal
        justice: {
          500: "#3fc4b0",
          400: "#6cd9c8",
          300: "#9fe9dd",
        },
        // domination / violence / oppression — restrained crimson
        power: {
          500: "#e0556b",
          400: "#ec7d8d",
          300: "#f4abb5",
        },
        // cool bone / paper-white text
        bone: {
          50: "#f3f7fd",
          100: "#e6edf8",
          300: "#bcc8de",
          500: "#7f8db0",
        },
      },
      fontFamily: {
        display: ['"Newsreader"', "ui-serif", "Georgia", "serif"],
        serif: ['"Spectral"', "ui-serif", "Georgia", "serif"],
        mono: ['"IBM Plex Mono"', "ui-monospace", "monospace"],
        zh: ['"Noto Serif SC"', "serif"],
      },
      boxShadow: {
        glow: "0 0 40px -8px rgba(233,181,78,0.42), 0 0 120px -40px rgba(79,156,240,0.28)",
        libertyglow: "0 0 40px -8px rgba(79,156,240,0.5)",
        justiceglow: "0 0 40px -8px rgba(63,196,176,0.45)",
      },
    },
  },
  plugins: [],
};

export default config;
