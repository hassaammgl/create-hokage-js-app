import path from 'path';
import { createSpinner } from 'nanospinner';
import { FolderManager } from "./utils/fs-funcs.js"
import { runCommand } from './utils/dependency.js';

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
        await this.#installDependencies()
    }

    #setCssPathsAndPackages(projectType) {
        switch (projectType) {
            case '1':
                this.templatePath = 'templates/normalcss/js-template';
                this.clientPackages = `npm i react react-dom && npm i -D @eslint/js @types/react @types/react-dom @vitejs/plugin-react-swc eslint eslint-plugin-react-hooks eslint-plugin-react-refresh globals vite`;
                this.apiPackages = `npm install argon2 colors cookie-parser cors dotenv express express-async-handler joi jsonwebtoken mongoose morgan`;
                break;

            case '2':
                this.templatePath = 'templates/normalcss/ts-template';
                this.clientPackages = `npm install react react-dom && npm install --save-dev @eslint/js @types/react @types/react-dom @vitejs/plugin-react eslint eslint-plugin-react-hooks eslint-plugin-react-refresh globals typescript typescript-eslint vite`;
                this.apiPackages = `npm install argon2 colors cookie-parser cors dotenv express express-async-handler joi jsonwebtoken mongoose morgan && npm install --save-dev @types/argon2 @types/cookie-parser @types/cors @types/express @types/jsonwebtoken @types/morgan @types/node ts-node-dev tsx typescript`;
                break;

            case '3':
                this.templatePath = 'templates/normalcss/js-frontend-ts-backend';
                this.clientPackages = `npm i react react-dom && npm i -D @eslint/js @types/react @types/react-dom @vitejs/plugin-react-swc eslint eslint-plugin-react-hooks eslint-plugin-react-refresh globals vite`;
                this.apiPackages = `npm install argon2 colors cookie-parser cors dotenv express express-async-handler joi jsonwebtoken mongoose morgan && npm install --save-dev @types/argon2 @types/cookie-parser @types/cors @types/express @types/jsonwebtoken @types/morgan @types/node ts-node-dev tsx typescript`;
                break;

            case '4':
                this.templatePath = 'templates/normalcss/ts-frontend-js-backend';
                this.clientPackages = `npm install react react-dom && npm install --save-dev @eslint/js @types/react @types/react-dom @vitejs/plugin-react eslint eslint-plugin-react-hooks eslint-plugin-react-refresh globals typescript typescript-eslint vite`;
                this.apiPackages = `npm install argon2 colors cookie-parser cors dotenv express express-async-handler joi jsonwebtoken mongoose morgan`;
                break;

            default:
                console.log('❌ Invalid template project selected');
        }
    }

    async #copyTemplate() {
        const spinner = createSpinner(`Copying template...`).start();
        try {
            await fm.copyFrom(this.templatePath, this.targetPath)
            spinner.success({ text: `✅ Template copied to "${this.templatePath}"` });
        } catch (error) {
            spinner.error({ text: `❌ Failed to copy template.` });
            throw error;
        }
    }

    async #installDependencies() {
        const clientPath = path.join(this.targetPath, 'client');
        const apiPath = path.join(this.targetPath, 'api');

        console.log(`📦 Installing client packages in: ${clientPath}`);
        await runCommand(clientPath, this.clientPackages);

        console.log(`📦 Installing API packages in: ${apiPath}`);
        await runCommand(apiPath, this.apiPackages);
    }
}
