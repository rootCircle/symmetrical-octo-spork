interface LLMWeights {
  ChatGPT?: number;

  Gemini?: number;

  Ollama?: number;

  Mistral?: number;

  Anthropic?: number;
}

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

async function getSleepDuration(): Promise<number | undefined> {
  return await getSetting<number>('sleepDuration');
}

async function getLLMModel(): Promise<string | undefined> {
  return await getSetting<string>('llmModel');
}

async function getEnableConsensus(): Promise<boolean | undefined> {
  return await getSetting<boolean>('enableConsensus');
}

async function getLLMWeights(): Promise<LLMWeights | undefined> {
  return await getSetting<LLMWeights>('llmWeights');
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

export {
  getSleepDuration,
  getLLMModel,
  getEnableConsensus,
  getLLMWeights,
  getChatGptApiKey,
  getGeminiApiKey,
  getMistralApiKey,
  getAnthropicApiKey,
};
