/* eslint-disable no-console */
import chokidar from 'chokidar';
import { runBuild } from './builder';
import copyContents from './copier';

const buildWatch = () => {
  runBuild(true).catch(console.error);

  const watcher = chokidar.watch(['public/', 'manifest.ts'], {
    ignored: /node_modules/,
    persistent: true,
  });

  const handleChange = () => {
    try {
      copyContents('./public', './build').catch(console.error);
    } catch (error) {
      console.error('error:', error);
    }
  };

  watcher.on('change', handleChange);
  watcher.on('add', handleChange);
  watcher.on('unlink', handleChange);
};

buildWatch();
