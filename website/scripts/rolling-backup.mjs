import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const galleryBackupDir = path.resolve(__dirname, '../data/backups');

const DEFAULT_KEEP = 10;

function stamp() {
  return new Date().toISOString().replace(/[:.]/g, '-');
}

function listBackups(backupDir, prefix) {
  if (!fs.existsSync(backupDir)) {
    return [];
  }

  return fs
    .readdirSync(backupDir)
    .filter((name) => name.startsWith(`${prefix}.`) && name.endsWith('.bak'))
    .map((name) => ({
      name,
      fullPath: path.join(backupDir, name),
      mtimeMs: fs.statSync(path.join(backupDir, name)).mtimeMs,
    }))
    .sort((a, b) => b.mtimeMs - a.mtimeMs);
}

function pruneBackups(backupDir, prefix, keep) {
  const backups = listBackups(backupDir, prefix);
  for (const outdated of backups.slice(keep)) {
    fs.unlinkSync(outdated.fullPath);
  }
}

/**
 * Copy an existing file into data/backups/ and keep only the newest `keep` copies
 * for that logical name (e.g. gallery-events.json → gallery-events.json.<stamp>.bak).
 */
export function backupFileRolling(filePath, options = {}) {
  const keep = options.keep ?? DEFAULT_KEEP;
  const backupDir = options.backupDir ?? galleryBackupDir;
  const label = options.label ?? path.basename(filePath);

  if (!fs.existsSync(filePath)) {
    return null;
  }

  fs.mkdirSync(backupDir, { recursive: true });
  const targetName = `${label}.${stamp()}.bak`;
  const targetPath = path.join(backupDir, targetName);
  fs.copyFileSync(filePath, targetPath);
  pruneBackups(backupDir, label, keep);
  return targetPath;
}

/**
 * Write raw contents into a rolling backup slot (e.g. a file downloaded from production).
 */
export function backupBufferRolling(contents, label, options = {}) {
  const keep = options.keep ?? DEFAULT_KEEP;
  const backupDir = options.backupDir ?? galleryBackupDir;

  fs.mkdirSync(backupDir, { recursive: true });
  const targetName = `${label}.${stamp()}.bak`;
  const targetPath = path.join(backupDir, targetName);
  fs.writeFileSync(targetPath, contents);
  pruneBackups(backupDir, label, keep);
  return targetPath;
}
