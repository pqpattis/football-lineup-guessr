module.exports = {
  // Use jsdom environment for browser-like testing
  testEnvironment: 'jsdom',
  
  // Array of file extensions to handle
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],

  testPathIgnorePatterns: ['/node_modules/', '/.next/'],

  // Configure ts-jest
  transform: {
        '^.+\\.(ts|tsx)$': ['ts-jest'],
    },

  // Setup file for global configurations
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],

  // Handle module aliases
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
};