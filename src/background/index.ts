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
interface MagicPromptMessage {
  type: 'MAGIC_PROMPT_GEN';
  questions: string[];
  model: LLMEngineType;
}

// eslint-disable-next-line @typescript-eslint/no-misused-promises
chrome.runtime.onInstalled.addListener(async () => {
  await MetricsManager.getInstance().getMetrics();
});

chrome.runtime.onMessage.addListener(
  (message: MagicPromptMessage, _sender, sendResponse) => {
    if (message.type === 'MAGIC_PROMPT_GEN') {
      try {
        const instance = new LLMEngine(message.model);
        instance
          .invokeMagicLLM(message.questions)
          .then((response) => {
            sendResponse({ value: response });
          })
          .catch((error: unknown) => {
            console.error('Error generating magic prompt:', error);
            if (error instanceof Error) {
              sendResponse({ error: error.message });
            } else {
              sendResponse({ error: String(error) });
            }
          });
      } catch (error) {
        console.error('Error creating LLMEngine instance:', error);
        sendResponse({ error: String(error) });
      }
      return true;
    }
    return false;
  },
);

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
      return true;
    }
    return false;
  },
);
