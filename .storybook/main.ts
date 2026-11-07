import type { StorybookConfig } from '@storybook/react-vite';
import path from 'path';

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: ['@storybook/addon-a11y'],
  framework: '@storybook/react-vite',
  viteFinal: async (config) => {
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, '../src'),
      '@components': path.resolve(__dirname, '../src/components'),
      '@lib': path.resolve(__dirname, '../src/lib'),
      '@styles': path.resolve(__dirname, '../src/styles'),
      '@layouts': path.resolve(__dirname, '../src/layouts'),
      '@pages': path.resolve(__dirname, '../src/pages'),
      '@mock': path.resolve(__dirname, '../src/mock'),
      '@tests': path.resolve(__dirname, '../tests'),
    };
    // GitHub Pages base path for Storybook deployment
    config.base = '/quini6_frontend/';
    return config;
  },
};
export default config;
