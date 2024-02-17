/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    colors: {
      'white': '#ffffff',
      'black': '#000000',
      'custom-white': '#e3e3e3',
      'red': '#FF0000',        // Example: Red color
      'blue': '#0000FF',       // Example: Blue color
      'green': '#00FF00',      // Example: Green color
      'yellow': '#FFFF00',     // Example: Yellow color
      'orange': '#FFA500',     // Example: Orange color
      // Add more custom colors as needed
    },
    extend: {},
  },
  plugins: [],
}
