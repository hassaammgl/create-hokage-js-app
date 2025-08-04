import { execa } from 'execa';
import chalk from 'chalk';

export async function installDeps(deps, options = { dev: false, useBun: false }) {
    const packageManager = options.useBun ? 'bun' : 'npm';
    const flag = options.dev
        ? options.useBun
            ? '--dev'
            : '--save-dev'
        : '';

    const depsString = deps.join(' ');
    const command = options.useBun
        ? ['add', flag, ...deps]
        : ['install', flag, ...deps];

    console.log(chalk.cyan(`📦 Installing: ${depsString}`));
    console.log(chalk.gray(`> ${packageManager} ${command.join(' ')}`));

    try {
        await execa(packageManager, command.filter(Boolean), { stdio: 'inherit' });
        console.log(chalk.green('✅ Dependencies installed successfully!'));
    } catch (err) {
        console.error(chalk.red('❌ Failed to install dependencies.'));
        console.error(err);
        process.exit(1);
    }
}


export const depsPerProject = {
    css: {
        1: {
            client: {
                main: [
                    "react",
                    "react-dom"
                ],
                dev: [
                    "@eslint/js",
                    "@types/react",
                    "@types/react-dom",
                    "@vitejs/plugin-react-swc",
                    "eslint",
                    "eslint-plugin-react-hooks",
                    "eslint-plugin-react-refresh",
                    "globals",
                    "vite"
                ]
            },
            api: {
                main: [
                    "argon2",
                    "colors",
                    "cookie-parser",
                    "cors",
                    "dotenv",
                    "express",
                    "express-async-handler",
                    "express-rate-limit",
                    "joi",
                    "jsonwebtoken",
                    "mongoose",
                    "morgan"
                ],
                dev: []
            }
        },
        2: {
            client: {
                main: [],
                dev: []
            },
            api: {
                main: [],
                dev: []
            }
        },
        3: {
            client: {
                main: [],
                dev: []
            },
            api: {
                main: [],
                dev: []
            }
        },
        4: {
            client: {
                main: [],
                dev: []
            },
            api: {
                main: [],
                dev: []
            }
        },
    }
}