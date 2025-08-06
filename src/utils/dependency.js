
import { exec } from 'child_process';
import { promisify } from 'util';
const execAsync = promisify(exec);

/**
 * Executes a shell command in a given directory.
 *
 * @param {string} command - The shell command to run (e.g., 'npm install').
 * @param {string} cwd - The directory to run the command in.
 * @param {object} options - Optional config.
 * @param {boolean} options.silent - Suppress stdout logs (default: false).
 * @returns {Promise<{ stdout: string, stderr: string }>}
 */
export async function runCommand(command, cwd, options = {}) {
  const { silent = false } = options;

  try {
    const { stdout, stderr } = await execAsync(command, {
      cwd,
      shell: process.platform === 'win32' ? 'cmd.exe' : '/bin/bash',
    });

    if (!silent && stdout) console.log(stdout.trim());
    if (!silent && stderr) console.error(stderr.trim());

    return { stdout, stderr };
  } catch (error) {
    console.error(`❌ Failed to run command: ${command}`);
    console.error(`📍 Working dir: ${cwd}`);
    console.error(`🐞 Error: ${error.message}`);
    throw error;
  }
}
