/** @type {import('tailwindcss').Config} */
const plugin = require("tailwindcss/plugin");

module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./App.tsx", "./app/**/*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  corePlugins: {
    space: false,
  },
  theme: {
    // NOTE to AI: You can extend the theme with custom colors or styles here.
    extend: {
      // Venus App - Luxurious pastel feminine color scheme
      colors: {
        venus: {
          pink: {
            50: "#FFF5F9",
            100: "#FFE8F0",
            200: "#FFD6E7",
            300: "#FFC4DE",
            400: "#FFB2D5",
            500: "#FFA0CC",
            600: "#FF8EC3",
          },
          rose: {
            50: "#FFF2F5",
            100: "#FFE5EB",
            200: "#FFCCD8",
            300: "#FFB3C5",
            400: "#FF99B2",
            500: "#FF809F",
            600: "#FF668C",
          },
          beige: {
            50: "#FFF9F5",
            100: "#FFF0E8",
            200: "#FFE1D1",
            300: "#FFD2BA",
            400: "#FFC3A3",
            500: "#FFB48C",
          },
          lavender: {
            50: "#F9F5FF",
            100: "#F3EBFF",
            200: "#E6D6FF",
            300: "#DAC2FF",
            400: "#CDADFF",
            500: "#C199FF",
          },
          mint: {
            50: "#F0FFF9",
            100: "#E0FFF2",
            200: "#C2FFE6",
            300: "#A3FFD9",
            400: "#85FFCD",
            500: "#66FFC0",
          },
          peach: {
            50: "#FFF8F5",
            100: "#FFF1EB",
            200: "#FFE3D6",
            300: "#FFD5C2",
            400: "#FFC7AD",
            500: "#FFB999",
          },
        },
      },
      fontSize: {
        xs: "10px",
        sm: "12px",
        base: "14px",
        lg: "18px",
        xl: "20px",
        "2xl": "24px",
        "3xl": "32px",
        "4xl": "40px",
        "5xl": "48px",
        "6xl": "56px",
        "7xl": "64px",
        "8xl": "72px",
        "9xl": "80px",
      },
    },
  },
  darkMode: "class",
  plugins: [
    plugin(({ matchUtilities, theme }) => {
      const spacing = theme("spacing");

      // space-{n}  ->  gap: {n}
      matchUtilities(
        { space: (value) => ({ gap: value }) },
        { values: spacing, type: ["length", "number", "percentage"] }
      );

      // space-x-{n}  ->  column-gap: {n}
      matchUtilities(
        { "space-x": (value) => ({ columnGap: value }) },
        { values: spacing, type: ["length", "number", "percentage"] }
      );

      // space-y-{n}  ->  row-gap: {n}
      matchUtilities(
        { "space-y": (value) => ({ rowGap: value }) },
        { values: spacing, type: ["length", "number", "percentage"] }
      );
    }),
  ],
};
