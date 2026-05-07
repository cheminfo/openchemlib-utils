import { defineConfig, globalIgnores } from 'eslint/config';
import cheminfo from 'eslint-config-cheminfo-typescript';
import globals from 'globals';

export default defineConfig(
  globalIgnores(['coverage', 'dist', 'lib']),
  cheminfo,
  {
    languageOptions: {
      globals: {
        ...globals.nodeBuiltin,
      },
    },
    rules: {
      'jsdoc/require-jsdoc': 'off', // this would add automatically an empty bloc of JsDoc
      'jsdoc/no-defaults': 'off', // this would remove our default values https://github.com/gajus/eslint-plugin-jsdoc/blob/main/docs/rules/no-defaults.md#readme
    },
  },
);
