/* eslint-disable dot-notation */
import { Settings } from '@utils/settings';
import LLMEngineType, { getModelName } from '@utils/llmEngineTypes';

document.addEventListener('DOMContentLoaded', () => {
  // Get elements from the DOM
  const sleepDurationInput = document.getElementById(
    'sleepDuration',
  ) as HTMLInputElement;
  const llmModelSelect = document.getElementById(
    'llmModel',
  ) as HTMLSelectElement;
  const enableConsensusCheckbox = document.getElementById(
    'enableConsensus',
  ) as HTMLInputElement;
  const consensusWeightsDiv = document.getElementById(
    'consensusWeights',
  ) as HTMLDivElement;
  const weightChatGPTInput = document.getElementById(
    'weightChatGPT',
  ) as HTMLInputElement;
  const weightGeminiInput = document.getElementById(
    'weightGemini',
  ) as HTMLInputElement;
  const weightOllamaInput = document.getElementById(
    'weightOllama',
  ) as HTMLInputElement;
  const weightMistralInput = document.getElementById(
    'weightMistral',
  ) as HTMLInputElement;
  const weightAnthropicInput = document.getElementById(
    'weightAnthropic',
  ) as HTMLInputElement;
  const chatGptApiKeyInput = document.getElementById(
    'chatGptApiKey',
  ) as HTMLInputElement;
  const geminiApiKeyInput = document.getElementById(
    'geminiApiKey',
  ) as HTMLInputElement;
  const mistralApiKeyInput = document.getElementById(
    'mistralApiKey',
  ) as HTMLInputElement;
  const anthropicApiKeyInput = document.getElementById(
    'anthropicApiKey',
  ) as HTMLInputElement;
  const saveButton = document.getElementById('saveButton') as HTMLButtonElement;

  // Load saved options
  chrome.storage.sync.get(
    [
      'sleepDuration',
      'llmModel',
      'enableConsensus',
      'llmWeights',
      'chatGptApiKey',
      'geminiApiKey',
      'mistralApiKey',
      'anthropicApiKey',
    ],
    (items) => {
      console.log('Loaded items:', items); // Debug log
      sleepDurationInput.value = String(items['sleepDuration'] || 2000);
      llmModelSelect.value =
        String(items['llmModel']) ||
        getModelName(Settings.getInstance().getDefaultLLMModel());
      enableConsensusCheckbox.checked =
        (items['enableConsensus'] as boolean) || false;
      chatGptApiKeyInput.value = String(items['chatGptApiKey'] || '');
      geminiApiKeyInput.value = String(items['geminiApiKey'] || '');
      mistralApiKeyInput.value = String(items['mistralApiKey'] || '');
      anthropicApiKeyInput.value = String(items['anthropicApiKey'] || '');

      if (items['enableConsensus']) {
        consensusWeightsDiv.classList.remove('hidden');
        const weights =
          (items['llmWeights'] as Record<LLMEngineType, number>) || {};
        weightChatGPTInput.value = String(
          weights[LLMEngineType.ChatGPT] || 0.42,
        );
        weightGeminiInput.value = String(weights[LLMEngineType.Gemini] || 0.32);
        weightOllamaInput.value = String(weights[LLMEngineType.Ollama] || 0.16);
        weightMistralInput.value = String(
          weights[LLMEngineType.Mistral] || 0.21,
        );
        weightAnthropicInput.value = String(
          weights[LLMEngineType.Anthropic] || 0.31,
        );
      } else {
        consensusWeightsDiv.classList.add('hidden');
      }
    },
  );

  // Handle checkbox change
  enableConsensusCheckbox.addEventListener('change', (e: Event) => {
    const target = e.target as HTMLInputElement;
    consensusWeightsDiv.classList.toggle('hidden', !target.checked);
  });

  // Save options
  saveButton.addEventListener('click', async () => {
    const sleepDuration = parseInt(sleepDurationInput.value, 10);
    const llmModel = llmModelSelect.value;
    const enableConsensus = enableConsensusCheckbox.checked;
    const chatGptApiKey = chatGptApiKeyInput.value;
    const geminiApiKey = geminiApiKeyInput.value;
    const mistralApiKey = mistralApiKeyInput.value;
    const anthropicApiKey = anthropicApiKeyInput.value;
    const llmWeights: Record<string, number> = enableConsensus
      ? {
          ChatGPT: parseFloat(weightChatGPTInput.value),
          Gemini: parseFloat(weightGeminiInput.value),
          Ollama: parseFloat(weightOllamaInput.value),
          Mistral: parseFloat(weightMistralInput.value),
          Anthropic: parseFloat(weightAnthropicInput.value),
        }
      : {};

    // Debug: Log the API key to the console
    console.log('ChatGPT API Key:', chatGptApiKey);
    console.log('GEMINI API Key:', geminiApiKey);

    try {
      await new Promise<void>((resolve, reject) => {
        chrome.storage.sync.set(
          {
            sleepDuration,
            llmModel,
            enableConsensus,
            llmWeights,
            chatGptApiKey,
            geminiApiKey,
            mistralApiKey,
            anthropicApiKey,
          },
          () => {
            if (chrome.runtime.lastError) {
              reject(chrome.runtime.lastError);
            } else {
              resolve();
            }
          },
        );
      });

      // Debug: Log after saving
      console.log('Options saved successfully.');

      // Retrieve and log the saved items
      chrome.storage.sync.get(
        [
          'sleepDuration',
          'llmModel',
          'enableConsensus',
          'llmWeights',
          'chatGptApiKey',
          'geminiApiKey',
          'mistralApiKey',
          'anthropicApiKey',
        ],
        (items) => {
          console.log('Retrieved items after save:', items);
          alert('Options saved and retrieved successfully.');
        },
      );
    } catch (error) {
      console.error('Error saving options:', error);
      alert('Error saving options. Please try again.');
    }
  });
});
