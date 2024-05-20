import fs from 'fs';
import { exec } from 'child_process';
import chalk from 'chalk';
import { createSpinner } from 'nanospinner';
import { logs } from './utils.js';

const spinner = createSpinner();
const command = "git clone https://github.com/hassaammgl/client-side-create-my-mern-app.git client && npm i axios react-router-dom react-hot-toast && cd client && npm update @types/react @types/react-dom @vitejs/plugin-react-swc eslint eslint-plugin-react eslint-plugin-react-hooks eslint-plugin-react-refresh vite -S";

const createFolder = async (path) => {
    try {
        await fs.promises.mkdir(path, { recursive: true });
        logs.success("[Created] folder: " + path);
        return true;
    } catch (err) {
        console.error(chalk.redBright(`Error while creating folders: ${err}`));
        logs.error(`Error while creating folders: ${err}`);
        return false;
    }
}


export const initProject = async (data) => {
    const dirname = data.name;
    spinner.start();
    logs.info(`[Creating] folder: ${dirname}`);
    await createFolder(dirname)
    await initializingApi(dirname, data);
    await initializingClient(dirname, data);
    spinner.success({ text: `Project ${data.name} created successfully!` });
    logs.info("Start your project with: cd " + dirname);
    logs.info("run your Server with: cd /server && npm run dev");
    logs.info("run your Client with: cd /client && npm run dev");
    console.log(chalk.italic.greenBright.bgBlue("Happy Hacking!"));
}

const initializingApi = async (path, data) => {
    spinner.start();
    logs.info("initializing Api...");
    if (data.module === "commonjs") {
        logs.info("initializing commonjs api...")
        await Runner(`cd ${path} && git clone https://github.com/hassaammgl/commonjs-server-create-my-mern-app.git server && cd server && rm -r .git && npm i cors express mongoose dotenv && npm update cors express mongoose dotenv -S`)
        logs.success("initialized commonjs api...")
    }
    else {
        logs.info("initializing ESM api...")
        await Runner(`cd ${path} && git clone https://github.com/hassaammgl/ESM-server-create-my-mern-app.git server && cd server && rm -r .git && npm i cors express mongoose dotenv && npm update cors express mongoose dotenv -S`)
        logs.success("initialized ESM api...")
    }
}
const initializingClient = async (path) => {
    logs.info("initializing Client...");
    logs.info("Updating packages....")
    await Runner(`cd ${path} && ${command}`);
    logs.success("UPDATED packages....")
}


const Runner = async (command) => {
    return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
            if (error) {
                reject(error);
            } else {
                resolve({ stdout, stderr });
            }
        });
    });
}