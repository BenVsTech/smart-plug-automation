module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    roots: ['<rootDir>'],
    testMatch: ['**/__tests__/**/*.test.ts', '**/?(*.)+(spec|test).ts'],
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    collectCoverageFrom: [
      'lib/**/*.ts',
      '!lib/**/*.d.ts',
      '!lib/**/__tests__/**',
    ],
    moduleNameMapper: {
      '^@/(.*)$': '<rootDir>/$1',
    },
};