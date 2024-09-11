import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintConfigPrettier from 'eslint-config-prettier';
import { fixupPluginRules } from '@eslint/compat';
import _import from 'eslint-plugin-import';

export default [
  { files: ['**/*.{js,mjs,cjs,ts}'] },
  {
    ignores: ['build/', 'node_modules/', 'docs/', 'eslint.config.js'],
  },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  eslintConfigPrettier,
  ...tseslint.configs.recommendedTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      // "async-await": asyncAwait,
      import: fixupPluginRules(_import),
    },

    // languageOptions: {
    //   ecmaVersion: 6,
    //   sourceType: 'module',

    //   parserOptions: {
    //     project: true,
    //     tsconfigRootDir: import.meta.dirname,
    //     ecmaFeatures: {
    //       arrowFunctions: true,
    //       blockBindings: true,
    //       classes: true,
    //       destructuring: true,
    //       defaultParams: true,
    //       modules: true,
    //       restParams: true,
    //       spread: true,
    //     },
    //   },
    // },

    rules: {
      'arrow-parens': 2,
      'arrow-spacing': 2,
      'block-scoped-var': 0,

      'brace-style': [
        2,
        '1tbs',
        {
          allowSingleLine: false,
        },
      ],

      camelcase: 0,
      'comma-dangle': [2, 'always-multiline'],
      'comma-spacing': 2,
      'comma-style': [2, 'last'],
      curly: [2, 'all'],

      'dot-notation': [
        2,
        {
          allowKeywords: true,
        },
      ],

      eqeqeq: [2, 'allow-null'],
      'guard-for-in': 0,
      'key-spacing': 2,
      'keyword-spacing': 2,

      'new-cap': [
        2,
        {
          capIsNewExceptions: ['Deferred'],
        },
      ],

      'no-bitwise': 2,
      'no-caller': 2,
      'no-cond-assign': [2, 'except-parens'],
      'no-console': 2,
      'no-debugger': 2,
      'no-empty': 2,
      'no-eval': 2,
      'no-extend-native': 2,
      'no-extra-parens': 0,
      'no-extra-semi': 2,

      'no-implicit-coercion': [
        2,
        {
          boolean: true,
          number: true,
          string: true,
        },
      ],

      'no-irregular-whitespace': 2,
      'no-iterator': 2,
      'no-loop-func': 0,
      'no-mixed-spaces-and-tabs': 2,
      'no-multi-str': 2,
      'no-multi-spaces': 2,

      'no-multiple-empty-lines': [
        2,
        {
          max: 2,
        },
      ],

      'no-new': 2,
      'no-plusplus': 0,
      'no-proto': 2,
      'no-redeclare': 0,

      'no-shadow': [
        2,
        {
          builtinGlobals: true,
        },
      ],

      'no-shadow-restricted-names': 2,
      'no-script-url': 2,
      'no-sequences': 2,
      'no-template-curly-in-string': 2,

      'no-trailing-spaces': [
        2,
        {
          skipBlankLines: false,
        },
      ],

      // 'no-undef': 2, // Safe to disable because TypeScript will catch these (https://eslint.org/docs/latest/rules/no-undef)
      'no-underscore-dangle': 0,
      'no-unneeded-ternary': 2,
      'no-unused-vars': 2,
      'no-with': 2,

      'object-property-newline': [
        2,
        {
          allowMultiplePropertiesPerLine: true,
        },
      ],

      'object-shorthand': 2,
      'one-var': [2, 'never'],
      'prefer-const': 2,
      'prefer-template': 2,
      quotes: [2, 'single', 'avoid-escape'],
      'require-yield': 2,
      semi: [2, 'always'],
      'space-before-blocks': [2, 'always'],
      'space-infix-ops': 2,
      strict: [2, 'never'],
      'valid-typeof': 2,
      'wrap-iife': [2, 'inside'],
      // 'import/no-unresolved': 2,
      'import/named': 2,
      'import/default': 2,
      // 'import/namespace': 2,
      'import/export': 2,
      'import/no-named-as-default': 2,
      'import/no-named-as-default-member': 2,
      'import/no-mutable-exports': 2,

      'import/imports-first': 2,
      'import/no-duplicates': 2,
      'import/extensions': [0, 'never'],

      'import/order': [
        2,
        {
          groups: [
            'builtin',
            'external',
            'internal',
            ['parent', 'sibling'],
            'index',
          ],
          'newlines-between': 'always',
        },
      ],

      'import/newline-after-import': 2,
    },
  },
];
