import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest/presets/default-esm',

  // Mocks
  clearMocks: true,

  // Test
  testEnvironment: 'node',
  testPathIgnorePatterns: ['node_modules/', 'dist/'],

  // Coverage
  collectCoverage: true,
  coverageDirectory: 'coverage',
  collectCoverageFrom: ['src/**/*.{js,ts}', '!src/**/*.d.ts'],
};

export default config;
