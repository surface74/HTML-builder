module.exports = {
  env: {
    browser: true,
    node: true,
    commonjs: true,
    es2021: true
  },
  extends: 'eslint:recommended',
  overrides: [
  ],
  parserOptions: {
    ecmaVersion: 'latest'
  },
  'rules': {
    'indent': ['error', 2],
    'quotes': ['error', 'single'],
    'semi': ['error', 'always']
  }
};
