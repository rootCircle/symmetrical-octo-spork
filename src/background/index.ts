/* eslint-disable no-console */
import { LLMEngine } from '@docFillerCore/engines/gptEngine';
import { LLMEngineType } from '@utils/llmEngineTypes';
import { QType } from '@utils/questionTypes';

interface ChromeResponseMessage {
  type: string;
  prompt: string;
  model: LLMEngineType;
  questionType: QType;
}

chrome.runtime.onMessage.addListener(
  (message: ChromeResponseMessage, _sender, sendResponse) => {
    if (message.type === 'RESET_SETTINGS') {
      void (async () => {
        try {
          await LLMEngine.resetAll();
          sendResponse({ success: true });
        } catch (error) {
          console.error('Error resetting settings:', error);
          sendResponse({ success: false, error: String(error) });
        }
      })();
      return true;
    }
    if (message.type === 'API_CALL') {
      try {
        const instance = new LLMEngine(message.model);

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
