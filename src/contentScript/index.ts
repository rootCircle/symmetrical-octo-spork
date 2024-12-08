/* eslint-disable no-console */
import { runDocFillerEngine } from '@docFillerCore/index';
import { getIsEnabled } from '@utils/storage/getProperties';

getIsEnabled()
  .then((isEnabled) => {
    if (isEnabled === true) {
      runDocFillerEngine().catch(console.error);
    } else {
      console.log('Doc Filler is currently disabled');
    }
    return Promise.resolve();
  })
  .catch(console.error);
