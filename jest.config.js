module.exports = {
  setupFilesAfterEnv: ['./tests/test-setup.ts'],
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  testRegex: '(/tests/.*|(\\.|/)(test|spec))\\.ts$',
  testPathIgnorePatterns: ['test-setup.ts', 'test-helper.ts', 'history-states.ts'],
  transform: {
    '^.+\\.svelte$': [
      'svelte-jester',
      {
        preprocess: true,
      },
    ],
    '^.+\\.ts$': 'ts-jest',
  },
  moduleFileExtensions: ['svelte', 'ts', 'js'],
};
