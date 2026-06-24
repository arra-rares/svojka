import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Client } from 'basic-ftp';
import { loadEnv } from 'vite';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const websiteRoot = path.resolve(__dirname, '..');
const distDir = path.join(websiteRoot, 'dist');
const logFilePath = path.join(websiteRoot, 'logs', 'deploy-latest.log');

function timestamp() {
  return new Date().toISOString().slice(11, 19);
}

function createLogger() {
  const lines = [];
  const log = (message) => {
    const line = `[${timestamp()}] ${message}`;
    lines.push(line);
    console.log(line);
  };
  return { log, lines };
}

function loadDeployEnv() {
  const env = loadEnv('development', websiteRoot, '');
  Object.assign(process.env, env);
  return env;
}

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

function resolveSecureMode(env) {
  const mode = (env.FTP_SECURE_MODE ?? 'explicit').trim().toLowerCase();
  if (mode === 'false' || mode === 'off' || mode === 'plain') {
    return false;
  }
  if (mode === 'implicit') {
    return 'implicit';
  }
  return true;
}

function appendBuildOutput(log, output) {
  if (!output?.trim()) {
    return;
  }
  for (const line of output.split(/\r?\n/)) {
    if (line.trim()) {
      log(`build | ${line}`);
    }
  }
}

function runBuild(log) {
  const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';
  log(`Running ${npm} run build in ${websiteRoot}`);

  try {
    const output = execSync(`${npm} run build`, {
      cwd: websiteRoot,
      encoding: 'utf8',
      env: process.env,
      shell: process.platform === 'win32',
      maxBuffer: 16 * 1024 * 1024,
    });
    appendBuildOutput(log, output);
    log('Build finished successfully.');
  } catch (error) {
    appendBuildOutput(log, error.stdout?.toString() ?? '');
    appendBuildOutput(log, error.stderr?.toString() ?? '');
    const code = error.status ?? 'unknown';
    throw new Error(`Build failed (exit ${code}). See log above for details.`);
  }
}

function isIpv4Host(host) {
  return /^\d{1,3}(?:\.\d{1,3}){3}$/.test(host);
}

function buildTlsOptions(env, host) {
  const rejectUnauthorized =
    (env.FTP_TLS_REJECT_UNAUTHORIZED ?? 'false').toLowerCase() === 'true';
  const servername = env.FTP_TLS_SERVERNAME?.trim() || (isIpv4Host(host) ? '' : host);

  const secureOptions = {
    rejectUnauthorized,
  };

  if (servername) {
    secureOptions.servername = servername;
  }

  return secureOptions;
}

function formatFtpError(error, host) {
  const message = error instanceof Error ? error.message : 'FTP upload failed.';
  const hints = [];

  if (isIpv4Host(host)) {
    hints.push('Use the FTP hostname from Webhouse SETUP, not the IP address.');
  }
  if (message.includes('certificate') || message.includes('altnames')) {
    hints.push('Set FTP_TLS_REJECT_UNAUTHORIZED=false in .env.local (default for Webhouse).');
    if (isIpv4Host(host)) {
      hints.push('Or set FTP_TLS_SERVERNAME to the hostname shown in Webhouse FTP settings.');
    }
  }

  if (hints.length === 0) {
    return message;
  }

  return `${message} Hint: ${hints.join(' ')}`;
}

async function uploadDist(env, log) {
  const host = requireEnv(env, 'FTP_HOST');
  const user = requireEnv(env, 'FTP_USER');
  const password = requireEnv(env, 'FTP_PASSWORD');
  const remoteDir = requireEnv(env, 'FTP_REMOTE_DIR');
  const secure = resolveSecureMode(env);
  const port = env.FTP_PORT ? Number(env.FTP_PORT) : undefined;
  const tlsOptions = buildTlsOptions(env, host);

  if (!fs.existsSync(distDir)) {
    throw new Error(`Build output missing at ${distDir}`);
  }

  if (isIpv4Host(host)) {
    log('Warning: FTP_HOST is an IP address. Prefer the FTP hostname from Webhouse SETUP.');
  }
  log(
    `TLS verify: ${tlsOptions.rejectUnauthorized ? 'strict' : 'relaxed'}${
      tlsOptions.servername ? `, servername=${tlsOptions.servername}` : ''
    }`,
  );

  const files = collectFiles(distDir);
  log(`Found ${files.length} file(s) in dist/.`);
  log(`Connecting to FTP ${host}${port ? `:${port}` : ''} as ${user} (secure=${String(secure)})`);
  log(`Remote directory: ${remoteDir}`);

  const client = new Client(120_000);
  client.ftp.log = (message) => log(`ftp | ${message}`);

  try {
    await client.access({
      host,
      user,
      password,
      secure,
      port,
      secureOptions: tlsOptions,
    });
    log('FTP connection established.');

    await client.ensureDir(remoteDir);
    log(`Ensured remote directory exists: ${remoteDir}`);

    await client.cd(remoteDir);
    const pwd = await client.pwd();
    log(`Remote working directory: ${pwd}`);

    log('Uploading dist/ contents...');
    await client.uploadFromDir(distDir);
    log(`Upload complete (${files.length} file(s)).`);
  } catch (error) {
    throw new Error(`FTP upload failed: ${formatFtpError(error, host)}`);
  } finally {
    client.close();
  }

  return files.length;
}

function writeLogFile(lines) {
  fs.mkdirSync(path.dirname(logFilePath), { recursive: true });
  fs.writeFileSync(logFilePath, `${lines.join('\n')}\n`, 'utf8');
  return logFilePath;
}

async function main() {
  const { log, lines } = createLogger();
  const env = loadDeployEnv();

  try {
    log('Deploy started.');
    log(`Platform: ${process.platform}`);
    runBuild(log);
    log('Uploading to Webhouse via FTP...');
    const uploadedCount = await uploadDist(env, log);
    log(`Deploy finished successfully (${uploadedCount} file(s) uploaded).`);
    const savedLogPath = writeLogFile(lines);
    log(`Log saved to ${savedLogPath}`);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Deploy failed.';
    log(`ERROR: ${message}`);
    writeLogFile(lines);
    throw error;
  }
}

main().catch((error) => {
  const message = error instanceof Error ? error.message : 'Deploy failed.';
  console.error(message);
  process.exit(1);
});
