/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // זה סורק את כל הקומפוננטות שלך
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}