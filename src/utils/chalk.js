// chalk.js
import chalk from "chalk";

export const success = (msg) => console.log(chalk.greenBright("✔ " + msg));
export const error = (msg) => console.log(chalk.redBright("✖ " + msg));
export const info = (msg) => console.log(chalk.yellowBright("ℹ " + msg));
