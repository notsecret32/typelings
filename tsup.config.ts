import fs from 'fs-extra';
import { defineConfig } from 'tsup';

export default defineConfig({
  clean: true,
  entry: ['src/index.ts'],
  format: ['esm'],
  sourcemap: true,
  minify: true,
  target: 'esnext',
  outDir: 'dist',
  ignoreWatch: [
    '.changeset',
    '.github',
    '.husky',
    'coverage',
    'dist',
    'node_modules',
    'test',
  ],
  onSuccess: async () => {
    await fs.copy('exercises', 'dist/exercises');
    await fs.copy('utils/index.d.ts', 'dist/utils/index.d.ts');
  },
});
