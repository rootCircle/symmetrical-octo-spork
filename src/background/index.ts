import { runDocFillerEngine } from '@docFillerCore/index';

browser.runtime.onMessage.addListener((message) => {
  // if message is FILL_FORM
  if (message.data === 'FILL_FORM') {
    // ----------------------------
    // execute the main() function
    runDocFillerEngine();
    // to prevent code from simultaneous multiple execution
    message.data = null;
  }
});
