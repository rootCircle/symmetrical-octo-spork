import { runDocFillerEngine } from '@docFillerCore/index';
import { type MessageResponse, isFillFormMessage } from '@utils/messageTypes';
import { getIsEnabled } from '@utils/storage/getProperties';

chrome.runtime.onMessage.addListener(
  (
    message: unknown,

    _sender: chrome.runtime.MessageSender,

    sendResponse: (response: MessageResponse) => void,
  ) => {
    if (isFillFormMessage(message)) {
      void runDocFillerEngine()
        .then(() => {
          sendResponse({ success: true });
        })

        .catch((error: Error) => {
          // biome-ignore lint/suspicious/noConsole: <explanation>
          console.error('Error running doc filler:', error);

          sendResponse({
            success: false,

            error: error.message || 'Failed to fill document',
          });
        });

      return true;
    }

    return false;
  },
);

getIsEnabled()
  .then((isEnabled) => {
    if (isEnabled === true) {
      runDocFillerEngine().catch(console.error);
    } else {
      // biome-ignore lint/suspicious/noConsole: <explanation>
      console.log('Doc Filler is currently disabled');
    }
    return Promise.resolve();
  })
  .catch(console.error);
