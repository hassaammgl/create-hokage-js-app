import fs from 'fs-extra';
import path from 'path';
import degit from 'degit';
import { success } from './logger.js';

export class FolderManager {
  /**
   * Ensure a folder exists at the given path.
   * @param {string} folderPath
   */
  async ensureDirectory(folderPath) {
    try {
      await fs.ensureDir(folderPath);
    } catch (err) {
      throw new Error(`Failed to create folder "${folderPath}": ${err.message}`);
    }
  }

  /**
   * Clone a remote template (degit source) into destPath.
   * @param {string} sourcePath - degit source (repo/path#ref)
   * @param {string} destPath
   */
  async copyFrom(sourcePath, destPath) {
    const resolvedDest = path.resolve(destPath);

    try {
      await fs.ensureDir(resolvedDest);
      const emitter = degit(sourcePath, {
        force: true,
        verbose: true,
      });

      await emitter.clone(resolvedDest);
      success(`Copied "${sourcePath}" → "${resolvedDest}"`);
    } catch (err) {
      throw new Error(`Failed to copy template "${sourcePath}" to "${resolvedDest}": ${err.message}`);
    }
  }
}
