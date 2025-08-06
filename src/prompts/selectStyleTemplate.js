// selectTemplate.js

import { select } from '@inquirer/prompts';

export async function selectStyleTemplates() {
  const setupOption = await select({
    message: '✨ Which styling setup do you want to use for your project?',
    choices: [
      {
        name: 'Plain CSS',
        value: 'css',
        description: 'Basic styling using .css files',
      },
      {
        name: 'SCSS / SASS (comming soon)',
        value: 'scss',
        description: 'Use SCSS syntax for stylesheets',
      },
      {
        name: 'Tailwind CSS (comming soon)',
        value: 'tailwindcss',
        description: 'Utility-first styling with Tailwind',
      },
      {
        name: 'shadcn/ui (with Tailwind) (comming soon)',
        value: 'shadcn-ui',
        description: 'Tailwind + beautiful prebuilt components',
      },
    ],
  });

  return setupOption;
}
