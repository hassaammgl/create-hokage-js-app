import fs from 'fs-extra';
import path from 'path';
import degit from 'degit';

export class FolderManager {
  /**
   * Create a folder at the specified path.
   *
   * @param {string} folderPath - The folder path to create.
   * @param {boolean} recursive - Whether to create nested folders (default: true).
   * @returns {Promise<void>}
   */
  async create(folderPath, recursive = true) {
    try {
      await fs.ensureDir(folderPath);
    } catch (err) {
      throw new Error(`❌ Failed to create folder "${folderPath}": ${err.message}`);
    }
  }

  /**
   * Copy all contents from one folder to another.
   *
   * @param {string} sourcePath - Path to the source folder (relative or absolute).
   * @param {string} destPath - Path to the destination folder (relative or absolute).
   * @returns {Promise<void>}
   */
  async copyFrom(sourcePath, destPath) {
    const resolvedDest = path.resolve(destPath);

    try {
      await fs.ensureDir(resolvedDest);
      const emitter = degit(sourcePath, {
        force: true,
        verbose: true
      });

      // Wait for the clone to complete
      await emitter.clone(resolvedDest);
      console.log(`✅ Copied "${sourcePath}" → "${resolvedDest}"`);
    } catch (err) {
      console.error(`❌ Failed to copy folders: ${err.message}`);
      throw err;
    }

  }
}
