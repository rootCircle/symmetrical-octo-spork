import chokidar from 'chokidar';
import runBuild from './builder.ts';

const watch = () => {
  // Initial build
  runBuild();

  // Watch directories
  const watcher = chokidar.watch(['src/', 'public/'], {
    ignored: /node_modules/,
    persistent: true,
  });

  watcher.on('change', path => {
    // console.log(`File ${path} has been changed`);
    runBuild();
  });

  watcher.on('add', path => {
    // console.log(`File ${path} has been added`);
    runBuild();
  });

  watcher.on('unlink', path => {
    // console.log(`File ${path} has been removed`);
    runBuild();
  });

  console.log('Watching for file changes...');
};

watch();
