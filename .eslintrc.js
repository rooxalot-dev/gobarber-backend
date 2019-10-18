module.exports = {
  env: {
    es6: true,
    node: true,
  },
  extends: [
    'airbnb-base',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  rules: {
    "class-methods-use-this": "off",
    "no-param-reassign": "off",
    "camelcase": "off",
    "sort-imports": "off",
    "linebreak-style": 0,
    "no-console": 0,
    "no-tabs": 0,
    // Indent with 4 spaces
    "indent": ["error", 4],
    "no-unused-vars": ["error", { "argsIgnorePattern": "off" }]
  },
};
