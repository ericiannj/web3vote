/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {},
    colors: {
      disabledGrey: '#64748b',
      lightSky: '#f8fafc',
      loadingWhite: '#FFFFFF',
      strongStone: '#0c0a09',
      strongGray: '#232433',
      strongPurple: '#5D40A0',
      hoverPurple: '#2e1065',
      lightBlue: '#99D1FF',
      highBlue: '#30D9FF',
      dangerRed: '#FB4048',
      hoverRed: '#C73239',
    },
  },
  plugins: [],
};
