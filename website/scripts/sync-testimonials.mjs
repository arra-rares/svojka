import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const testimonialsDir = path.resolve(__dirname, '../data/testimonials');
const outputFiles = [
  path.resolve(__dirname, '../data/testimonials.json'),
  path.resolve(__dirname, '../public/data/testimonials.json'),
];

function parseTestimonialFile(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8').trim();
  if (!raw) return null;

  const lines = raw.split('\n');
  const titleLine = lines.find((line) => line.startsWith('# '));
  if (!titleLine) return null;

  const attribution = titleLine.slice(2).trim();
  const quote = lines
    .filter((line) => !line.startsWith('#'))
    .join('\n')
    .trim();

  if (!quote) return null;
  return { attribution, quote };
}

function syncTestimonials() {
  if (!fs.existsSync(testimonialsDir)) {
    fs.mkdirSync(testimonialsDir, { recursive: true });
  }

  const files = fs
    .readdirSync(testimonialsDir)
    .filter((name) => name.endsWith('.md') && name.toUpperCase() !== 'README.MD');

  const testimonials = files
    .map((name) => parseTestimonialFile(path.join(testimonialsDir, name)))
    .filter((item) => item !== null);

  const payload = `${JSON.stringify({ testimonials }, null, 2)}\n`;
  for (const outputFile of outputFiles) {
    fs.mkdirSync(path.dirname(outputFile), { recursive: true });
    fs.writeFileSync(outputFile, payload, 'utf8');
  }
  return testimonials.length;
}

const count = syncTestimonials();
console.log(`Synced ${count} testimonial(s) to data/testimonials.json`);
