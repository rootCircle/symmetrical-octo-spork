/* eslint-disable no-console */
import chokidar from 'chokidar';

import { runBuild } from './builder';
import copyContents from './copier';

const buildWatch = () => {
  runBuild(true).catch(console.error);

  // Watch directories
  const watcher = chokidar.watch(['public/'], {
    ignored: /node_modules/,
    persistent: true,
  });

  watcher.on('change', () => {
    // console.log(`File ${path} has been changed`);
    copyContents('./public', './build').catch(console.error);
  });

  watcher.on('add', () => {
    // console.log(`File ${path} has been added`);
    copyContents('./public', './build').catch(console.error);
  });

  watcher.on('unlink', () => {
    // console.log(`File ${path} has been removed`);
    copyContents('./public', './build').catch(console.error);
  });
};

buildWatch();
