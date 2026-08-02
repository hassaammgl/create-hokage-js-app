import { select } from '@inquirer/prompts';
import { PROJECT_TEMPLATE_IDS } from '../config/project-templates.js';

export async function selectProjectTemplate() {
  return select({
    message: '✨ Which Project setup do you want to use for your project?',
    choices: [
      {
        name: 'JS Full Template',
        value: PROJECT_TEMPLATE_IDS.JS_FULL,
        description: 'Both frontend & backend in JavaScript',
      },
      {
        name: 'TS Full Template',
        value: PROJECT_TEMPLATE_IDS.TS_FULL,
        description: 'Both frontend & backend in TypeScript',
      },
      {
        name: 'JS Frontend + TS Backend',
        value: PROJECT_TEMPLATE_IDS.JS_FRONTEND_TS_BACKEND,
        description: 'Frontend in JavaScript, backend in TypeScript',
      },
      {
        name: 'TS Frontend + JS Backend',
        value: PROJECT_TEMPLATE_IDS.TS_FRONTEND_JS_BACKEND,
        description: 'Frontend in TypeScript, backend in JavaScript',
      },
    ],
  });
}
