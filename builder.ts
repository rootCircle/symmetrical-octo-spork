import copyContents from './copier';
import entryPoints from './entrypoints';

const build = async () => {
  const entrypoints = await entryPoints();
  const buildStatus = await Bun.build({
    entrypoints: entrypoints,
    outdir: './build',
    minify: true,
  });

  await copyContents('./public', './build');

  if (!buildStatus.success) {
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
