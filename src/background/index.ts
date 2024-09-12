/* eslint-disable no-console */
import { LLMEngine } from '@docFillerCore/engines/gptEngine';
import LLMEngineType from '@utils/llmEngineTypes';
import { QType } from '@utils/questionTypes';

interface ChromeResponseMessage {
  type: string;
  prompt: string;
  model: LLMEngineType;
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
      try {
        const instance = LLMEngine.getInstance(message.model);

        instance
          .invokeLLM(message.prompt, message.questionType)
          .then((response) => {
            sendResponse({ value: response });
          })
          .then(() => {})
          .catch((error) => {
            console.error('Error getting response:', error);
          });
      } catch (error) {
        console.error('Error creating LLMEngine instance:', error);
      }
    }

    return true;
  },
);
