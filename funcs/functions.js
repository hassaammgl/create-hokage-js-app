import fs from 'fs';
import { exec } from 'child_process';
import { pjsonTemp } from './pjsonTemp.js';
import path from 'path';
import chalk from 'chalk';
import { createSpinner } from 'nanospinner';

const spinner = createSpinner();

const createFolder = async (path) => {
    try {
        await fs.promises.mkdir(path, { recursive: true });
        console.log(chalk.greenBright(`[Created] folder: ${path}.`));
        return true;
    } catch (err) {
        console.error(chalk.redBright(`Error while creating folders: ${err}`));
        return false;
    }
}

const createFile = async (path, data) => {
    try {
        await fs.promises.unlink(path); // Remove the existing file if it exists
    } catch (err) {
        if (err.code !== 'ENOENT') { // Check if the error is not due to file not found
            console.error(chalk.redBright(`Error while deleting file: ${err}`));
            return false;
        }
    }

    try {
        await fs.promises.writeFile(path, JSON.stringify(data)); // Write the new file
        return true;
    } catch (err) {
        console.error(chalk.redBright(`Error while creating file: ${err}`));
        return false;
    }
}
// const createFile2 = async (path, data) => {
//     try {
//         await fs.promises.writeFile(path, data);
//         return true;
//     } catch (err) {
//         console.error(chalk.redBright(`Error while creating file: ${err}`));
//         return false;
//     }
// }

export const createFolders = async (data) => {
    const dirname = process.cwd().split('/').reverse()[0].toLowerCase().replace(/ /g, '-');
    console.log(dirname);
    const apiPath = `${dirname}/api`;
    const clientPath = `${dirname}/client`;

    await Promise.all([
        createFolder(apiPath),
        createFolder(clientPath)
    ]);

    await initializingApi(apiPath, data);
    await initializingClient(clientPath, data);

    console.log(chalk.greenBright(`[Created] folders: ${apiPath} and ${clientPath}`));
}

const initializingApi = async (path, data) => {
    spinner.start();
    console.log(chalk.yellowBright.bold("initializing api..."));
    if (data.module === "commonjs") {
        copyFolder("./temps/commonjs", path, async (copiedFile) => {
            console.log(`[Created File] file: ${copiedFile}`);
            if (`${path}/package.json`) {
                await createFile(`${path}/package.json`, pjsonTemp(data));
            }
        })
            .then(() => {
                console.log('Folder copied successfully!');
            })
            .catch((err) => {
                console.error('Error copying folder:', err);
            });
    }
    else {
        copyFolder("./temps/ESM", path, (copiedFile) => {
            console.log(`[Created File] file: ${copiedFile}`);
        })
            .then(() => {
                console.log('Folder copied successfully!');
            })
            .catch((err) => {
                console.error('Error copying folder:', err);
            });
    }

    spinner.success({ text: "Created Api Successfully..." });



    await exec(`cd ${path} && npm i cors express mongoose dotenv && npm update cors express mongoose dotenv -S`, (error, stdout, stderr) => {
        spinner.start();
        console.log(chalk.yellowBright.bold("Updating packages...."))
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
        }
        else {
            console.log(`${stdout}`);
            spinner.success({ text: "Updating Packages Successfully..." })

        }
    })
}
const initializingClient = async (path) => {
    spinner.start();
    console.log(chalk.yellowBright.bold("initializing Client..."));

    await copyFolder("./temps/client", path, async (copiedFile) => {
        console.log(`[Created File] file: ${copiedFile}`);

    })
        .then(() => {
            console.log('Folder copied successfully!');
        })
        .catch((err) => {
            console.error('Error copying folder:', err);
        });

        spinner.start();
        console.log(chalk.yellowBright.bold("Installing packages...."))
        await exec(`cd ${path} && npm i axios react-router-dom react-hot-toast`, (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
        }
        else {
            console.log(`${stdout}`);
            spinner.success({ text: "Installing Packages Successfully..." })
            
        }
    })
    spinner.start();
    console.log(chalk.yellowBright.bold("Updating packages...."))
    await exec(`cd ${path} && npm update @types/react @types/react-dom @vitejs/plugin-react-swc eslint eslint-plugin-react eslint-plugin-react-hooks eslint-plugin-react-refresh vite -S`, (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
        }
        else {
            console.log(`${stdout}`);
            spinner.success({ text: "Updating Packages Successfully..." })
            
        }
    })
   
}

async function copyFolder(source, destination, onProgress) {
    await fs.promises.mkdir(destination, { recursive: true }).catch((err) => {
        if (err.code !== 'EEXIST') {
            throw err; // Re-throw for unexpected errors
        }
    });

    const entries = await fs.promises.readdir(source);

    for (const entry of entries) {
        const sourcePath = path.join(source, entry);
        const destPath = path.join(destination, entry);

        const stats = await fs.promises.stat(sourcePath);

        if (stats.isDirectory()) {
            await copyFolder(sourcePath, destPath, onProgress);
        } else {
            const readStream = fs.createReadStream(sourcePath);
            const writeStream = fs.createWriteStream(destPath);

            readStream.on('error', (err) => {
                console.error(`Error reading file: ${sourcePath}`, err);
            });

            writeStream.on('error', (err) => {
                console.error(`Error writing file: ${destPath}`, err);
            });

            writeStream.on('finish', () => {
                if (onProgress) {
                    onProgress(destPath); // Report progress for each copied file (optional)
                }
            });

            readStream.pipe(writeStream);
        }
    }
}