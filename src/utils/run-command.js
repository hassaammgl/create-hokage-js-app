import { exec } from 'child_process';
import util from 'util';

const execPromise = util.promisify(exec);

/**
 * Runs a shell command in the specified directory.
 * @param {string} cwd - Working directory
 * @param {string} command - Full shell command
 */
export async function runCommand(cwd, command) {
  try {
    const { stdout, stderr } = await execPromise(command, { cwd });

    if (stdout) process.stdout.write(stdout);
    if (stderr) process.stderr.write(stderr);
  } catch (err) {
    throw new Error(`Command failed: ${command}\n${err.stderr || err.message}`);
  }
}
