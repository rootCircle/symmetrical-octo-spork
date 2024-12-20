/* eslint-disable no-console */
import chokidar from 'chokidar';
import { runBuild } from './builder';
import { writeManifest } from './manifest';
import fs from 'fs-extra';

const buildWatch = async () => {
  await writeManifest();
  await runBuild(true).catch(console.error);

  const watcher = chokidar.watch(['public/'], {
    ignored: /node_modules/,
    persistent: true,
  });

  const handleChange = async () => {
    try {
      await fs.copy('./public', './build', {
        filter: (src) => !src.endsWith('manifest.json'),
        overwrite: true,
      });
      await writeManifest();
      await runBuild(true);
    } catch (error) {
      console.error('error:', error);
    }
  };

  watcher.on('change', handleChange);
  watcher.on('add', handleChange);
  watcher.on('unlink', handleChange);
};

buildWatch();
