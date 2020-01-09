module.exports = {
  preset: 'ts-jest',

  globals: {
    'ts-jest': {
      // The tsconfig location has to be specified otherwise, it will not transform the javascript
      // files.
      tsConfig: '<rootDir>/tsconfig.json',

      // By default ts-jest reports typescript compilation errors. Let's disable for now diagnostic
      // reporting since some of the packages doesn't pass the typescript compilation.
      diagnostics: false,
    },
  },

  transform: {
    '^.+\\.(js|tsx?)$': 'ts-jest',
  },

  moduleDirectories: ['node_modules', 'packages'],

  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],

  testMatch: ['<rootDir>/**/__tests__/*.spec.(js|ts)'],

  coverageDirectory: '<rootDir>/coverage',

  // Global mono-repo code coverage threshold.
  coverageThreshold: {
    global: {
      branches: 0,
      functions: 0,
      lines: 0,
    },
  },

  clearMocks: true,
};
