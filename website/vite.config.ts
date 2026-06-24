// @ts-nocheck
import path from 'path';
import crypto from 'crypto';
import fs from 'fs';
import { spawn } from 'child_process';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

type GalleryEvent = {
  id: string;
  name: string;
  type: 'wedding' | 'corporate' | 'party' | 'stuzkova' | 'other';
  date: string;
  coverImage: string;
  password: string;
  fotoshareUrl: string;
  visible: boolean;
};

type GalleryDataFile = {
  events: GalleryEvent[];
};

type CoverImageUpload = {
  fileName: string;
  mimeType: string;
  dataBase64: string;
};

const dataFilePath = path.resolve(__dirname, 'data/gallery.json');
const galleryImageDirPath = path.resolve(__dirname, 'public/images/gallery');
const authCookieName = 'arra_admin_auth';
const allowedImageMimeTypes = new Set(['image/jpeg', 'image/jpg', 'image/png', 'image/webp']);
let activeAdminSessionToken = '';
let deployInProgress = false;

function ensureStorage() {
  if (!fs.existsSync(path.dirname(dataFilePath))) {
    fs.mkdirSync(path.dirname(dataFilePath), { recursive: true });
  }
  if (!fs.existsSync(galleryImageDirPath)) {
    fs.mkdirSync(galleryImageDirPath, { recursive: true });
  }
  if (!fs.existsSync(dataFilePath)) {
    const initialData: GalleryDataFile = { events: [] };
    fs.writeFileSync(dataFilePath, `${JSON.stringify(initialData, null, 2)}\n`, 'utf8');
  }
}

function readGalleryData(): GalleryDataFile {
  ensureStorage();
  const fileContent = fs.readFileSync(dataFilePath, 'utf8');
  return JSON.parse(fileContent) as GalleryDataFile;
}

function writeGalleryData(data: GalleryDataFile) {
  fs.writeFileSync(dataFilePath, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
}

function parseCookies(req): Record<string, string> {
  const header = req.headers.cookie;
  if (!header) return {};
  return header.split(';').reduce<Record<string, string>>((acc, chunk) => {
    const [rawKey, ...rest] = chunk.trim().split('=');
    if (!rawKey || rest.length === 0) return acc;
    acc[rawKey] = decodeURIComponent(rest.join('='));
    return acc;
  }, {});
}

function isAuthenticated(req) {
  const cookieValue = parseCookies(req)[authCookieName];
  return Boolean(cookieValue && cookieValue === activeAdminSessionToken);
}

function sendJson(res, statusCode: number, payload: unknown) {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(payload));
}

function parseBody(req): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on('data', (chunk: Buffer) => chunks.push(chunk));
    req.on('end', () => {
      if (chunks.length === 0) {
        resolve({});
        return;
      }
      try {
        const text = Buffer.concat(chunks).toString('utf8');
        resolve(text ? JSON.parse(text) : {});
      } catch (error) {
        reject(error);
      }
    });
    req.on('error', reject);
  });
}

function validateFotoshareUrl(url: string) {
  return url.startsWith('https://fotoshare.co/e/');
}

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

function getExtensionFromMime(mimeType: string) {
  switch (mimeType) {
    case 'image/jpeg':
    case 'image/jpg':
      return 'jpg';
    case 'image/png':
      return 'png';
    case 'image/webp':
      return 'webp';
    default:
      return null;
  }
}

function saveCoverImage(eventId: string, upload: CoverImageUpload) {
  if (!allowedImageMimeTypes.has(upload.mimeType)) {
    throw new Error('Unsupported image format. Allowed: jpg, jpeg, png, webp.');
  }
  const extension = getExtensionFromMime(upload.mimeType);
  if (!extension) {
    throw new Error('Unsupported image format.');
  }
  const imageBuffer = Buffer.from(upload.dataBase64, 'base64');
  if (imageBuffer.length === 0) {
    throw new Error('Uploaded image is empty.');
  }
  const fileName = `${eventId}.${extension}`;
  const filePath = path.resolve(galleryImageDirPath, fileName);
  fs.writeFileSync(filePath, imageBuffer);
  return `/images/gallery/${fileName}`;
}

function requireAdminPassword(adminPassword: string | undefined) {
  const value = adminPassword;
  if (!value) {
    throw new Error('Missing ADMIN_PASSWORD environment variable.');
  }
  return value;
}

function validateEventPayload(
  body: unknown,
): Omit<GalleryEvent, 'id' | 'coverImage'> & {
  coverImageUpload?: CoverImageUpload;
  replaceCoverImage?: boolean;
} {
  const payload = body as Record<string, unknown>;
  const type = payload.type;
  const date = payload.date;
  const name = payload.name;
  const password = payload.password;
  const fotoshareUrl = payload.fotoshareUrl;
  const visible = payload.visible;

  const allowedTypes = new Set(['wedding', 'corporate', 'party', 'stuzkova', 'other']);
  if (typeof type !== 'string' || !allowedTypes.has(type)) {
    throw new Error('Invalid event type.');
  }
  if (typeof date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    throw new Error('Date must use YYYY-MM-DD format.');
  }
  if (typeof name !== 'string' || name.trim().length < 2) {
    throw new Error('Event name is required.');
  }
  if (typeof password !== 'string' || password.length < 1) {
    throw new Error('Event password is required.');
  }
  if (typeof fotoshareUrl !== 'string' || !validateFotoshareUrl(fotoshareUrl)) {
    throw new Error('Fotoshare URL must start with https://fotoshare.co/e/');
  }
  if (typeof visible !== 'boolean') {
    throw new Error('Visible must be true or false.');
  }

  const coverImageUploadRaw = payload.coverImageUpload as Partial<CoverImageUpload> | undefined;
  let coverImageUpload: CoverImageUpload | undefined;
  if (coverImageUploadRaw) {
    if (
      typeof coverImageUploadRaw.fileName !== 'string' ||
      typeof coverImageUploadRaw.mimeType !== 'string' ||
      typeof coverImageUploadRaw.dataBase64 !== 'string'
    ) {
      throw new Error('Invalid cover image upload payload.');
    }
    coverImageUpload = {
      fileName: coverImageUploadRaw.fileName,
      mimeType: coverImageUploadRaw.mimeType,
      dataBase64: coverImageUploadRaw.dataBase64,
    };
  }

  return {
    name: name.trim(),
    type,
    date,
    password,
    fotoshareUrl: fotoshareUrl.trim(),
    visible,
    coverImageUpload,
    replaceCoverImage: Boolean(payload.replaceCoverImage),
  };
}

function requireFtpConfig(env: Record<string, string>) {
  const requiredKeys = ['FTP_HOST', 'FTP_USER', 'FTP_PASSWORD', 'FTP_REMOTE_DIR'];
  const missing = requiredKeys.filter((key) => !env[key]?.trim());
  if (missing.length > 0) {
    throw new Error(`Missing FTP settings in .env.local: ${missing.join(', ')}`);
  }
}

function runDeployScript() {
  return new Promise<string>((resolve, reject) => {
    const scriptPath = path.resolve(__dirname, 'scripts/deploy-ftp.mjs');
    const child = spawn(process.execPath, [scriptPath], {
      cwd: __dirname,
      env: process.env,
      stdio: ['ignore', 'pipe', 'pipe'],
    });

    let output = '';
    child.stdout.on('data', (chunk: Buffer) => {
      output += chunk.toString('utf8');
    });
    child.stderr.on('data', (chunk: Buffer) => {
      output += chunk.toString('utf8');
    });
    child.on('error', reject);
    child.on('close', (code) => {
      const trimmed = output.trim();
      if (code === 0) {
        resolve(trimmed || 'Website uploaded successfully.');
        return;
      }
      reject(new Error(trimmed || 'Deploy failed.'));
    });
  });
}

function createAdminApiPlugin(adminPasswordFromEnv: string | undefined, env: Record<string, string>) {
  return {
    name: 'arra-admin-api',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url?.startsWith('/api/')) {
          next();
          return;
        }

        try {
          ensureStorage();
          const url = new globalThis.URL(req.url, 'http://localhost');
          const pathname = url.pathname;

          if (pathname === '/api/admin/session' && req.method === 'GET') {
            sendJson(res, 200, { authenticated: isAuthenticated(req) });
            return;
          }

          if (pathname === '/api/admin/login' && req.method === 'POST') {
            const body = (await parseBody(req)) as { password?: string };
            const adminPassword = requireAdminPassword(adminPasswordFromEnv);
            if (body.password !== adminPassword) {
              sendJson(res, 401, { error: 'Invalid password.' });
              return;
            }
            activeAdminSessionToken = crypto.randomBytes(32).toString('hex');
            res.setHeader(
              'Set-Cookie',
              `${authCookieName}=${activeAdminSessionToken}; HttpOnly; Path=/; Max-Age=86400; SameSite=Lax`,
            );
            sendJson(res, 200, { ok: true });
            return;
          }

          if (pathname === '/api/admin/logout' && req.method === 'POST') {
            activeAdminSessionToken = '';
            res.setHeader(
              'Set-Cookie',
              `${authCookieName}=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax`,
            );
            sendJson(res, 200, { ok: true });
            return;
          }

          if (pathname.startsWith('/api/admin/')) {
            if (!isAuthenticated(req)) {
              sendJson(res, 401, { error: 'Unauthorized.' });
              return;
            }

            if (pathname === '/api/admin/deploy' && req.method === 'POST') {
              if (deployInProgress) {
                sendJson(res, 409, { error: 'Upload already in progress.' });
                return;
              }
              requireFtpConfig(env);
              deployInProgress = true;
              try {
                const message = await runDeployScript();
                sendJson(res, 200, { ok: true, message });
              } catch (error) {
                const message = error instanceof Error ? error.message : 'Deploy failed.';
                sendJson(res, 500, { error: message });
              } finally {
                deployInProgress = false;
              }
              return;
            }

            if (pathname === '/api/admin/events' && req.method === 'GET') {
              const data = readGalleryData();
              sendJson(res, 200, { events: data.events });
              return;
            }

            if (pathname === '/api/admin/events' && req.method === 'POST') {
              const payload = validateEventPayload(await parseBody(req));
              const data = readGalleryData();
              const baseId = slugify(`${payload.name}-${payload.date}`);
              if (!baseId) {
                sendJson(res, 400, { error: 'Unable to generate event id.' });
                return;
              }

              let id = baseId;
              let index = 2;
              while (data.events.some((event) => event.id === id)) {
                id = `${baseId}-${index}`;
                index += 1;
              }
              if (!payload.coverImageUpload) {
                sendJson(res, 400, { error: 'Cover image upload is required.' });
                return;
              }
              const coverImage = saveCoverImage(id, payload.coverImageUpload);
              const event: GalleryEvent = {
                id,
                name: payload.name,
                type: payload.type,
                date: payload.date,
                coverImage,
                password: payload.password,
                fotoshareUrl: payload.fotoshareUrl,
                visible: payload.visible,
              };
              data.events.push(event);
              writeGalleryData(data);
              sendJson(res, 201, { event });
              return;
            }

            if (pathname.startsWith('/api/admin/events/') && req.method === 'PUT') {
              const eventId = pathname.replace('/api/admin/events/', '');
              const payload = validateEventPayload(await parseBody(req));
              const data = readGalleryData();
              const event = data.events.find((item) => item.id === eventId);
              if (!event) {
                sendJson(res, 404, { error: 'Event not found.' });
                return;
              }

              if (payload.coverImageUpload && payload.replaceCoverImage) {
                event.coverImage = saveCoverImage(event.id, payload.coverImageUpload);
              }
              event.name = payload.name;
              event.type = payload.type;
              event.date = payload.date;
              event.password = payload.password;
              event.fotoshareUrl = payload.fotoshareUrl;
              event.visible = payload.visible;
              writeGalleryData(data);
              sendJson(res, 200, { event });
              return;
            }

            if (pathname.startsWith('/api/admin/events/') && req.method === 'DELETE') {
              const eventId = pathname.replace('/api/admin/events/', '');
              const data = readGalleryData();
              const event = data.events.find((item) => item.id === eventId);
              if (!event) {
                sendJson(res, 404, { error: 'Event not found.' });
                return;
              }
              event.visible = false;
              writeGalleryData(data);
              sendJson(res, 200, { event });
              return;
            }
          }

          if (pathname === '/api/gallery/events' && req.method === 'GET') {
            const data = readGalleryData();
            const events = data.events
              .filter((event) => event.visible)
              .map(({ password, ...publicEvent }) => publicEvent)
              .sort((a, b) => b.date.localeCompare(a.date));
            sendJson(res, 200, { events });
            return;
          }

          if (pathname === '/api/gallery/access' && req.method === 'POST') {
            const body = (await parseBody(req)) as { id?: string; password?: string };
            if (typeof body.id !== 'string' || typeof body.password !== 'string') {
              sendJson(res, 400, { error: 'Missing id or password.' });
              return;
            }
            const data = readGalleryData();
            const event = data.events.find((item) => item.id === body.id && item.visible);
            if (!event || body.password !== event.password) {
              sendJson(res, 401, { error: 'Invalid password.' });
              return;
            }
            sendJson(res, 200, { fotoshareUrl: event.fotoshareUrl });
            return;
          }

          sendJson(res, 404, { error: 'Not found.' });
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Unexpected server error.';
          sendJson(res, 500, { error: message });
        }
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, __dirname, '');
  const adminPassword = env.ADMIN_PASSWORD ?? process.env.ADMIN_PASSWORD;

  return {
    plugins: [react(), tailwindcss(), createAdminApiPlugin(adminPassword, env)],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
  };
});
