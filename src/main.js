import { input, select } from '@inquirer/prompts';
import { info } from './utils/logger.js';
import showBanner from './utils/banner.js';
import { FolderManager } from './utils/folder-manager.js';
import { selectStyleTemplate } from './prompts/selectStyleTemplate.js';
import { selectProjectTemplate } from './prompts/selectProjectTemplates.js';
import { ProjectBuilder } from './projectBuilder.js';

export default class Main {
  /**
   * @param {string[]} [args]
   * @param {FolderManager} [folderManager]
   */
  constructor(args = process.argv.slice(2), folderManager = new FolderManager()) {
    this.args = args;
    this.folderManager = folderManager;
    this.targetPath = '';
    this.projectTemplateId = '';
    this.styleId = '';
  }

  async run() {
    showBanner();
    await this.#resolveTargetPath();
    this.#printTargetSummary();
    await this.folderManager.ensureDirectory(this.targetPath);

    this.projectTemplateId = await selectProjectTemplate();
    this.styleId = await selectStyleTemplate();

    info(`Selected style: ${this.styleId}`);
    info(`Selected template: ${this.projectTemplateId}`);

    const builder = new ProjectBuilder(
      this.styleId,
      this.projectTemplateId,
      this.targetPath,
      this.folderManager,
    );
    await builder.scaffold();
  }

  async #resolveTargetPath() {
    if (this.args.length === 0) {
      this.targetPath = await this.#promptForTargetPath();
      return;
    }

    this.targetPath = this.args.at(-1);
  }

  async #promptForTargetPath() {
    info('No path provided - starting interactive setup...\n');

    const setupOption = await select({
      message: '📁 Where do you want to initialize the project?',
      choices: [
        { name: 'Use current directory (.)', value: 'current' },
        { name: 'Create new project directory', value: 'new' },
      ],
    });

    if (setupOption !== 'new') {
      return '.';
    }

    const projectName = await input({
      message: '📝 Enter your project name:',
      validate: (value) => value.trim() !== '' || 'Project name cannot be empty!',
    });

    return `./${projectName}`;
  }

  #printTargetSummary() {
    console.log(`\n📂 Target Path: ${this.targetPath}`);
  }
}
