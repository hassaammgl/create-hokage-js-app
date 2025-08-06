import { select } from "@inquirer/prompts";

export async function selectProjectTemplates() {
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