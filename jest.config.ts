import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest/presets/default-esm',
  roots: ['./src', './test'],
  moduleDirectories: ['node_modules', 'src'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },

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
