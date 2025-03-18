/** @type {import('tailwindcss').Config} */
export default {
  content: [
    `~/layouts/**/*.vue`,
    `~/components/**/*.vue`,
    `~/pages/**/*.vue`,
    `./app.vue`,
    `./error.vue`,
  ],
  theme: {
    screens: {
      xs: "480px",
      sm: "600px",
      md: "960px",
      lg: "1280px",
      xl: "1920px",
    },
    extend: {
      fontFamily: {
        inter: ["'Inter'", "sans-serif"],
      },
      colors: {
        "light-gray": "#F5F5F5",
        "ultra-light-gray": "#F0F0F0",
        "dark-gray": "#424242",
        "dusk-gray": "#CECECE",
        "dark-black": "#1E1E1E",
        "semi-black": "#454545",
        "white-gray-100": "#BDBDBD",
        "white-gray-200": "#E0E0E0",
        "white-gray-300": "#EEEEEE",
        "white-gray-400": "#F5F5F5",
      },
    },
  },
  plugins: [],
};
