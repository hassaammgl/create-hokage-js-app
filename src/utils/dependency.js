
/**
 * Executes a shell command in a given directory.
 *
 * @param {string} command - The shell command to run (e.g., 'npm install').
 * @param {string} cwd - The directory to run the command in.
 * @param {object} options - Optional config.
 * @param {boolean} options.silent - Suppress stdout logs (default: false).
 * @returns {Promise<{ stdout: string, stderr: string }>}
 */

import { exec } from 'child_process';
import util from 'util';

const execPromise = util.promisify(exec);

/**
 * Runs a shell command in the specified directory.
 * @param {string} cwd - The working directory.
 * @param {string} command - The full command to run.
 */
export async function runCommand(cwd, command) {
  try {
    const { stdout, stderr } = await execPromise(command, { cwd });

    if (stdout) process.stdout.write(stdout);
    if (stderr) process.stderr.write(stderr);
  } catch (err) {
    throw new Error(`❌ Command failed: ${command}\n${err.stderr || err.message}`);
  }
}
