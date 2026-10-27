/** @type {import('eslint').Config} */
module.exports = {
  root: true,
  env: {
    browser: true,
    es2022: true,
    node: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
    extraFileExtensions: ['.md'],
  },
  settings: {
    'import/resolver': {
      typescript: {
        project: './tsconfig.json',
      },
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.astro'],
      },
    },
  },
  plugins: ['astro', '@typescript-eslint', 'jsx-a11y', 'tailwindcss', 'prettier'],
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended-type-checked', 'plugin:@typescript-eslint/stylistic-type-checked', 'plugin:astro/recommended', 'plugin:jsx-a11y/recommended', 'plugin:tailwindcss/recommended', 'prettier', 'plugin:storybook/recommended'],
  rules: {
    'prettier/prettier': 'error',
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_',
      },
    ],
    '@typescript-eslint/consistent-type-imports': 'error',
    '@typescript-eslint/no-floating-promises': 'warn',
    '@typescript-eslint/no-misused-promises': 'warn',
    '@typescript-eslint/require-await': 'warn',
    '@typescript-eslint/prefer-nullish-coalescing': 'error',
    '@typescript-eslint/restrict-template-expressions': 'off',
    'jsx-a11y/anchor-is-valid': 'off',
    'jsx-a11y/click-events-have-key-events': 'warn',
    'jsx-a11y/no-noninteractive-element-interactions': 'warn',
    'tailwindcss/no-custom-classname': 'warn',
    'tailwindcss/enforces-shorthand': 'error',
  },
  overrides: [
    {
      files: ['**/*.astro'],
      parser: 'astro-eslint-parser',
      parserOptions: {
        parser: '@typescript-eslint/parser',
        extraFileExtensions: ['.astro'],
      },
      rules: {
        'astro/missing-client-only-directive-value': 'error',
        // 'astro/no-unused-define-vars': 'warn', - Rule not available in eslint-plugin-astro v1.x
      },
    },
    {
      files: ['**/*.md'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        extraFileExtensions: ['.md'],
      },
    },
  ],
  ignorePatterns: [
    'dist/',
    'node_modules/',
    '.astro/',
    'coverage/',
    'storybook-static/',
    'openspec/',
    '*.md',
  ],
};
