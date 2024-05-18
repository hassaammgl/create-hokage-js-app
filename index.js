#!/usr/bin/env node

import chalk from "chalk";
import chalkAnimation from "chalk-animation";
import gradient from "gradient-string";
import inquirer from "inquirer";
import figlet from "figlet";
import { createSpinner } from "nanospinner";
import { createFolders } from './funcs/functions.js'


await figlet("create-my-mern-app", function (err, data) {
    if (err) {
        console.log("Something went wrong...");
        console.dir(err);
        return;
    }
    console.log(gradient.pastel.multiline(data));
    console.log(" ");
})


const Start = async () => {
    const { name, description, author, module } = await inquirer.prompt([
        {
            type: "input",
            name: "name",
            message: "What is the name of the project?",
            validate: function (value) {
                const validationRegex = /^[a-zA-Z\s]+$/;
                if (value.trim() === ".") {
                    const dirname = process.cwd().split('/').reverse()[0].toLowerCase().replace(/ /g, '-');
                    console.log(dirname);
                    return dirname;
                } else if (validationRegex.test(value)) {
                    return true;
                } else {
                    return 'Please enter a valid project name. Spaces are not allowed, use "-" instead';
                }
            },
            default: () => {
                return "mernapp"
            }
        },
        {
            type: "input",
            name: "description",
            message: "Enter the description of the project?",
            default: () => {
                return "this is a mernapp"
            }
        },
        {
            type: "input",
            name: "author",
            message: "Enter the author name of the project?",
            default: () => {
                return "good-author"
            }
        },
        {
            type: "rawlist",
            name: "module",
            message: "Enter the module type for the project? (default: commonjs) ",
            choices: [
                "ESM",
                "commonjs"
            ],
            default: () => {
                return "commonjs"
            }
        },
    ]);

    console.log(`Creating project ${name}...`);
    const spinner = createSpinner();
    spinner.start();
    console.log(chalk.greenBright(`Initializing project ${name}!`));
    await createFolders({ name, description, author, module });
    console.log(chalk.greenBright(`Creating folders for project ${name}!`));
    // console.clear();
    spinner.start();
    console.log(chalk.greenBright(`Initializing project ${name}!`));
    spinner.success({ text: `Project ${name} created successfully!` });

}

await Start();