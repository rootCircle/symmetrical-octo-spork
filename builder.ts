import copyContents from './copier';
import entryPoints from './entrypoints';

const build = async () => {
  const entrypoints = await entryPoints();

  await Bun.build({
    entrypoints: entrypoints,
    outdir: './build',
    minify: true,
  });

  await copyContents('./public', './build');
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
