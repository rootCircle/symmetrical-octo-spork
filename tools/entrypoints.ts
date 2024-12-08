import { readdir } from 'fs/promises';
import { extname, join } from 'path';

const sourceDir = './src/';

/**
 * Recursively get all .ts and .js entrypoints from the directory
 *
 * @param dir Directory path to scan
 * @returns {Promise<string[]>} The entrypoints
 */
async function getFiles(dir: string): Promise<string[]> {
  const dirEntries = await readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    dirEntries.map((dirent) => {
      const res = join(dir, dirent.name);
      if (dirent.isDirectory()) {
        return getFiles(res);
      } else {
        return Promise.resolve(res);
      }
    }),
  );

  // Flatten the array and filter only .ts and .js files
  const filteredFiles: string[] = (
    Array.prototype.concat(...files) as string[]
  ).filter((file) => ['.ts', '.js'].includes(extname(file)));
  return filteredFiles;
}

/**
 * Get all entrypoints from the src directory
 *
 * @returns {Promise<string[]>} The entrypoints
 */
export default async function entryPoints(): Promise<string[]> {
  return getFiles(sourceDir);
}
