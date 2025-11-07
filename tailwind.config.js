/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: { primary: "#2563eb" },
      container: { center: true, padding: "1rem" }
    },
  },
  plugins: [],
};
