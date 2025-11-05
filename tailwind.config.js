/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: "jit", 
  content: [
    "./App.js", 
    "./app/**/*.{js,jsx,ts,tsx}", 
    "./src/**/*.{js,jsx,ts,tsx}",
    "./pages/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}"
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        josefin: ["JosefinSans-Regular", "JosefinSans-Medium", "JosefinSans-Bold", "JosefinSans-Light", "JosefinSans-SemiBold"],
        josefinSemibold: ["JosefinSans-SemiBold"],
        josefinBold: ["JosefinSans-Bold"]
      },
      fontSize: {
        'xs': '12px',
        'sm': '14px', 
        'base': '16px',
        'lg': '18px',
        'xl': '20px',
        '2xl': '24px',
        '3xl': '30px',
        '4xl': '36px'
      },
      spacing: {
        '0.5': '2px',
        '1': '4px',
        '1.5': '6px', 
        '2': '8px',
        '2.5': '10px',
        '3': '12px',
        '3.5': '14px',
        '4': '16px',
        '5': '20px',
        '6': '24px',
        '7': '28px',
        '8': '32px',
        '9': '36px',
        '10': '40px',
        '11': '44px',
        '12': '48px',
        '16': '64px',
        '20': '80px',
        '24': '96px'
      },
      borderRadius: {
        'sm': '6px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
        '2xl': '20px'
      },
      colors:{
        // Modern Professional Color System
        // Base colors - clean and minimal
        background: "#FAFAFA",
        surface: "#FFFFFF",
        "surface-secondary": "#F8F9FA",
        "surface-tertiary": "#F1F3F4",
        
        // Text colors - accessible and readable
        foreground: "#1A1A1A", 
        "foreground-secondary": "#6B7280",
        "foreground-muted": "#9CA3AF",
        "foreground-subtle": "#D1D5DB",
        
        // Primary brand colors - modern blue system
        primary: {
          50: "#EFF6FF",
          100: "#DBEAFE", 
          200: "#BFDBFE",
          300: "#93C5FD",
          400: "#60A5FA",
          500: "#3B82F6", // Main primary
          600: "#2563EB",
          700: "#1D4ED8",
          800: "#1E40AF",
          900: "#1E3A8A"
        },
        
        // Neutral system - better contrast
        neutral: {
          50: "#FAFAFA",
          100: "#F5F5F5",
          200: "#E5E5E5",
          300: "#D4D4D4",
          400: "#A3A3A3",
          500: "#737373",
          600: "#525252",
          700: "#404040",
          800: "#262626",
          900: "#171717"
        },
        
        // Semantic colors
        success: "#10B981",
        warning: "#F59E0B", 
        error: "#EF4444",
        info: "#3B82F6",
        
        // Legacy colors for backward compatibility (gradually remove these)
        UIbase: "#FAFAFA",
        UIwhite: "#FFFFFF" ,
        UIblack: "#1A1A1A",
        UIgray1: "#404040",
        UIgray2: "#6B7280",
        UIcontr1: "#FEF3C7",
        UIcontr2: "#3B82F6",
        UIPlaceH: "#D1D5DB"
      }
    },
  },
  plugins: [],
}