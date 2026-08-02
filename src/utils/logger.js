import chalk from 'chalk';

export const success = (message) => console.log(chalk.greenBright(`✔ ${message}`));
export const error = (message) => console.log(chalk.redBright(`✖ ${message}`));
export const info = (message) => console.log(chalk.yellowBright(`ℹ ${message}`));
