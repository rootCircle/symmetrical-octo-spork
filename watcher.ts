/* eslint-disable no-console */
import chokidar from 'chokidar';

import runBuild from './builder.ts';

const watch = () => {
  // Initial build
  runBuild()
    .then(() => {})
    .catch(() => {});

  // Watch directories
  const watcher = chokidar.watch(['src/', 'public/'], {
    ignored: /node_modules/,
    persistent: true,
  });

  watcher.on('change', () => {
    // console.log(`File ${path} has been changed`);
    runBuild()
      .then(() => {})
      .catch(() => {});
  });

  watcher.on('add', () => {
    // console.log(`File ${path} has been added`);
    runBuild()
      .then(() => {})
      .catch(() => {});
  });

  watcher.on('unlink', () => {
    // console.log(`File ${path} has been removed`);
    runBuild()
      .then(() => {})
      .catch(() => {});
  });

  console.log('Watching for file changes...');
};

watch();
