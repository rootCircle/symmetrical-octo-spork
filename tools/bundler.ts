/* eslint-disable no-console */
import { writeManifest } from './manifest';
import { runBuild } from './builder';

async function bundle() {
  await writeManifest();
  await runBuild(false);
}

bundle().catch(console.error);
