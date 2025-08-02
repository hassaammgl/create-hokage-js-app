import { createFolder } from "./utils/index.js"
import { createSpinner } from 'nanospinner'
import { success, error } from "./utils/chalk.js";

export default async function init(inputPath) {
    const targetPath = inputPath === '.' ? process.cwd() : inputPath;
    console.log(targetPath);

    if (inputPath !== '.') {
        try {
            const spinner = createSpinner('creating directories ...').start()
            await createFolder(targetPath)
            success(`\n Created main directory: ${targetPath}`);
            try {
                const folder1 = `${targetPath}/client`;
                const folder2 = `${targetPath}/api`;
                await createFolder(folder1);
                await createFolder(folder2);
                success(`\n Created subdirectories: ${folder1} and ${folder2} in ${targetPath}`);
                spinner.success()
            } catch (err) {
                console.error(`Error creating subdirectories: ${err}`);
            }
        } catch (err) {
            error(`Error creating main directory: ${err}`);
            return;
        }
    } else {
        const spinner = createSpinner('creating directories ...').start()
        const folder1 = `${targetPath}/client`;
        const folder2 = `${targetPath}/api`;
        try {
            await createFolder(folder1);
            await createFolder(folder2);
            success(`\n Created subdirectories: ${folder1} and ${folder2} in ${targetPath}`);
            spinner.success()
        } catch (err) {
            error(`Error creating subdirectories: ${err}`);
        }
    }
}