import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Client } from 'basic-ftp';
import { loadEnv } from 'vite';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const websiteRoot = path.resolve(__dirname, '..');
const gallerySourceFile = path.join(websiteRoot, 'data/gallery.json');
const publicDataDir = path.join(websiteRoot, 'public/data');
const galleryImageDir = path.join(websiteRoot, 'public/images/gallery');
const eventsRemote = 'data/gallery-events.json';
const accessRemote = 'data/gallery-access.json';

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

function loadPullEnv() {
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

function isIpv4Host(host) {
  return /^\d{1,3}(?:\.\d{1,3}){3}$/.test(host);
}

function buildTlsOptions(env, host) {
  const rejectUnauthorized =
    (env.FTP_TLS_REJECT_UNAUTHORIZED ?? 'false').toLowerCase() === 'true';
  const servername = env.FTP_TLS_SERVERNAME?.trim() || (isIpv4Host(host) ? '' : host);
  const secureOptions = { rejectUnauthorized };
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
  return { user, password };
}

function formatFtpError(error, host) {
  const message = error instanceof Error ? error.message : 'FTP pull failed.';
  if (message.includes('530') || message.toLowerCase().includes('login incorrect')) {
    return `${message} Hint: Wrong FTP_USER or FTP_PASSWORD — match Total Commander / Webhouse SETUP.`;
  }
  if (isIpv4Host(host)) {
    return `${message} Hint: Prefer the FTP hostname from Webhouse SETUP instead of the IP.`;
  }
  return message;
}

function writeJson(filePath, payload) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
}

function mergeGalleryData(eventsPayload, accessPayload) {
  const publicEvents = Array.isArray(eventsPayload.events) ? eventsPayload.events : [];
  const accessEvents = Array.isArray(accessPayload.events) ? accessPayload.events : [];
  const accessById = new Map(accessEvents.map((item) => [item.id, item]));

  return publicEvents.map((event) => {
    const access = accessById.get(event.id) ?? {};
    return {
      id: event.id,
      name: event.name ?? event.id,
      type: event.type ?? 'other',
      date: event.date ?? '',
      coverImage: event.coverImage ?? '/images/gallery/placeholder-event.svg',
      password: typeof access.password === 'string' ? access.password : '',
      fotoshareUrl: typeof access.fotoshareUrl === 'string' ? access.fotoshareUrl : '',
      visible: event.visible !== false,
    };
  });
}

async function downloadJson(client, remotePath) {
  const tempPath = path.join(
    websiteRoot,
    'logs',
    `pull-tmp-${path.basename(remotePath)}-${process.pid}.json`,
  );
  fs.mkdirSync(path.dirname(tempPath), { recursive: true });
  try {
    await client.downloadTo(tempPath, remotePath);
    const raw = fs.readFileSync(tempPath, 'utf8');
    return JSON.parse(raw);
  } finally {
    if (fs.existsSync(tempPath)) {
      fs.unlinkSync(tempPath);
    }
  }
}

async function downloadCoverImages(client, events, log) {
  fs.mkdirSync(galleryImageDir, { recursive: true });
  let downloaded = 0;
  let skipped = 0;

  for (const event of events) {
    const coverImage = typeof event.coverImage === 'string' ? event.coverImage.trim() : '';
    if (!coverImage.startsWith('/images/gallery/')) {
      skipped += 1;
      continue;
    }

    // coverImage is /images/gallery/foo.jpg → public/images/gallery/foo.jpg
    const targetPath = path.join(websiteRoot, 'public', ...coverImage.slice(1).split('/'));
    const remotePath = coverImage.slice(1);

    try {
      fs.mkdirSync(path.dirname(targetPath), { recursive: true });
      await client.downloadTo(targetPath, remotePath);
      downloaded += 1;
      log(`Downloaded cover: ${coverImage}`);
    } catch (error) {
      skipped += 1;
      const message = error instanceof Error ? error.message : String(error);
      log(`Cover download warning for ${coverImage}: ${message}`);
    }
  }

  return { downloaded, skipped };
}

async function pullGallery(env, log) {
  const host = requireEnv(env, 'FTP_HOST');
  const { user, password } = validateFtpCredentials(env, log);
  const remoteDir = requireEnv(env, 'FTP_REMOTE_DIR');
  const secure = resolveSecureMode(env);
  const port = env.FTP_PORT ? Number(env.FTP_PORT) : undefined;

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
    await client.cd(remoteDir);
    log(`Remote working directory: ${await client.pwd()}`);

    log(`Downloading ${eventsRemote}...`);
    const eventsPayload = await downloadJson(client, eventsRemote);
    log(`Downloading ${accessRemote}...`);
    const accessPayload = await downloadJson(client, accessRemote);

    const events = mergeGalleryData(eventsPayload, accessPayload);
    writeJson(gallerySourceFile, { events });
    writeJson(path.join(publicDataDir, 'gallery-events.json'), {
      events: events.map(({ password, fotoshareUrl, ...pub }) => pub),
    });
    writeJson(path.join(publicDataDir, 'gallery-access.json'), {
      events: events.map(({ id, password, fotoshareUrl }) => ({ id, password, fotoshareUrl })),
    });
    log(`Wrote local gallery.json with ${events.length} event(s).`);

    const covers = await downloadCoverImages(client, events, log);
    log(`Cover images: ${covers.downloaded} downloaded, ${covers.skipped} skipped/missing.`);

    return events.length;
  } catch (error) {
    throw new Error(`FTP pull failed: ${formatFtpError(error, host)}`);
  } finally {
    client.close();
  }
}

async function main() {
  const { log } = createLogger();
  const env = loadPullEnv();

  try {
    log('Pull gallery from website started.');
    const count = await pullGallery(env, log);
    log(`Pull finished successfully (${count} event(s)).`);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Pull failed.';
    log(`ERROR: ${message}`);
    throw error;
  }
}

main().catch((error) => {
  const message = error instanceof Error ? error.message : 'Pull failed.';
  console.error(message);
  process.exit(1);
});
