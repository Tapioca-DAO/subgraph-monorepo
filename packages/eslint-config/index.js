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
    "unused-imports/no-unused-imports-ts": "error",
    "import/no-duplicates": "error",
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
    "@typescript-eslint/ban-types": [
      "error",
      {
        "types": {
          // We need to allow BigInt because it is exported from "@graphprotocol/graph-ts"
          "BigInt": false,
        },
        "extendDefaults": true
      }
    ],
    // we need to allow empty constructors
    "@typescript-eslint/no-empty-function": [
      "error",
      {
        "allow": [
          "constructors"
        ]
      }
    ],
    "@typescript-eslint/no-inferrable-types": [
      "error",
      {
        "ignoreParameters": true
      }
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
    "node_modules", 
    "build", 
    "generated"
  ],
};
