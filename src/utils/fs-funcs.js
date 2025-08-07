import fs from 'fs-extra';
import path from 'path';

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
      await fs.ensureDir(folderPath); // Automatically recursive
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
    const resolvedSource = path.resolve(sourcePath);
    const resolvedDest = path.resolve(destPath);
    // console.log("resolved Source: ", resolvedSource);
    // console.log("resolved Dest: ", resolvedDest);

    try {
      const exists = await fs.pathExists(resolvedSource);
      if (!exists) {
        throw new Error(`❌ Source folder not found: ${resolvedSource}`);
      }

      await fs.ensureDir(resolvedDest);

      await fs.copy(resolvedSource, resolvedDest, {
        overwrite: true,
        errorOnExist: false,
      });

      console.log(`✅ Copied "${resolvedSource}" → "${resolvedDest}"`);
    } catch (err) {
      console.error(`❌ Failed to copy folders: ${err.message}`);
      throw err;
    }
    // try {
    //   const exists = await fs.pathExists(sourcePath);
    //   if (!exists) {
    //     throw new Error(`❌ Source folder not found: ${sourcePath}`);
    //   }

    //   await fs.ensureDir(destPath);

    //   await fs.copy(sourcePath, destPath, {
    //     overwrite: true,
    //     errorOnExist: false,
    //   });

    //   console.log(`✅ Copied "${sourcePath}" → "${destPath}"`);
    // } catch (err) {
    //   console.error(`❌ Failed to copy folders: ${err.message}`);
    //   throw err;
    // }
  }
}
