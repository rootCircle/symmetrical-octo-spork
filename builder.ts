/* eslint-disable no-console */
import copyContents from './copier';
import entryPoints from './entrypoints';

const build = async () => {
  const entrypoints = await entryPoints();
  const buildStatus = await Bun.build({
    entrypoints,
    outdir: './build',
    // minify: true,
    target: 'browser',
  });

  await copyContents('./public', './build');

  if (!buildStatus.success) {
    console.error('Build failed');
    for (const message of buildStatus.logs) {
      console.error(message);
    }
    throw new Error('Error building the ts files!');
  }
};

const runBuild = async () => {
  try {
    await build();
    console.log('Build completed successfully.');
  } catch (error) {
    console.error('Build failed:', error);
  }
};

export default runBuild;
