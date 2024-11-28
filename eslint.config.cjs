/** @type {import('eslint').Linter.Config} */
module.exports = [
    {
      files: ['**/*.ts', '**/*.tsx'],
      languageOptions: {
        parser: require('@typescript-eslint/parser'),
        parserOptions: {
          tsconfigRootDir: __dirname,
          project: './tsconfig.json',
        },
      },
      plugins: {
        '@typescript-eslint': require('@typescript-eslint/eslint-plugin'),
      },
      rules: {
        'no-duplicate-imports': 'error',
        '@typescript-eslint/no-unused-vars': 'error',
      },
    },
    {
      files: ['**/*.js', '**/*.jsx', '**/*.ts', '**/*.tsx'],
      rules: {
        'no-duplicate-imports': 'error',
      },
    },
    {
      ignores: [
        '**/.next/**',
        '**/.vscode/**',
        '**/node_modules/**',
        '**/dist/**',
        '**/build/**',
        '**/*.log',
        '**/coverage/**',
        '**/.eslintcache',
      ],
    },
  ];
  