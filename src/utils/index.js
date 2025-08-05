import path from 'path';
import fs from 'fs-extra';

export async function copyAllFromFolder(sourcePath, destPath) {
  try {
    const projectRoot = process.cwd();
    const resolvedSource = path.join(projectRoot, sourcePath);
    const resolvedDest = path.join(projectRoot, destPath);

    if (!(await fs.pathExists(resolvedSource))) {
      throw new Error(`Source folder "${sourcePath}" not found in project.`);
    }

    await fs.ensureDir(resolvedDest);

    await fs.copy(resolvedSource, resolvedDest, {
      overwrite: true,
      errorOnExist: false,
      recursive: true,
    });

    console.log(`✅ Copied ${sourcePath} → ${destPath}`);
  } catch (err) {
    console.error(`❌ Failed to copy: ${err.message}`);
    throw err;
  }
}

export function createFolder(folderPath, recursive = true) {
  return new Promise((resolve, reject) => {
    fs.mkdir(folderPath, { recursive }, (err) => {
      if (err) {
        if (err.code === 'EEXIST') {
          return resolve();
        }
        return reject(new Error(`Failed to create folder: ${err.message}`));
      }
      resolve();
    });
  });
}
