export default {
  env: {
    node: true,
    es6: true,
  },
  extends: ['eslint:recommended', 'prettier'],
  rules: {
    'no-console': ['warn', { allow: ['warn', 'error'] }],
  },
};
