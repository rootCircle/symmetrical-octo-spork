import { runDocFillerEngine } from '@docFillerCore/index';

let debugging = true;
if (debugging) {
  runDocFillerEngine()
    .then(() => {})
    .catch(() => {});
  debugging = false;
}

export {};
