/* eslint-disable no-console */
import { runDocFillerEngine } from '@docFillerCore/index';
import { DEFAULT_PROPERTIES } from '@utils/defaultProperties';
import { getIsEnabled } from '@utils/storage/getProperties';

let debugging = true;
if (debugging) {
  getIsEnabled()
    .then((isEnabled) => {
      console.log('Enabled??', isEnabled);
      if (isEnabled === false) {
        console.log('Doc Filler is currently disabled');
      } else if (
        isEnabled === true ||
        DEFAULT_PROPERTIES.automaticFillingEnabled
      ) {
        return runDocFillerEngine();
      }
      return Promise.resolve();
    })
    .then(() => {})
    .catch((error) => {
      console.error('Error:', error);
    });
  debugging = false;
}

export {};
