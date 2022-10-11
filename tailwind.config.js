/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["**/*.html"],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['"Inter"'],
      }
    },
  },
  plugins: [
    require('tailwind-scrollbar-hide')
  ],
}
