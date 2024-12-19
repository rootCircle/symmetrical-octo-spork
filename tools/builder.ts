/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable no-console */
import * as esbuild from 'esbuild';

import copyContents from './copier';
import entryPoints from './entrypoints';
import fs from 'fs-extra';

const build = async (watch: boolean) => {
  const entrypoints = await entryPoints();
  await fs.copy('./public', './build', {
    filter: (src) => {
      return !src.endsWith('manifest.json');
    },
  });
  if (watch) {
    const buildContext = await esbuild.context({
      entryPoints: entrypoints,
      bundle: true,
      // minify: true,
      outdir: './build/src',
    });
    await buildContext.watch();
  } else {
    const buildStatus = await esbuild.build({
      entryPoints: entrypoints,
      bundle: true,
      // minify: true,
      outdir: './build/src',
    });

    if (buildStatus.errors.length > 0) {
      console.error('Build failed');
      for (const message of buildStatus.errors) {
        console.error(message.text);
      }
      throw new Error('Error building the ts files!');
    }

    if (buildStatus.warnings.length > 0) {
      console.warn('Build completed with warnings');
      for (const message of buildStatus.warnings) {
        console.warn(message.text);
      }
    }
  }
};

const runBuild = async (watch: boolean) => {
  try {
    await build(watch);
    console.log('Build completed successfully.');
  } catch (error) {
    console.error('Build failed:', error);
  }
};

export { runBuild };
