import { DEFAULT_PROPERTIES } from '@utils/defaultProperties';
import { LLMEngineType, getModelName } from '@utils/llmEngineTypes';
import { EMPTY_STRING } from '@utils/settings';

function getSetting<T>(key: string): Promise<T | undefined> {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get([key], (items) => {
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError.message));
      } else {
        resolve(items[key] as T);
      }
    });
  });
}

async function getSleepDuration(): Promise<number> {
  return (
    (await getSetting<number>('sleepDuration')) ??
    DEFAULT_PROPERTIES.sleep_duration
  );
}

async function getLLMModel(): Promise<string> {
  return (
    (await getSetting<string>('llmModel')) ??
    getModelName(DEFAULT_PROPERTIES.model)
  );
}

async function getSkipMarkedSetting(): Promise<boolean> {
  const defaultSkipMarked = DEFAULT_PROPERTIES.skipMarkedQuestions;
  return new Promise<boolean>((resolve) => {
    chrome.storage.sync.get(['skipMarkedQuestions'], (items) => {
      resolve(
        typeof items['skipMarkedQuestions'] === 'boolean'
          ? items['skipMarkedQuestions']
          : defaultSkipMarked,
      );
    });
  });
}

async function getSkipMarkedToggleStatus(
  skipMarkedToggle: HTMLElement | null,
): Promise<void> {
  return new Promise((resolve) => {
    chrome.storage.sync.get(['skipMarkedQuestions'], (items) => {
      const isEnabled =
        (items['skipMarkedQuestions'] as boolean) ??
        DEFAULT_PROPERTIES.skipMarkedQuestions;
      skipMarkedToggle?.classList.toggle('active', isEnabled);
      resolve();
    });
  });
}

async function getEnableConsensus(): Promise<boolean> {
  return (
    (await getSetting<boolean>('enableConsensus')) ??
    DEFAULT_PROPERTIES.enableConsensus
  );
}

async function getLLMWeights(): Promise<Record<LLMEngineType, number>> {
  return (
    (await getSetting<Record<LLMEngineType, number>>('llmWeights')) ??
    DEFAULT_PROPERTIES.llmWeights
  );
}
async function getChatGptApiKey(): Promise<string> {
  return (await getSetting<string>('chatGptApiKey')) ?? EMPTY_STRING;
}

async function getGeminiApiKey(): Promise<string> {
  return (await getSetting<string>('geminiApiKey')) ?? EMPTY_STRING;
}

async function getMistralApiKey(): Promise<string> {
  return (await getSetting<string>('mistralApiKey')) ?? EMPTY_STRING;
}

async function getAnthropicApiKey(): Promise<string> {
  return (await getSetting<string>('anthropicApiKey')) ?? EMPTY_STRING;
}
async function getIsEnabled(): Promise<boolean> {
  return (
    (await getSetting<boolean>('automaticFillingEnabled')) ??
    DEFAULT_PROPERTIES.automaticFillingEnabled
  );
}

export {
  getSleepDuration,
  getLLMModel,
  getEnableConsensus,
  getLLMWeights,
  getChatGptApiKey,
  getGeminiApiKey,
  getMistralApiKey,
  getAnthropicApiKey,
  getIsEnabled,
  getSkipMarkedSetting,
  getSkipMarkedToggleStatus,
};
