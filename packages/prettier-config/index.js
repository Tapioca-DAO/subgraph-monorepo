/** @type {import("prettier").Config} */
module.exports = {
  semi: false,
  singleQuote: false,
  printWidth: 80,
  importOrderSeparation: true,
  plugins: ["@trivago/prettier-plugin-sort-imports"],
  importOrder: [
    "^@/constants(.*)$",
    "<THIRD_PARTY_MODULES>",
    "^@/utils(.*)$",
    "^[./]",
  ],
};
