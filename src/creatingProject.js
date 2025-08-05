// createProject.js
import { select } from '@inquirer/prompts';
import { copyAllFromFolder } from './utils/index.js';
import { runCommand } from "./utils/dependency.js"
import path from 'path'
import { createSpinner } from "nanospinner";

export async function creatingProject(temp, targetPath) {
  switch (temp) {
    case 'css':
      const projectType = await selectTemplateProject();
      console.log(`🛠️ Selected template: ${projectType}`);

      let templatePath = '';
      let clientPackages = ""
      let apiPackages = ""
      if (projectType === '1') {
        templatePath = 'templates/normalcss/js-template';
        clientPackages = `npm i react react-dom && npm i -D @eslint/js @types/react @types/react-dom @vitejs/plugin-react-swc eslint eslint-plugin-react-hooks eslint-plugin-react-refresh globals vite`
        apiPackages = `npm install argon2 colors cookie-parser cors dotenv express express-async-handler joi jsonwebtoken mongoose morgan`
      }
      else if (projectType === '2') {
        templatePath = 'templates/normalcss/ts-template';
        clientPackages = `npm install react react-dom && npm install --save-dev @eslint/js @types/react @types/react-dom @vitejs/plugin-react eslint eslint-plugin-react-hooks eslint-plugin-react-refresh globals typescript typescript-eslint vite`
        apiPackages = `npm install argon2 colors cookie-parser cors dotenv express express-async-handler joi jsonwebtoken mongoose morgan && npm install --save-dev @types/argon2 @types/cookie-parser @types/cors @types/express @types/jsonwebtoken @types/morgan @types/node ts-node-dev tsx typescript`
      }
      else if (projectType === '3') {
        templatePath = 'templates/normalcss/js-frontend-ts-backend';
        clientPackages = `npm i react react-dom && npm i -D @eslint/js @types/react @types/react-dom @vitejs/plugin-react-swc eslint eslint-plugin-react-hooks eslint-plugin-react-refresh globals vite`
        apiPackages = `npm install argon2 colors cookie-parser cors dotenv express express-async-handler joi jsonwebtoken mongoose morgan && npm install --save-dev @types/argon2 @types/cookie-parser @types/cors @types/express @types/jsonwebtoken @types/morgan @types/node ts-node-dev tsx typescript`
      }
      else if (projectType === '4') {
        templatePath = 'templates/normalcss/ts-frontend-js-backend';
        clientPackages = `npm install react react-dom && npm install --save-dev @eslint/js @types/react @types/react-dom @vitejs/plugin-react eslint eslint-plugin-react-hooks eslint-plugin-react-refresh globals typescript typescript-eslint vite`
        apiPackages = `npm install argon2 colors cookie-parser cors dotenv express express-async-handler joi jsonwebtoken mongoose morgan`
      }
      await copyAllFromFolder(templatePath, targetPath);
      const client = path.join(targetPath, "/client")
      const api = path.join(targetPath, "/api")
      console.log(client, api);
      const spinner = createSpinner("⚙️ Installing dependencies...").start();
      await runCommand(clientPackages, client)
      await runCommand(apiPackages, api)
      spinner.stop()
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
