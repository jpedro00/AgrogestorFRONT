const { defineConfig } = require("eslint/config");
const expo = require("eslint-config-expo/flat");
module.exports = defineConfig([
  expo,
  {
    ignores: [
      "dist/**",
      "dist-native/**",
      "playwright-report/**",
      "test-results/**",
      "test-results-modules/**",
    ],
  },
]);
