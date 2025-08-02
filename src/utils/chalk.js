import chalk from "chalk";

export const success = (msg) => console.log(chalk.bgBlack(chalk.greenBright(msg)))
export const error = (msg) => console.log(chalk.bgBlack(chalk.redBright(msg)))
export const info = (msg) => console.log(chalk.bgBlack(chalk.yellowBright(msg)))
