// main.js

import { input, select } from '@inquirer/prompts';
import { info } from './utils/chalk.js';
import showBanner from './utils/banner.js';
import {FolderManager} from "./utils/fs-funcs.js"

const fileSystem = new FolderManager()

class Main {
  constructor(args) {
    this.args = args || process.argv.slice(2);
    this.targetPath = '';
  }

  async init() {
    showBanner();
    await this.resolveTargetPath();
    this.printSummary();
    fileSystem.create(this.targetPath)
  }

  async resolveTargetPath() {
    if (this.args.length === 0) {
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

        this.targetPath = `./${projectName}`;
      } else {
        this.targetPath = '.';
      }
    } else {
      this.targetPath = this.args.pop();
    }
  }

  printSummary() {
    console.log(`\n📂 Target Path: ${this.targetPath}`);
  }
}

export default Main;
