// Airbnb's own restricted-syntax entries; a rule override replaces them, so keep them.
// eslint-disable-next-line import/extensions -- the package's exports map has no '.js' subpath
const [, ...airbnbRestricted] = require('eslint-config-airbnb-base/rules/style').rules['no-restricted-syntax'];

const htmlSinkMessage = 'Build DOM with createElement/textContent, or sanitise with DOMPurify. '
  + 'If the markup is already rendered or a fixed string, disable this line and say why.';

module.exports = {
  root: true,
  extends: [
    'airbnb-base',
    'plugin:json/recommended',
    'plugin:xwalk/recommended',
  ],
  env: {
    browser: true,
  },
  parser: '@babel/eslint-parser',
  parserOptions: {
    allowImportExportEverywhere: true,
    sourceType: 'module',
    requireConfigFile: false,
  },
  rules: {
    'import/extensions': ['error', { js: 'always' }], // require js file extensions in imports
    'linebreak-style': ['error', 'unix'], // enforce unix linebreaks
    'no-param-reassign': [2, { props: false }], // allow modifying properties of param
  },
  overrides: [{
    // flag every HTML sink in our code so it gets a security review
    files: ['blocks/**/*.js', 'scripts/**/*.js'],
    excludedFiles: ['scripts/aem.js', 'scripts/*.min.js'],
    rules: {
      'no-restricted-syntax': ['error', ...airbnbRestricted,
        { selector: 'AssignmentExpression[left.property.name=/^(innerHTML|outerHTML)$/]', message: htmlSinkMessage },
        { selector: "CallExpression[callee.property.name='insertAdjacentHTML']", message: htmlSinkMessage },
      ],
    },
  }],
};
