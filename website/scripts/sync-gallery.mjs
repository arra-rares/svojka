import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const sourceFile = path.resolve(__dirname, '../data/gallery.json');
const outputDir = path.resolve(__dirname, '../public/data');
const eventsOutputFile = path.join(outputDir, 'gallery-events.json');
const accessOutputFile = path.join(outputDir, 'gallery-access.json');

function syncGallery() {
  if (!fs.existsSync(sourceFile)) {
    throw new Error(`Missing gallery source file: ${sourceFile}`);
  }

  const raw = fs.readFileSync(sourceFile, 'utf8');
  const data = JSON.parse(raw);
  const events = Array.isArray(data.events) ? data.events : [];
  const visibleEvents = events.filter((event) => event.visible);

  const publicEvents = visibleEvents
    .map(({ password, fotoshareUrl, ...publicEvent }) => publicEvent)
    .sort((a, b) => b.date.localeCompare(a.date));

  const accessEvents = visibleEvents.map(({ id, password, fotoshareUrl }) => ({
    id,
    password,
    fotoshareUrl,
  }));

  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(eventsOutputFile, `${JSON.stringify({ events: publicEvents }, null, 2)}\n`, 'utf8');
  fs.writeFileSync(accessOutputFile, `${JSON.stringify({ events: accessEvents }, null, 2)}\n`, 'utf8');

  return publicEvents.length;
}

const count = syncGallery();
console.log(`Synced ${count} visible gallery event(s) to public/data/`);
