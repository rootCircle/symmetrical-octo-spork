/* eslint-disable no-console */
import chokidar from 'chokidar';
import { runBuild } from './builder';
import copyContents from './copier';

const buildWatch = () => {
  runBuild(true).catch(console.error);

  const watcher = chokidar.watch(['public/', 'public/manifest.ts'], {
    ignored: /node_modules/,
    persistent: true,
  });

  const handleChange = () => {
    copyContents('./public', './build').catch(console.error);
  };

  watcher.on('change', handleChange);
  watcher.on('add', handleChange);
  watcher.on('unlink', handleChange);
};

buildWatch();
