import path from 'path';
import { createSpinner } from 'nanospinner';
import { FolderManager } from './utils/folder-manager.js';
import { runCommand } from './utils/run-command.js';
import { resolveProjectTemplate } from './config/project-templates.js';
import { printEnvSetupInstructions } from './presentation/env-setup-instructions.js';

export class ProjectBuilder {
  /**
   * @param {string} styleId
   * @param {string} templateId
   * @param {string} targetPath
   * @param {FolderManager} [folderManager]
   */
  constructor(styleId, templateId, targetPath, folderManager = new FolderManager()) {
    this.styleId = styleId;
    this.templateId = templateId;
    this.targetPath = targetPath;
    this.folderManager = folderManager;
    this.templatePath = '';
    this.clientPackages = '';
    this.apiPackages = '';
  }

  async scaffold() {
    this.#resolveTemplatePlan();
    await this.#copyTemplate();
    await this.#installDependencies();
    printEnvSetupInstructions(this.targetPath);
  }

  #resolveTemplatePlan() {
    const plan = resolveProjectTemplate(this.templateId, this.styleId);
    this.templatePath = plan.templatePath;
    this.clientPackages = plan.clientPackages;
    this.apiPackages = plan.apiPackages;
  }

  async #copyTemplate() {
    const spinner = createSpinner('Copying template...').start();
    try {
      await this.folderManager.copyFrom(this.templatePath, this.targetPath);
      spinner.success({ text: `✅ Template copied to "${this.targetPath}"` });
    } catch (err) {
      spinner.error({ text: '❌ Failed to copy template.' });
      throw err;
    }
  }

  async #installDependencies() {
    await this.#installPackageSet('client', this.clientPackages);
    await this.#installPackageSet('api', this.apiPackages);
  }

  async #installPackageSet(workspaceName, installCommand) {
    const workspacePath = path.join(this.targetPath, workspaceName);
    const spinner = createSpinner(
      `📦 Installing ${workspaceName} packages in: ${workspacePath}`,
    ).start();

    try {
      await runCommand(workspacePath, installCommand);
      spinner.success({ text: `✅ ${workspaceName} packages installed` });
    } catch (err) {
      spinner.error({ text: `❌ Failed to install ${workspaceName} packages` });
      throw err;
    }
  }
}
