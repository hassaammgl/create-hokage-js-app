#!/usr/bin/env node

import gradient from "gradient-string";
import inquirer from "inquirer";
import figlet from "figlet";
import { createSpinner } from "nanospinner";
import { initProject } from './funcs/functions.js'

const spinner = createSpinner();

await figlet("c-m-m-a", function (err, data) {
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
                if (value === ".") {
                    const dirname = process.cwd().split('/').reverse()[0].toLowerCase().replace(/ /g, '-');
                    console.log(dirname);
                    return dirname;
                } else if (value === "") {
                    return false;
                } else {
                    return true;
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

    await initProject({ name, description, author, module });
   
}

await Start();