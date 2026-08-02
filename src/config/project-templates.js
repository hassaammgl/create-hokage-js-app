import { getStyleStrategy } from './style-strategies.js';

export const PROJECT_TEMPLATE_IDS = Object.freeze({
  JS_FULL: '1',
  TS_FULL: '2',
  JS_FRONTEND_TS_BACKEND: '3',
  TS_FRONTEND_JS_BACKEND: '4',
});

const CLIENT_JS_PACKAGES =
  'npm i react react-dom zod axios react-router && npm i -D @eslint/js @types/react @types/react-dom @vitejs/plugin-react-swc eslint eslint-plugin-react-hooks eslint-plugin-react-refresh globals vite';

const CLIENT_TS_PACKAGES =
  'npm install react react-dom zod axios react-router && npm install --save-dev @eslint/js @types/react @types/react-dom @vitejs/plugin-react eslint eslint-plugin-react-hooks eslint-plugin-react-refresh globals typescript typescript-eslint vite';

const API_JS_PACKAGES =
  'npm install argon2 colors cookie-parser cors dotenv express express-async-handler joi jsonwebtoken mongoose morgan';

const API_TS_PACKAGES =
  `${API_JS_PACKAGES} && npm install --save-dev @types/argon2 @types/cookie-parser @types/cors @types/express @types/jsonwebtoken @types/morgan @types/node ts-node-dev tsx typescript`;

const TEMPLATE_DEFINITIONS = Object.freeze({
  [PROJECT_TEMPLATE_IDS.JS_FULL]: {
    folder: 'js-template',
    clientPackages: CLIENT_JS_PACKAGES,
    apiPackages: API_JS_PACKAGES,
  },
  [PROJECT_TEMPLATE_IDS.TS_FULL]: {
    folder: 'ts-template',
    clientPackages: CLIENT_TS_PACKAGES,
    apiPackages: API_TS_PACKAGES,
  },
  [PROJECT_TEMPLATE_IDS.JS_FRONTEND_TS_BACKEND]: {
    folder: 'js-frontend-ts-backend',
    clientPackages: CLIENT_JS_PACKAGES,
    apiPackages: API_TS_PACKAGES,
  },
  [PROJECT_TEMPLATE_IDS.TS_FRONTEND_JS_BACKEND]: {
    folder: 'ts-frontend-js-backend',
    clientPackages: CLIENT_TS_PACKAGES,
    apiPackages: API_JS_PACKAGES,
  },
});

const TEMPLATE_REPO_PREFIX = 'hassaammgl/create-hokage-js-app/templates';

/**
 * Resolve scaffold paths and install commands for a template + style pair.
 * @param {string} templateId
 * @param {string} styleId
 */
export function resolveProjectTemplate(templateId, styleId) {
  const definition = TEMPLATE_DEFINITIONS[templateId];
  if (!definition) {
    throw new Error(`Invalid project template selected: "${templateId}"`);
  }

  const style = getStyleStrategy(styleId);

  return {
    templatePath: `${TEMPLATE_REPO_PREFIX}/${style.directory}/${definition.folder}#main`,
    clientPackages: `${definition.clientPackages}${style.extraClientInstallSuffix}`,
    apiPackages: definition.apiPackages,
  };
}
