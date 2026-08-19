// @ts-check
import eslint from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: ['eslint.config.mjs'],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  eslintPluginPrettierRecommended,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      sourceType: 'commonjs',
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-floating-promises': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'warn',
      "prettier/prettier": ["error", { endOfLine: "auto" }],
    },
  },
  {
    // Module boundaries (REFACTOR-PLAN v2, B2). A module may only be reached
    // through its index.ts, so its internals stay free to change. Without this
    // the boundary is a convention, and conventions rot silently.
    //
    // Deliberately still allowed:
    //   ../x/x.module      composition wiring, imported by other module files
    //   ../x               the public surface itself
    //   ./x.service        same-module imports
    //   ../../common/*     shared infrastructure, owned by nobody
    files: ['src/modules/**/*.ts'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: [
                '../*/*.service',
                '../*/*.repository',
                '../*/*.controller',
                '../*/dto/*',
                '**/modules/*/*.service',
                '**/modules/*/*.repository',
                '**/modules/*/dto/*',
              ],
              message:
                "Import another module through its public surface ('../that-module'), not one of its files. If what you need is not exported there, widen the surface deliberately in that module's index.ts.",
            },
          ],
        },
      ],
    },
  },
);
