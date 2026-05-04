/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './client/src/**/*.{js,jsx,ts,tsx,html}',
    './client/index.html'
  ],
  darkMode: 'class', // enable class-based dark mode
  theme: {
    extend: {
      colors: {
        primary: '#1f2937',
        secondary: '#111827',
        accent: '#10b981',
        accentBg: '#1e293b',
        border: '#374151',
        textH: '#f3f4f6'
      }
    }
  },
  plugins: []
};
