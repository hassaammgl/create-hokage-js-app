// createProject.js

import { select } from '@inquirer/prompts';
import { copyAllFromFolder } from './utils/index.js';
import { installDeps, depsPerProject } from "./utils/dependency.js"

export async function creatingProject(temp, targetPath) {
  switch (temp) {
    case 'css':
      const projectType = await selectTemplateProject();
      console.log(`🛠️ Selected template: ${projectType}`);

      let templatePath = '';
      if (projectType === '1') {
        templatePath = 'templates/normalcss/js-template';
      } else if (projectType === '2') {
        templatePath = 'templates/normalcss/ts-template';
      } else if (projectType === '3') {
        templatePath = 'templates/normalcss/js-frontend-ts-backend';
      } else if (projectType === '4') {
        templatePath = 'templates/normalcss/ts-frontend-js-backend';
      }

      await copyAllFromFolder(templatePath, targetPath);

      const deps = depsPerProject[temp]?.[projectType];
      if (deps) {
        const clientPath = path.join(targetPath, 'client');
        const apiPath = path.join(targetPath, 'api');

        if (deps.client.main.length || deps.client.dev.length) {
          console.log(`📦 Installing client dependencies...`);
          await installDeps(deps.client.main, { dev: false });
          await installDeps(deps.client.dev, { dev: true });
        }

        if (deps.api.main.length || deps.api.dev.length) {
          console.log(`📦 Installing API dependencies...`);
          await installDeps(deps.api.main, { dev: false });
          await installDeps(deps.api.dev, { dev: true });
        }
      } else {
        console.log("⚠️ No dependencies found for this template.");
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
