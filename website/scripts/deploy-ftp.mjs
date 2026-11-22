import { execSync } from 'child_process';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { fileURLToPath } from 'url';
import { Client } from 'basic-ftp';
import { loadEnv } from 'vite';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const websiteRoot = path.resolve(__dirname, '..');
const distDir = path.join(websiteRoot, 'dist');
const logFilePath = path.join(websiteRoot, 'logs', 'deploy-latest.log');
const REMOTE_GALLERY_BACKUP_DIR = 'data/backups';
const REMOTE_GALLERY_BACKUP_KEEP = 5;
const GALLERY_EVENTS_REMOTE = 'data/gallery-events.json';
const GALLERY_ACCESS_REMOTE = 'data/gallery-access.json';
const BACKUP_DENY_HTACCESS = path.join(
  websiteRoot,
  'public/data/backups/.htaccess',
);

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
  const mode = (env.FTP_SECURE_MODE ?? 'plain').trim().toLowerCase();
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

function validateFtpCredentials(env, log) {
  const user = requireEnv(env, 'FTP_USER');
  const password = requireEnv(env, 'FTP_PASSWORD');

  if (password.includes('FTP_') || password.includes('REMOTE_DIR')) {
    throw new Error(
      'FTP_PASSWORD looks malformed — it may include the next .env line. Put FTP_PASSWORD and FTP_REMOTE_DIR on separate lines.',
    );
  }

  log(`FTP user: ${user}`);
  log(`FTP password length: ${password.length} character(s)`);

  return { user, password };
}

function formatFtpError(error, host) {
  const message = error instanceof Error ? error.message : 'FTP upload failed.';
  const hints = [];

  if (message.includes('530') || message.toLowerCase().includes('login incorrect')) {
    hints.push('Wrong FTP_USER or FTP_PASSWORD — copy exactly from Total Commander / Webhouse SETUP.');
    hints.push('Check .env.local: one variable per line, no spaces around =, quote passwords with special chars.');
  } else if (message.includes('certificate') || message.includes('altnames')) {
    hints.push('Use plain FTP: FTP_SECURE_MODE=plain (same as Total Commander without TLS).');
  } else if (isIpv4Host(host)) {
    hints.push('If connection fails, try the FTP hostname from Webhouse SETUP instead of the IP.');
  }

  if (hints.length === 0) {
    return message;
  }

  return `${message} Hint: ${hints.join(' ')}`;
}

async function uploadDist(env, log) {
  const host = requireEnv(env, 'FTP_HOST');
  const { user, password } = validateFtpCredentials(env, log);
  const remoteDir = requireEnv(env, 'FTP_REMOTE_DIR');
  const secure = resolveSecureMode(env);
  const port = env.FTP_PORT ? Number(env.FTP_PORT) : undefined;

  if (!fs.existsSync(distDir)) {
    throw new Error(`Build output missing at ${distDir}`);
  }

  if (isIpv4Host(host)) {
    log('Warning: FTP_HOST is an IP address. Prefer the FTP hostname from Webhouse SETUP.');
  }
  if (secure) {
    const tlsOptions = buildTlsOptions(env, host);
    log(
      `TLS verify: ${tlsOptions.rejectUnauthorized ? 'strict' : 'relaxed'}${
        tlsOptions.servername ? `, servername=${tlsOptions.servername}` : ''
      }`,
    );
  } else {
    log('Using plain FTP (no TLS), port 21 — same as Total Commander default.');
  }

  const files = collectFiles(distDir);
  log(`Found ${files.length} file(s) in dist/.`);
  log(`Connecting to FTP ${host}${port ? `:${port}` : ''} as ${user} (secure=${String(secure)})`);
  log(`Remote directory: ${remoteDir}`);

  const client = new Client(120_000);
  client.ftp.log = (message) => log(`ftp | ${message}`);

  const accessOptions = {
    host,
    user,
    password,
    secure,
    port,
  };
  if (secure) {
    accessOptions.secureOptions = buildTlsOptions(env, host);
  }

  try {
    await client.access(accessOptions);
    log('FTP connection established.');

    await client.ensureDir(remoteDir);
    log(`Ensured remote directory exists: ${remoteDir}`);

    await client.cd(remoteDir);
    const siteRoot = await client.pwd();
    log(`Remote working directory: ${siteRoot}`);

    // ensureDir() changes the FTP working directory. Always return to the site root
    // afterwards, otherwise the upload lands inside data/backups/ and the live gallery
    // JSON is never replaced.
    await ensureRemoteBackupProtection(client, log);
    await client.cd(siteRoot);
    await backupLiveGalleryOnServer(client, log);
    await client.cd(siteRoot);

    log(`Uploading dist/ contents to ${siteRoot}...`);
    await client.uploadFromDir(distDir, siteRoot);
    log(`Upload complete (${files.length} file(s)).`);
  } catch (error) {
    throw new Error(`FTP upload failed: ${formatFtpError(error, host)}`);
  } finally {
    client.close();
  }

  return files.length;
}

function stampForBackup() {
  return new Date().toISOString().replace(/[:.]/g, '-');
}

async function ensureRemoteBackupProtection(client, log) {
  const siteRoot = await client.pwd();
  await client.ensureDir(REMOTE_GALLERY_BACKUP_DIR);
  await client.cd(siteRoot);
  if (!fs.existsSync(BACKUP_DENY_HTACCESS)) {
    log('Warning: missing public/data/backups/.htaccess — backup folder may be web-readable.');
    return;
  }
  await client.uploadFrom(BACKUP_DENY_HTACCESS, `${REMOTE_GALLERY_BACKUP_DIR}/.htaccess`);
  log(`Ensured ${REMOTE_GALLERY_BACKUP_DIR}/.htaccess denies web access.`);
}

async function pruneRemoteBackups(client, log, prefix) {
  const siteRoot = await client.pwd();
  const entries = await client.list(REMOTE_GALLERY_BACKUP_DIR);
  await client.cd(siteRoot);
  const backups = entries
    .filter((entry) => entry.isFile && entry.name.startsWith(`${prefix}.`) && entry.name.endsWith('.bak'))
    .sort((a, b) => b.name.localeCompare(a.name));

  for (const outdated of backups.slice(REMOTE_GALLERY_BACKUP_KEEP)) {
    const remotePath = `${REMOTE_GALLERY_BACKUP_DIR}/${outdated.name}`;
    await client.remove(remotePath);
    log(`Pruned old production backup: ${remotePath}`);
  }
}

async function backupLiveGalleryOnServer(client, log) {
  const siteRoot = await client.pwd();
  const remoteFiles = [
    { remotePath: GALLERY_EVENTS_REMOTE, prefix: 'gallery-events.json' },
    { remotePath: GALLERY_ACCESS_REMOTE, prefix: 'gallery-access.json' },
  ];
  const stamp = stampForBackup();

  for (const file of remoteFiles) {
    const tempPath = path.join(
      os.tmpdir(),
      `arra-gallery-backup-${process.pid}-${file.prefix}`,
    );
    try {
      await client.cd(siteRoot);
      await client.downloadTo(tempPath, file.remotePath);
      const contents = fs.readFileSync(tempPath);
      if (contents.length === 0) {
        log(`Production backup skipped (empty): ${file.remotePath}`);
        continue;
      }
      await client.cd(siteRoot);
      const remoteBackupPath = `${REMOTE_GALLERY_BACKUP_DIR}/${file.prefix}.${stamp}.bak`;
      await client.uploadFrom(tempPath, remoteBackupPath);
      log(`Production backup saved: ${remoteBackupPath}`);
      await client.cd(siteRoot);
      await pruneRemoteBackups(client, log, file.prefix);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      log(`Production backup warning for ${file.remotePath}: ${message}`);
    } finally {
      if (fs.existsSync(tempPath)) {
        fs.unlinkSync(tempPath);
      }
      await client.cd(siteRoot);
    }
  }
}

function writeProductionLeadConfig(env, log) {
  const secret = env.RECAPTCHA_SECRET_KEY?.trim();
  const configPath = path.join(distDir, 'api/lead-config.local.php');

  if (!secret) {
    log('Warning: RECAPTCHA_SECRET_KEY missing in .env.local — live booking form will fail after deploy.');
    return;
  }

  const contents = `<?php

declare(strict_types=1);

// Generated during deploy from .env.local — do not commit.
return [
    'recaptcha_secret_key' => ${JSON.stringify(secret)},
];
`;
  fs.mkdirSync(path.dirname(configPath), { recursive: true });
  fs.writeFileSync(configPath, contents, 'utf8');
  log('Wrote dist/api/lead-config.local.php for production reCAPTCHA.');
}

function writeProductionSmtpConfig(env, log) {
  const password = env.SMTP_PASSWORD?.trim();
  const configPath = path.join(distDir, 'api/smtp-config.local.php');

  if (!password) {
    log(
      'Warning: SMTP_PASSWORD was not loaded from .env.local (empty after parsing). Put it in double quotes if it contains #: SMTP_PASSWORD="your#password"',
    );
    return;
  }

  log(`SMTP_PASSWORD loaded (${password.length} characters).`);

  const host = (env.SMTP_HOST?.trim() || 'mail.webhouse.sk');
  const port = Number(env.SMTP_PORT?.trim() || '587');
  const username = (env.SMTP_USERNAME?.trim() || 'arra@jstudio.sk');
  const toEmail = (env.SMTP_TO_EMAIL?.trim() || 'arra@jstudio.sk');
  const fromEmail = (env.SMTP_FROM_EMAIL?.trim() || toEmail);
  const fromName = (env.SMTP_FROM_NAME?.trim() || 'ARRA Website');

  const contents = `<?php

declare(strict_types=1);

// Generated during deploy from .env.local — do not commit.
return [
    'host' => ${JSON.stringify(host)},
    'port' => ${Number.isFinite(port) ? port : 587},
    'encryption' => 'tls',
    'username' => ${JSON.stringify(username)},
    'password' => ${JSON.stringify(password)},
    'to_email' => ${JSON.stringify(toEmail)},
    'from_email' => ${JSON.stringify(fromEmail)},
    'from_name' => ${JSON.stringify(fromName)},
];
`;
  fs.mkdirSync(path.dirname(configPath), { recursive: true });
  fs.writeFileSync(configPath, contents, 'utf8');
  log('Wrote dist/api/smtp-config.local.php for production SMTP (blocked from web by api/.htaccess).');
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
    writeProductionLeadConfig(env, log);
    writeProductionSmtpConfig(env, log);
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
