/* eslint-disable no-console */
import chokidar from 'chokidar';
import { runBuild } from './builder';
import copyContents from './copier';
import { writeManifest } from './manifestWriter';

const buildWatch = () => {
  runBuild(true).catch(console.error);

  const manifestWatcher = chokidar.watch(['public/manifest.ts'], {
    persistent: true,
  });

  const publicWatcher = chokidar.watch(['public/'], {
    ignored: /node_modules/,
    persistent: true,
  });

  const handlePublicChange = () => {
    copyContents('./public', './build').catch(console.error);
  };

  const handleManifestChange = async () => {
    try {
      // Clear require cache for manifest.ts
      const manifestPath = require.resolve('../public/manifest');
      delete require.cache[manifestPath];

      // Add a small delay to ensure file writing is complete
      await new Promise((resolve) => setTimeout(resolve, 100));

      await writeManifest();
      console.log('Manifest updated due to change');
    } catch (error) {
      console.error('Error handling manifest change:', error);
    }
  };

  publicWatcher.on('change', handlePublicChange);
  publicWatcher.on('add', handlePublicChange);
  publicWatcher.on('unlink', handlePublicChange);

  manifestWatcher.on('change', handleManifestChange);
  manifestWatcher.on('add', handleManifestChange);
  manifestWatcher.on('unlink', handleManifestChange);
};

buildWatch();
