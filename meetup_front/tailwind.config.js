/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Strict Black & White theme
        primary: '#000000',
        secondary: '#ffffff',
        accent: '#f4f4f5', // Zinc-100 for subtle backgrounds
      },
      boxShadow: {
        // Neo-brutalist hard shadow
        'hard': '4px 4px 0px 0px rgba(0,0,0,1)',
      }
    },
  },
  plugins: [],
}