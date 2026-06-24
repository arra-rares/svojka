import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Client } from 'basic-ftp';
import { loadEnv } from 'vite';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const websiteRoot = path.resolve(__dirname, '..');
const distDir = path.join(websiteRoot, 'dist');

function requireEnv(env, key) {
  const value = env[key]?.trim();
  if (!value) {
    throw new Error(`Missing ${key} in .env.local`);
  }
  return value;
}

function collectFiles(dirPath, baseDir = dirPath) {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      files.push(...collectFiles(fullPath, baseDir));
      continue;
    }
    files.push(path.relative(baseDir, fullPath).split(path.sep).join('/'));
  }

  return files;
}

async function uploadDist(env) {
  const host = requireEnv(env, 'FTP_HOST');
  const user = requireEnv(env, 'FTP_USER');
  const password = requireEnv(env, 'FTP_PASSWORD');
  const remoteDir = requireEnv(env, 'FTP_REMOTE_DIR');
  const secure = (env.FTP_SECURE ?? 'true').toLowerCase() !== 'false';
  const port = env.FTP_PORT ? Number(env.FTP_PORT) : undefined;

  if (!fs.existsSync(distDir)) {
    throw new Error('Build output missing. Run npm run build first.');
  }

  const client = new Client(120_000);
  client.ftp.verbose = false;

  await client.access({
    host,
    user,
    password,
    secure,
    port,
  });

  await client.ensureDir(remoteDir);
  await client.cd(remoteDir);
  await client.uploadFromDir(distDir);

  const fileCount = collectFiles(distDir).length;
  client.close();
  return fileCount;
}

function runBuild() {
  execSync('npm run build', {
    cwd: websiteRoot,
    stdio: 'inherit',
    env: process.env,
  });
}

async function main() {
  const env = loadEnv('development', websiteRoot, '');
  console.log('Building site...');
  runBuild();
  console.log('Uploading to Webhouse via FTP...');
  const uploadedCount = await uploadDist(env);
  console.log(`Upload complete (${uploadedCount} file(s)).`);
}

main().catch((error) => {
  const message = error instanceof Error ? error.message : 'Deploy failed.';
  console.error(message);
  process.exit(1);
});
