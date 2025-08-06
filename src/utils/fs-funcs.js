import { mkdir } from 'fs/promises';

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
      await mkdir(folderPath, { recursive });
    } catch (err) {
      if (err.code !== 'EEXIST') {
        throw new Error(`❌ Failed to create folder "${folderPath}": ${err.message}`);
      }
      // Folder already exists, safe to ignore
    }
  }
}
