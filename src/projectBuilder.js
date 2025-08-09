import path from 'path';
import { createSpinner } from 'nanospinner';
import { FolderManager } from "./utils/fs-funcs.js"
import { runCommand } from './utils/dependency.js';
import { info } from "../src/utils/chalk.js"
import chalk from 'chalk';

const fm = new FolderManager()

export class ProjectBuilder {
    constructor(projectStyle, projectTemp, targetPath) {
        this.targetPath = targetPath
        this.projectStyle = projectStyle
        this.projectTemp = projectTemp
        this.templatePath = "";
        this.clientPackages = "";
        this.apiPackages = ""
    }

    async init() {
        this.#setCssPathsAndPackages(this.projectTemp)
        await this.#copyTemplate()
        await this.installDependencies()
        this.#tellAboutEnvs()
    }

    #setCssPathsAndPackages(projectType) {
        switch (projectType) {
            case '1':
                this.templatePath = 'hassaammgl/create-hokage-js-app/templates/normalcss/js-template#main';
                this.clientPackages = `npm i react react-dom zod axios react-router && npm i -D @eslint/js @types/react @types/react-dom @vitejs/plugin-react-swc eslint eslint-plugin-react-hooks eslint-plugin-react-refresh globals vite`;
                this.apiPackages = `npm install argon2 colors cookie-parser cors dotenv express express-async-handler joi jsonwebtoken mongoose morgan`;
                break;

            case '2':
                this.templatePath = 'hassaammgl/create-hokage-js-app/templates/normalcss/ts-template#main';
                this.clientPackages = `npm install react react-dom zod axios react-router && npm install --save-dev @eslint/js @types/react @types/react-dom @vitejs/plugin-react eslint eslint-plugin-react-hooks eslint-plugin-react-refresh globals typescript typescript-eslint vite`;
                this.apiPackages = `npm install argon2 colors cookie-parser cors dotenv express express-async-handler joi jsonwebtoken mongoose morgan && npm install --save-dev @types/argon2 @types/cookie-parser @types/cors @types/express @types/jsonwebtoken @types/morgan @types/node ts-node-dev tsx typescript`;
                break;

            case '3':
                this.templatePath = 'hassaammgl/create-hokage-js-app/templates/normalcss/js-frontend-ts-backend#main';
                this.clientPackages = `npm i react react-dom zod axios react-router && npm i -D @eslint/js @types/react @types/react-dom @vitejs/plugin-react-swc eslint eslint-plugin-react-hooks eslint-plugin-react-refresh globals vite`;
                this.apiPackages = `npm install argon2 colors cookie-parser cors dotenv express express-async-handler joi jsonwebtoken mongoose morgan && npm install --save-dev @types/argon2 @types/cookie-parser @types/cors @types/express @types/jsonwebtoken @types/morgan @types/node ts-node-dev tsx typescript`;
                break;

            case '4':
                this.templatePath = 'hassaammgl/create-hokage-js-app/templates/normalcss/ts-frontend-js-backend#main';
                this.clientPackages = `npm install react react-dom zod axios react-router && npm install --save-dev @eslint/js @types/react @types/react-dom @vitejs/plugin-react eslint eslint-plugin-react-hooks eslint-plugin-react-refresh globals typescript typescript-eslint vite`;
                this.apiPackages = `npm install argon2 colors cookie-parser cors dotenv express express-async-handler joi jsonwebtoken mongoose morgan`;
                break;

            default:
                console.log('❌ Invalid template project selected');
        }
    }

    async #copyTemplate() {
        const spinner = createSpinner(`Copying template...`).start();
        try {
            console.log(this.templatePath, this.targetPath);

            await fm.copyFrom(this.templatePath, this.targetPath)
            spinner.success({ text: `✅ Template copied to "${this.templatePath}"` });
        } catch (error) {
            spinner.error({ text: `❌ Failed to copy template.` });
            throw error;
        }
    }


    async #tellAboutEnvs() {
        const clientEnvPath = path.join(this.targetPath, "client", ".env");
        const apiEnvPath = path.join(this.targetPath, "api", ".env");

        console.log(chalk.green.bold("\n📦 Project created successfully!"));
        console.log(chalk.cyan("🛠️  Before starting, please create environment files:"));

        console.log(`\n➡ ${chalk.yellow("Client env:")} ${clientEnvPath}`);
        console.log(`➡ ${chalk.yellow("API env:")} ${apiEnvPath}`);

        const apiExample = `PORT=5000
NODE_ENV=development
MONGO_URI=
JWT_SECRET=
JWT_REFRESH_SECRET=
FRONTEND_URL=http://localhost:5173
`;

        const clientExample = `VITE_API_URL=http://localhost:5000
`;

        console.log(chalk.magenta("\nExample API .env:"));
        console.log(chalk.gray("-----------------"));
        console.log(apiExample);

        console.log(chalk.magenta("Example Client .env:"));
        console.log(chalk.gray("--------------------"));
        console.log(clientExample);

        console.log(chalk.blue("\n🚀 Once done, you're ready to run your dev servers. Happy coding!"));
    }

    async installDependencies() {
        const clientPath = path.join(this.targetPath, 'client');
        const apiPath = path.join(this.targetPath, 'api');
        const spinner = createSpinner(`📦 Installing Client packages in: ${clientPath}`).start()
        await runCommand(clientPath, this.clientPackages);
        spinner.stop()
        const spinner1 = createSpinner(`📦 Installing API packages in: ${apiPath}`).start()
        await runCommand(apiPath, this.apiPackages);
        spinner1.stop()
    }
}
