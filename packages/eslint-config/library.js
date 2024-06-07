const { resolve } = require("node:path");

const project = resolve(process.cwd(), "tsconfig.json");

/*
 * This is a custom ESLint configuration for use with
 * internal (bundled by their consumer) libraries.
 */

/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: [
    "eslint:recommended",
    "eslint-config-turbo",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
    "prettier",
  ],
  env: {
    node: true,
  },
  plugins: ["only-warn", "@typescript-eslint"],
  rules: {
    "@typescript-eslint/no-misused-promises": "warn",
    "@typescript-eslint/no-floating-promises": "off",
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/no-unused-vars": [
      "error",
      {
        "args": "all",
        "argsIgnorePattern": "^_",
        "caughtErrors": "all",
        "caughtErrorsIgnorePattern": "^_",
        "destructuredArrayIgnorePattern": "^_",
        "varsIgnorePattern": "^_",
        "ignoreRestSiblings": true
      }
    ]
  },
  settings: {
    "import/resolver": {
      typescript: {
        project,
      },
    },
  },
  ignorePatterns: [
    // Ignore dotfiles
    ".*.js",
    "node_modules/",
    "dist/",
  ],
  overrides: [
    // Force ESLint to detect .tsx files
    { files: ["*.js?(x)", "*.ts?(x)"] },
  ],
};
