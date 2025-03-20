/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: "jit", 
  content: ["./App.js", "./app/**/*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        josefin: ["JosefinSans-Regular", "JosefinSans-Medium", "JosefinSans-Bold", "JosefinSans-Light", "JosefinSans-SemiBold"],
        josefinSemibold: ["JosefinSans-SemiBold"],
      },
      colors:{
        // UIbase: "#FAFAFA",
        UIbase: "#F3F3F3",
        UIwhite: "#FFFFFF" ,
        UIblack: "#0D0D0D",
        UIgray1: "#323232",
        UIgray2: "#606060",
        UIcontr1: "#F3E3AA",
        UIcontr2: "#2E62A6",
        UIPlaceH: "#d7d7d7"
      }
    },
  },
  plugins: [],
}