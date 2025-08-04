// createProject.js

import { select } from '@inquirer/prompts';
import { copyAllFromFolder } from './utils/index.js';

export async function creatingProject(temp, targetPath) {
  switch (temp) {
    case 'css':
      const projectType = await selectTemplateProject();
      console.log(`🛠️ Selected template: ${projectType}`);

      if (projectType === '1') {
        await copyAllFromFolder('templates/normalcss/js-template', targetPath);
      }
      if (projectType === '2') {
        await copyAllFromFolder('templates/normalcss/ts-template', targetPath);
      }
      if (projectType === '3') {
        await copyAllFromFolder('templates/normalcss/js-frontend-ts-backend', targetPath);
      }
      if (projectType === '4') {
        await copyAllFromFolder('templates/normalcss/ts-frontend-js-backend', targetPath);
      }
      break;

    default:
      console.log('⚠️ Unknown template type.');
      break;
  }
}

export async function selectTemplateProject() {
  const setupOption = await select({
    message: '✨ Which Project setup do you want to use for your project?',
    choices: [
      {
        name: 'JS Full Template',
        value: '1',
        description: 'Both frontend & backend in JavaScript',
      },
      {
        name: 'TS Full Template',
        value: '2',
        description: 'Both frontend & backend in TypeScript',
      },
      {
        name: 'JS Frontend + TS Backend',
        value: '3',
        description: 'Frontend in JavaScript, backend in TypeScript',
      },
      {
        name: 'TS Frontend + JS Backend',
        value: '4',
        description: 'Frontend in TypeScript, backend in JavaScript',
      },
    ],
  });

  return setupOption; 
}
