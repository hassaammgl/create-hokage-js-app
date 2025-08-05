import { exec } from 'child_process';
import { promisify } from 'util';
const execAsync = promisify(exec);

export async function runCommand(command, path) {
  try {
    const { stdout, stderr } = await execAsync(command, {
      cwd: path,
      shell: process.platform === 'win32' ? 'powershell.exe' : '/bin/bash',
    });
    console.log(stdout);
    if (stderr) console.error(stderr);
  } catch (error) {
    console.error(`Error executing command: ${error.message}`);
    console.error(`Command: ${command}`);
    console.error(`Path: ${path}`);
    throw error;
  }
}
