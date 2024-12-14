/* eslint-disable no-console */
import { LLMEngine } from '@docFillerCore/engines/gptEngine';
import { LLMEngineType } from '@utils/llmEngineTypes';
import { QType } from '@utils/questionTypes';
import { MetricsManager } from '@utils/storage/metricsManager';

interface ChromeResponseMessage {
  type: string;
  prompt: string;
  model: LLMEngineType;
  questionType: QType;
}

// eslint-disable-next-line @typescript-eslint/no-misused-promises
chrome.runtime.onInstalled.addListener(async () => {
  await MetricsManager.getInstance().getMetrics();
});

chrome.runtime.onMessage.addListener(
  (message: ChromeResponseMessage, _sender, sendResponse) => {
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
