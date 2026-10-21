import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0b0e14",
        card: "#121824",
        border: "#1e293b",
        bullish: "#00F5A0",
        bearish: "#FF3366",
        primary: "#6366F1",
      },
    },
  },
  plugins: [],
};
export default config;
