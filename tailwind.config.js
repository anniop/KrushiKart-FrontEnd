/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
        // We can define our custom brand colors here for easier access
        colors: {
            'brand-green': '#285430',
            'brand-light': '#F7F6F2',
            'brand-orange': '#DE834D',
        }
    },
  },
  plugins: [],
}
