/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.js", "./app/**/*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        josefin: ["JosefinSans-Regular", "JosefinSans-Medium", "JosefinSans-Bold", "JosefinSans-Light", "JosefinSans-SemiBold"]
      }
    },
  },
  plugins: [],
}