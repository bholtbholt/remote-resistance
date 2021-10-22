module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  testRegex: '(/tests/.*|(\\.|/)(test|spec))\\.ts$',
  testPathIgnorePatterns: ['test-helper.ts', 'history-states.ts'],
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
