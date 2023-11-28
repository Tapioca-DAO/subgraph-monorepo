/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: [
    "turbo",
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
    "plugin:@cspell/recommended",
    "plugin:prettier/recommended",
  ],
  plugins: ["unused-imports", "@typescript-eslint", "import", "@cspell"],
  rules: {
    "@typescript-eslint/consistent-type-imports": 0,
    "@typescript-eslint/no-unnecessary-type-assertion": 0,
    "@typescript-eslint/no-non-null-assertion": 0,
    "eqeqeq": 0,
    "@typescript-eslint/no-namespace": 0,
    "@cspell/spellchecker": [
      "warn",
      {
        cspell: {
          words: require("./cspell-dictionary"),
        },
      },
    ],
  },
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: ["./tsconfig.json"],
  },
  ignorePatterns: [
    "/*.*", // ignore files in root
    "index.js", // this file
    "cspell-dictionary.js", // dictionary
  ],
};
