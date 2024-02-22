/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'custom-white': '#e3e3e3',
        'custom-black': '#1c1d1f' ,   
        'light-black': '#2d2f31',
        'light-blue': '#2d82db'
        // Add more custom colors as needed
      },
    },
  },
  plugins: [],
}
