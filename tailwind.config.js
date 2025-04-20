/** @type {import('tailwindcss').Config} */
module.exports = {
  // 1) NativeWind preset adds mobile‑friendly defaults
  presets: [ require('nativewind/preset') ],

  // 2) Scan these files for className usage
  content: [
    './App.{js,jsx,ts,tsx}',
    './app/**/*.{js,jsx,ts,tsx}',
  ],

  theme: {
    extend: {
      // your design tokens live here
    },
  },
  plugins: [
    // any Tailwind plugins you want
  ],
};
