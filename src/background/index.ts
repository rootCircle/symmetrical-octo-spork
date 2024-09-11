import { LLMEngine } from '@docFillerCore/engines/gptEngine';
import { CURRENT_LLM_MODEL } from '@utils/constant';
import { QType } from '@utils/questionTypes';

interface ChromeResponseMessage {
  type: string;
  prompt: string;
  questionType: QType;
}

chrome.runtime.onMessage.addListener(
  (message: ChromeResponseMessage, _sender, sendResponse) => {
    // TODO:  Fix not working!

    //   if (message.data === 'FILL_FORM') {
    //     runDocFillerEngine().then(() => {
    //       console.log('FILL_FORM message received');
    //     });
    //     message.data = null;
    //   }
    if (message.type === 'API_CALL') {
      LLMEngine.getInstance(CURRENT_LLM_MODEL)
        .invokeLLM(message.prompt, message.questionType)
        .then((response) => {
          sendResponse({ value: response });
        })
        .then(() => {})
        .catch(() => {});
    }

    return true;
  },
);
