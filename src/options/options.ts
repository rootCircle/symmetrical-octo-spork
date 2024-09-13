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
  const saveButton = document.getElementById('saveButton') as HTMLButtonElement;

  // Load saved options
  chrome.storage.sync.get(
    ['sleepDuration', 'llmModel', 'enableConsensus', 'llmWeights'],
    (items) => {
      sleepDurationInput.value = String(items['sleepDuration'] || 2000);
      llmModelSelect.value =
        String(items['llmModel']) ||
        getModelName(Settings.getInstance().getDefaultLLMModel());
      enableConsensusCheckbox.checked =
        (items['enableConsensus'] as boolean) || false;
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
  saveButton.addEventListener('click', () => {
    const sleepDuration = parseInt(sleepDurationInput.value, 10);
    const llmModel = llmModelSelect.value;
    const enableConsensus = enableConsensusCheckbox.checked;
    const llmWeights: Record<string, number> = enableConsensus
      ? {
          ChatGPT: parseFloat(weightChatGPTInput.value),
          Gemini: parseFloat(weightGeminiInput.value),
          Ollama: parseFloat(weightOllamaInput.value),
          Mistral: parseFloat(weightMistralInput.value),
          Anthropic: parseFloat(weightAnthropicInput.value),
        }
      : {};

    chrome.storage.sync.set(
      {
        sleepDuration,
        llmModel,
        enableConsensus,
        llmWeights,
      },
      () => {
        alert('Options saved.');
      },
    );
  });
});
