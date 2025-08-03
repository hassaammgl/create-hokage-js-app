// utils/indexjs

import fs from 'fs';
import path from 'path';

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


