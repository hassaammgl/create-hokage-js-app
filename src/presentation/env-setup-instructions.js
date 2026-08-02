import path from 'path';
import chalk from 'chalk';

const API_ENV_EXAMPLE = `PORT=5000
NODE_ENV=development
MONGO_URI=
JWT_SECRET=
JWT_REFRESH_SECRET=
FRONTEND_URL=http://localhost:5173
`;

const CLIENT_ENV_EXAMPLE = `VITE_API_URL=http://localhost:5000
`;

/**
 * Print post-scaffold .env setup guidance for client and API.
 * @param {string} targetPath
 */
export function printEnvSetupInstructions(targetPath) {
  const clientEnvPath = path.join(targetPath, 'client', '.env');
  const apiEnvPath = path.join(targetPath, 'api', '.env');

  console.log(chalk.green.bold('\n📦 Project created successfully!'));
  console.log(chalk.cyan('🛠️  Before starting, please create environment files:'));

  console.log(`\n➡ ${chalk.yellow('Client env:')} ${clientEnvPath}`);
  console.log(`➡ ${chalk.yellow('API env:')} ${apiEnvPath}`);

  console.log(chalk.magenta('\nExample API .env:'));
  console.log(chalk.gray('-----------------'));
  console.log(API_ENV_EXAMPLE);

  console.log(chalk.magenta('Example Client .env:'));
  console.log(chalk.gray('--------------------'));
  console.log(CLIENT_ENV_EXAMPLE);

  console.log(chalk.blue("\n🚀 Once done, you're ready to run your dev servers. Happy coding!"));
}
