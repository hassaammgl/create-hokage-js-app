// main.js

import init from "./init.js";
import { input, select } from '@inquirer/prompts';

export default async function main() {
    // Get all arguments after node and script path
    const args = process.argv.slice(2);
    let targetPath;

    // If no path was provided via command line
    if (args.length === 0) {
        console.log('No path provided - starting interactive setup...');
        
        const setupOption = await select({
            message: 'How would you like to proceed?',
            choices: [
                {
                    name: 'Use current directory (.)',
                    value: 'current',
                    description: 'Initialize project in current directory'
                },
                {
                    name: 'Create new project directory',
                    value: 'new',
                    description: 'Create a new directory for your project'
                }
            ]
        });

        if (setupOption === 'new') {
            const projectName = await input({ 
                message: 'Enter your project name:',
                validate: (value) => value.trim() ? true : 'Project name cannot be empty'
            });
            targetPath = `./${projectName}`;
        } else {
            targetPath = '.';
        }
    } else {
        // Use the provided path (last argument)
        targetPath = args.pop();
    }

    console.log(`Initializing project at: ${targetPath}`);
    await init(targetPath);
}