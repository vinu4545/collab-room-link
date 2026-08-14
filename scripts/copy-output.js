import { promises as fs } from 'fs';
import path from 'path';

const src = path.resolve('.output', 'public');
const dest = path.resolve('dist');

async function copyDir(srcDir, destDir) {
  await fs.mkdir(destDir, { recursive: true });
  const entries = await fs.readdir(srcDir, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(srcDir, entry.name);
    const destPath = path.join(destDir, entry.name);
    if (entry.isDirectory()) {
      await copyDir(srcPath, destPath);
    } else if (entry.isFile()) {
      await fs.copyFile(srcPath, destPath);
    }
  }
}

(async () => {
  try {
    // ensure source exists
    await fs.access(src);
    await copyDir(src, dest);
    console.log('Copied .output/public to dist');
  } catch (err) {
    console.error('Failed to copy .output/public to dist:', err);
    process.exitCode = 1;
  }
})();
