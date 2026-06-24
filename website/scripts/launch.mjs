import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const websiteRoot = path.resolve(__dirname, '..');
const adminUrl = 'http://127.0.0.1:5173/manage-events-9xk2';
const healthUrl = 'http://127.0.0.1:5173/';

async function waitForServer(maxAttempts = 80) {
  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    try {
      const response = await fetch(healthUrl);
      if (response.ok) {
        return;
      }
    } catch {
      // Server not ready yet.
    }
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  throw new Error('Dev server did not start in time.');
}

function openBrowser(url) {
  if (process.platform === 'win32') {
    const browserCandidates = [
      process.env['ProgramFiles'] + '\\Google\\Chrome\\Application\\chrome.exe',
      process.env['ProgramFiles(x86)'] + '\\Google\\Chrome\\Application\\chrome.exe',
      process.env['ProgramFiles'] + '\\Mozilla Firefox\\firefox.exe',
      process.env['ProgramFiles(x86)'] + '\\Mozilla Firefox\\firefox.exe',
    ].filter((candidate) => candidate && fs.existsSync(candidate));

    if (browserCandidates.length > 0) {
      spawn(browserCandidates[0], [url], { detached: true, stdio: 'ignore' }).unref();
      return;
    }

    spawn('cmd', ['/c', 'start', '', url], { detached: true, stdio: 'ignore' }).unref();
    return;
  }

  if (process.platform === 'darwin') {
    spawn('open', [url], { detached: true, stdio: 'ignore' }).unref();
    return;
  }

  spawn('xdg-open', [url], { detached: true, stdio: 'ignore' }).unref();
}

function startDevServer() {
  const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm';
  const child = spawn(npmCommand, ['run', 'dev'], {
    cwd: websiteRoot,
    stdio: 'inherit',
    env: process.env,
    shell: process.platform === 'win32',
  });

  child.on('exit', (code) => {
    process.exit(code ?? 0);
  });
}

async function main() {
  console.log('Starting ARRA site manager...');
  startDevServer();
  await waitForServer();
  console.log(`Opening admin page: ${adminUrl}`);
  openBrowser(adminUrl);
}

main().catch((error) => {
  const message = error instanceof Error ? error.message : 'Launch failed.';
  console.error(message);
  process.exit(1);
});
