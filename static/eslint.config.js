import globals from "globals";


/** @type {import('eslint').Linter.Config[]} */
export default [
  {languageOptions: { globals: {...globals.browser, ...globals.node} }},
  {
    "env": {
      "browser": true,
      "node": true,
      "es2021": true
    },
    "extends": "eslint:recommended",
    "rules": {
      "no-unused-vars": "warn"
    }
  },
];