/* eslint-disable no-console */
import { runDocFillerEngine } from '@docFillerCore/index';

let debugging = true;
if (debugging) {
  runDocFillerEngine()
    .then(() => {})
    .catch((error) => {
      console.error('Error getting response:', error);
    });
  debugging = false;
}

export {};
