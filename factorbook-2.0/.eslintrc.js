module.exports = {
    parser: '@babel/eslint-parser',
    extends: [
      'eslint:recommended',
      'plugin:react/recommended',
      'plugin:@typescript-eslint/recommended',
      'next',
      'next/core-web-vitals'
    ],
    plugins: [
      'react',
      '@typescript-eslint',
    ],
    rules: {
    },
    parserOptions: {
      requireConfigFile: false,
    },
  };
  