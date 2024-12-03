/* eslint-disable no-console */
import { runDocFillerEngine } from '@docFillerCore/index';
import { getIsEnabled } from '@utils/getProperties';

let debugging = true;
if (debugging) {
  getIsEnabled()
    .then((isEnabled) => {
      console.log('Enabled??', isEnabled);
      if (isEnabled) {
        return runDocFillerEngine();
      } else {
        console.log('Doc Filler is currently disabled');
        return Promise.resolve();
      }
    })
    .then(() => {})
    .catch((error) => {
      console.error('Error:', error);
    });
  debugging = false;
}

export {};
