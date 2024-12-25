import { resolve } from 'path';
import { fileURLToPath } from 'url';
import { getManifest } from '../public/manifest';
import fs from 'fs-extra';

const r = (...args: string[]) => {
  return resolve(fileURLToPath(new URL('..', import.meta.url)), ...args);
};

export async function writeManifest() {
  const browser = process.env.BROWSER;
  if (!browser) {
    throw new Error('BROWSER environment variable must be set');
  }
  try {
    await fs.ensureDir(r('build'));
    const manifest = await getManifest();
    await fs.writeJSON(r('build/manifest.json'), manifest, { spaces: 2 });
    console.log(`✓ manifest.json generated for ${browser}`);
  } catch (error) {
    console.error('Error writing manifest:', error);
    throw error;
  }
}

if (require.main === module) {
  writeManifest().catch(console.error);
}
