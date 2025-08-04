// // main.js

// import init from "./init.js";
// import { input, select } from '@inquirer/prompts';

// export default async function main() {
//     const args = process.argv.slice(2);
//     let targetPath;

//     if (args.length === 0) {
//         console.log('No path provided - starting interactive setup...');

//         const setupOption = await select({
//             message: 'How would you like to proceed?',
//             choices: [
//                 {
//                     name: 'Use current directory (.)',
//                     value: 'current',
//                     description: 'Initialize project in current directory'
//                 },
//                 {
//                     name: 'Create new project directory',
//                     value: 'new',
//                     description: 'Create a new directory for your project'
//                 }
//             ]
//         });

//         if (setupOption === 'new') {
//             const projectName = await input({
//                 message: 'Enter your project name:',
//                 validate: (value) => value.trim() ? true : 'Project name cannot be empty'
//             });
//             targetPath = `./${projectName}`;
//         } else {
//             targetPath = '.';
//         }
//     } else {
//         targetPath = args.pop();
//     }

//     console.log(`Initializing project at: ${targetPath}`);
//     await init(targetPath);
// }

// main.js

import init from "./init.js";
import { input, select, confirm } from '@inquirer/prompts';
import { info } from './utils/chalk.js';

function showBanner() {
  console.clear();
  console.log(`
 █████               █████                                          ███         
░░███               ░░███                                          ░░░          
 ░███████    ██████  ░███ █████  ██████    ███████  ██████         █████  █████ 
 ░███░░███  ███░░███ ░███░░███  ░░░░░███  ███░░███ ███░░███       ░░███  ███░░  
 ░███ ░███ ░███ ░███ ░██████░    ███████ ░███ ░███░███████         ░███ ░░█████ 
 ░███ ░███ ░███ ░███ ░███░░███  ███░░███ ░███ ░███░███░░░          ░███  ░░░░███
 ████ █████░░██████  ████ █████░░████████░░███████░░██████  ██     ░███  ██████ 
░░░░ ░░░░░  ░░░░░░  ░░░░ ░░░░░  ░░░░░░░░  ░░░░░███ ░░░░░░  ░░      ░███ ░░░░░░  
                                          ███ ░███             ███ ░███         
                                         ░░██████             ░░██████          
                                          ░░░░░░               ░░░░░░             
                        ⚡ CLI PROJECT INITIALIZER ⚡      
`);
}

export default async function main() {
  showBanner();

  const args = process.argv.slice(2);
  let targetPath;

  if (args.length === 0) {
    info('No path provided - starting interactive setup...\n');

    const setupOption = await select({
      message: '📁 Where do you want to initialize the project?',
      choices: [
        { name: 'Use current directory (.)', value: 'current' },
        { name: 'Create new project directory', value: 'new' },
      ],
    });

    if (setupOption === 'new') {
      const projectName = await input({
        message: '📝 Enter your project name:',
        validate: (val) => val.trim() !== '' || 'Project name cannot be empty!',
      });
      targetPath = `./${projectName}`;
    } else {
      targetPath = '.';
    }
  } else {
    targetPath = args.pop();
  }

  console.log(`\n📂 Target Path: ${targetPath}`);
  await init(targetPath);
}
