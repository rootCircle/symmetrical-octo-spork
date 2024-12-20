import fs from 'fs-extra';
import type { Manifest } from 'webextension-polyfill';
import { resolve } from 'path';
import { fileURLToPath } from 'url';
import type PkgType from '../package.json';

const r = (...args: string[]) => {
  return resolve(fileURLToPath(new URL('..', import.meta.url)), ...args);
};

const CHROMIUM_BASED = ['chrome', 'chromium', 'edge', 'brave', 'opera'];
const FIREFOX_BASED = ['firefox'];

export async function getManifest() {
  if (!(await fs.pathExists(r('package.json')))) {
    throw new Error('package.json not found');
  }

  const pkg = (await fs.readJSON(r('package.json'))) as typeof PkgType;
  const browser = process.env.BROWSER?.toLowerCase();
  const isFirefoxBased = FIREFOX_BASED.includes(browser ?? '');
  const isChromiumBased = CHROMIUM_BASED.includes(browser ?? '');
  if (!browser) {
    throw new Error('BROWSER environment variable must be set');
  }
  if (!isFirefoxBased && !isChromiumBased) {
    throw new Error(
      `Unsupported or unspecified browser: ${browser}. Supported browsers: ${[...CHROMIUM_BASED, ...FIREFOX_BASED].join(', ')}`,
    );
  }
  if (isFirefoxBased && isChromiumBased) {
    throw new Error(
      `Both Firefox and Chromium based browsers are specified. Please specify only one.`,
    );
  }

  const baseManifest: Omit<Manifest.WebExtensionManifest, 'background'> = {
    manifest_version: 3,
    name: 'docFiller',
    version: pkg.version,
    description: pkg.description,
    homepage_url: 'https://addons.mozilla.org/en-US/firefox/addon/docfiller/',
    icons: {
      '64': 'assets/icons/icon-form-64.png',
      '96': 'assets/icons/icon-form-96.png',
    },
    developer: {
      name: 'rootCircle',
      url: 'https://github.com/rootCircle',
    },
    permissions: ['activeTab', 'storage'],
    host_permissions: [
      'http://docs.google.com/forms/d/e/*/viewform',
      'https://docs.google.com/forms/d/e/*/viewform',
    ],
    action: {
      default_popup: 'src/popup/index.html',
      default_title: 'docFiller',
    },
    options_ui: {
      page: 'src/options/index.html',
      open_in_tab: true,
    },
    content_scripts: [
      {
        matches: [
          'http://docs.google.com/forms/*',
          'https://docs.google.com/forms/*',
        ],
        js: ['src/contentScript/index.js'],
      },
    ],
  };

  const manifest: Manifest.WebExtensionManifest = {
    ...baseManifest,
    background: (() => {
      if (isFirefoxBased) {
        return { scripts: ['src/background/index.js'] };
      }
      if (isChromiumBased) {
        return { service_worker: 'src/background/index.js' };
      }
      throw new Error('Unsupported browser type');
    })(),
    ...(isFirefoxBased && {
      browser_specific_settings: {
        gecko: {
          id: 'docFiller@rootcircle.github.io',
          strict_min_version: '109.0',
        },
      },
    }),
  };

  return manifest;
}

export async function writeManifest() {
  const browser = process.env.BROWSER;
  if (!browser) {
    throw new Error('BROWSER environment variable must be set');
  }
  try {
    await fs.ensureDir(r('build'));
    const manifest = await getManifest();
    await fs.writeJSON(r('build/manifest.json'), manifest, { spaces: 2 });
    console.log(`✓ manifest.json generated for ${browser}`);
  } catch (error) {
    console.error('Error writing manifest:', error);
    throw error;
  }
}

if (require.main === module) {
  writeManifest().catch(console.error);
}
