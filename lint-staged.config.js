/** @type {import('lint-staged').Config} */
module.exports = {
  '*.{astro,ts,tsx,js,jsx}': ['eslint --fix --max-warnings=0', 'prettier --write'],
  '*.{json,md,css,html}': ['prettier --write'],
  '*.{astro,ts,tsx}': ['eslint --fix --max-warnings=0'],
};
