/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './site/templates/**/*.html',
    './site/content/**/*.html',
    './site/content/**/*.json',
    './{zh,en,fr,ja,de,es}/**/*.html',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
