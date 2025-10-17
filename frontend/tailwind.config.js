/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primaryColor: "#B2D4FD",
        secondaryColor: "#E4DFFF",
        secondaryAccentColor: "#D0C6FF",
        backgroundColor: "#FFFCF8",
        subFirstColor: "#E9E9E9",
        subSecondColor: "#D9D9D9",
        subButtonColor: "#FFD6A5",
        hashTagColor: "#757575",
        subButtonAccentColor: "#FFB6B9",
      },
    },
  },
  plugins: [require("tailwind-scrollbar-hide")],
};
