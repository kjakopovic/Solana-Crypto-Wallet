/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#007AFF",
        background: "#171717",
        secondaryUtils: "#232324",
        secondaryHighlight: "#6F6F70",
      },
      fontFamily: {
        lufgaBold: ["LufgaBold"],
        lufgaRegular: ["LufgaRegular"],
        lufgaMedium: ["LufgaMedium"],
        lufgaSemiBold: ["LufgaSemiBold"],
      },
    },
  },
  plugins: [],
};