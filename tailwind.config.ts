import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      boxShadow: {
        wheel: "0 24px 70px rgba(15, 23, 42, 0.18)"
      }
    }
  },
  plugins: []
};

export default config;
