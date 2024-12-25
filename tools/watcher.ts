/* eslint-disable no-console */
import chokidar from 'chokidar';
import { runBuild } from './builder';
import copyContents from './copier';

const buildWatch = async () => {
  await runBuild(true).catch(console.error);

  const watcher = chokidar.watch(['public/'], {
    ignored: /node_modules/,
    persistent: true,
  });

  const handleChange = async () => {
    try {
      copyContents('./public/assets', './build/assets');
      copyContents('./public/src', './build/src');
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
