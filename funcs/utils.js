import chalk from 'chalk';

export const logs = {
    success: (message) => {
        console.log(chalk.greenBright.bold(message));
    },
    error: (message) => {
        console.log(chalk.redBright.bold(message));
    },
    info: (message) => {
        console.log(chalk.blueBright.bold(message));
    }
}