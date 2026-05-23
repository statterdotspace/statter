import nextEslintPluginNext from '@next/eslint-plugin-next';
import nx from '@nx/eslint-plugin';
import baseConfig from '../../eslint.config.mjs';

export default [
  { plugins: { '@next/next': nextEslintPluginNext } },
  ...nx.configs['flat/react-typescript'],
  ...baseConfig,
  {
    files: ['src/**/*.{ts,tsx,js,jsx,mjs,cjs}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@/entities/*/*', '@/features/*/*', '@/widgets/*/*'],
              message: 'Use slice public API (index.ts) instead of deep imports.',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['src/shared/**/*.{ts,tsx,js,jsx,mjs,cjs}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@/features/*', '@/widgets/*', '@/app/*'],
              message: 'Shared layer cannot depend on features/widgets/app.',
            },
            {
              group: ['@/entities/*/*', '@/features/*/*', '@/widgets/*/*'],
              message: 'Use slice public API (index.ts) instead of deep imports.',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['src/entities/**/*.{ts,tsx,js,jsx,mjs,cjs}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@/features/*', '@/widgets/*', '@/app/*'],
              message: 'Entities layer cannot depend on features/widgets/app.',
            },
            {
              group: ['@/entities/*/*', '@/features/*/*', '@/widgets/*/*'],
              message: 'Use slice public API (index.ts) instead of deep imports.',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['src/features/**/*.{ts,tsx,js,jsx,mjs,cjs}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@/widgets/*', '@/app/*'],
              message: 'Features layer cannot depend on widgets/app.',
            },
            {
              group: ['@/entities/*/*', '@/features/*/*', '@/widgets/*/*'],
              message: 'Use slice public API (index.ts) instead of deep imports.',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['src/widgets/**/*.{ts,tsx,js,jsx,mjs,cjs}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@/app/*'],
              message: 'Widgets layer cannot depend on app.',
            },
            {
              group: ['@/entities/*/*', '@/features/*/*', '@/widgets/*/*'],
              message: 'Use slice public API (index.ts) instead of deep imports.',
            },
          ],
        },
      ],
    },
  },
  {
    ignores: ['.next/**/*'],
  },
];
