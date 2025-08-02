import {createFolder} from "./utils/index.js"

export default async function main() {
    const inputPath = process.argv.pop();
    const targetPath = inputPath === '.' ? process.cwd() : inputPath;
    
    if (inputPath !== '.') {
        try {
            await createFolder(targetPath)
            console.log(`Created main directory: ${targetPath}`);
        } catch (err) {
            console.error(`Error creating main directory: ${err}`);
            return;
        }
    }
    const folder1 = 'client';
    const folder2 = 'api';
    
    try {
        fs.mkdirSync(path.join(targetPath, folder1), { recursive: true });
        fs.mkdirSync(path.join(targetPath, folder2), { recursive: true });
        console.log(`Created subdirectories: ${folder1} and ${folder2} in ${targetPath}`);
    } catch (err) {
        console.error(`Error creating subdirectories: ${err}`);
    }
}
