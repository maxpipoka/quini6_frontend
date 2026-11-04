import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react() as never],
  test: {
    globals: true,
    environment: './src/test/jsdom-environment.ts',
    include: ['src/**/*.test.ts', 'src/**/*.test.tsx', 'tests/unit/**/*.test.ts'],
    setupFiles: ['src/test/polyfills.ts', 'src/test/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: [
        'src/lib/**/*.ts',
        'src/lib/**/*.tsx',
        'src/components/admin/**/*.tsx',
        'src/hooks/useImport*.ts',
        'src/workers/**/*.ts',
      ],
      exclude: [
        'src/**/*.stories.tsx',
        'src/**/*.test.ts',
        'src/**/*.test.tsx',
        'src/test/**',
        'src/mock/**',
        'src/env.d.ts',
        'src/pages/**',
        'src/layouts/**',
        'src/styles/**',
        'src/components/admin/Sidebar.tsx',
        'src/components/admin/ImportWizard.visual.tsx',
        'src/lib/env.ts',
        'src/lib/index.ts',
        'src/lib/types/import-worker.ts',
        'src/workers/importParser.ts',
      ],
      thresholds: {
        statements: 80,
        branches: 70,
        functions: 80,
        lines: 80,
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
