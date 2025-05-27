module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        'est-blue': '#1e3a8a', // Your custom blue color
        'est-light-blue': '#3b82f6',
        'est-yellow': '#f59e0b',
        'est-green': '#10b981',
      },
    },
  },
  plugins: [],
}