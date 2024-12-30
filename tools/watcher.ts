import chokidar from 'chokidar';
import { runBuild } from './builder';
import copyContents from './copier';
import { writeManifest } from './manifestWriter';
import { copyFile, stat } from 'node:fs/promises';
import { mkdir } from 'node:fs/promises';
import { join } from 'node:path';

const buildWatch = async () => {
  runBuild(true).catch(console.error);
  await copyContents('./public', './build');

  const manifestWatcher = chokidar.watch(['public/manifest.ts'], {
    persistent: true,
  });

  const publicWatcher = chokidar.watch(['public/'], {
    persistent: true,
  });

  const handlePublicChange = async (path: string) => {
    const targetFile = path.replace('public', 'build');
    try {
      const stats = await stat(path);
      if (stats.isDirectory()) {
        await mkdir(targetFile, { recursive: true });
        return;
      }
    } catch (err) {
      // biome-ignore lint/suspicious/noConsole: <explanation>
      console.error(`Error statting path:${err}`);
      return;
    }
    
    const targetDir = join(targetFile, '..');
    
    try {
      await mkdir(targetDir, { recursive: true });
      await copyFile(path, targetFile);
    } catch (error) {
      // biome-ignore lint/suspicious/noConsole: <explanation>
      console.error(`Error:${error}`);
    }
  };

  const handleManifestChange = async () => {
    try {
      // Clear require cache for manifest.ts
      const manifestPath = require.resolve('../public/manifest');
      delete require.cache[manifestPath];

      // Add a small delay to ensure file writing is complete
      await new Promise((resolve) => setTimeout(resolve, 100));

      await writeManifest();
      // biome-ignore lint/suspicious/noConsole: <explanation>
      console.log('Manifest updated due to change');
    } catch (error) {
      // biome-ignore lint/suspicious/noConsole: <explanation>
      console.error('Error handling manifest change:', error);
    }
  };

  publicWatcher.on('change', handlePublicChange);
  publicWatcher.on('add', handlePublicChange);
  publicWatcher.on('unlink', handlePublicChange);
  publicWatcher.on('unlinkDir', handlePublicChange);
  publicWatcher.on('addDir', handlePublicChange);
  publicWatcher.on('error', console.error);

  manifestWatcher.on('change', handleManifestChange);
  manifestWatcher.on('add', handleManifestChange);
  manifestWatcher.on('unlink', handleManifestChange);
};


buildWatch().catch(console.error);
