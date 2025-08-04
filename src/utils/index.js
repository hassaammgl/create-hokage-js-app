// utils/indexjs
import path from 'path';
import fs from 'fs-extra'

export async function copyAllFromFolder(sourcePath, destPath) {
  try {
    const resolvedSource = path.resolve(sourcePath)
    const resolvedDest = path.resolve(destPath)

    const exists = await fs.pathExists(resolvedSource)
    if (!exists) {
      throw new Error(`Source folder "${resolvedSource}" does not exist.`)
    }

    await fs.copy(resolvedSource, resolvedDest, {
      overwrite: true,
      errorOnExist: false,
    })

    console.log(`📁 All files & folders copied from "${resolvedSource}" to "${resolvedDest}"`)
  } catch (err) {
    console.error(`❌ Error copying folder: ${err.message}`)
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


