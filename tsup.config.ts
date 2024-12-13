import fs from 'fs-extra';
import { defineConfig } from 'tsup';

export default defineConfig({
  clean: true,
  dts: true,
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
    await fs.copy('solutions', 'dist/solutions');
  },
});
