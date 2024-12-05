import { DEFAULT_PROPERTIES } from '@utils/defaultProperties';
import LLMEngineType, { getModelName } from '@utils/llmEngineTypes';

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
    (await getSetting<number>('sleepDuration')) ||
    DEFAULT_PROPERTIES.sleep_duration
  );
}

async function getLLMModel(): Promise<string> {
  return (
    (await getSetting<string>('llmModel')) ||
    getModelName(DEFAULT_PROPERTIES.model)
  );
}

async function getEnableConsensus(): Promise<boolean> {
  return (
    (await getSetting<boolean>('enableConsensus')) ||
    DEFAULT_PROPERTIES.enableConsensus
  );
}

async function getLLMWeights(): Promise<Record<LLMEngineType, number>> {
  return (
    (await getSetting<Record<LLMEngineType, number>>('llmWeights')) ||
    DEFAULT_PROPERTIES.llmWeights
  );
}
async function getChatGptApiKey(): Promise<string | undefined> {
  return await getSetting<string>('chatGptApiKey');
}

async function getGeminiApiKey(): Promise<string | undefined> {
  return await getSetting<string>('geminiApiKey');
}

async function getMistralApiKey(): Promise<string | undefined> {
  return await getSetting<string>('mistralApiKey');
}

async function getAnthropicApiKey(): Promise<string | undefined> {
  return await getSetting<string>('anthropicApiKey');
}
async function getIsEnabled(): Promise<boolean> {
  return (
    (await getSetting<boolean>('automaticFillingEnabled')) ||
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
};
