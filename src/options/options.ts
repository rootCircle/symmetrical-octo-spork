import { DEFAULT_PROPERTIES } from '@utils/defaultProperties';
import LLMEngineType, {
  getAPIPlatformSourceLink,
  getModelName,
  getModelTypeFromName,
} from '@utils/llmEngineTypes';
import { EMPTY_STRING } from '@utils/settings';

(
  document.getElementById('enableConsensus') as HTMLInputElement
)?.addEventListener('change', function () {
  const consensusWeights = document.getElementById('consensusWeights');
  const singleModelOptions = document.getElementById('singleModelOptions');

  if (this.checked) {
    consensusWeights?.classList.remove('hidden');
    singleModelOptions?.classList.add('hidden');
  } else {
    consensusWeights?.classList.add('hidden');
    singleModelOptions?.classList.remove('hidden');
  }
});

document.addEventListener('DOMContentLoaded', () => {
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
  const singleApiKeyInput = document.getElementById(
    'singleApiKey',
  ) as HTMLInputElement;

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
      sleepDurationInput.value = String(
        (items['sleepDuration'] as number) || DEFAULT_PROPERTIES.sleep_duration,
      );
      llmModelSelect.value =
        (items['llmModel'] as string) || getModelName(DEFAULT_PROPERTIES.model);
      enableConsensusCheckbox.checked = Boolean(
        (items['enableConsensus'] as boolean) ||
          DEFAULT_PROPERTIES.enableConsensus,
      );

      const weights =
        (items['llmWeights'] as Record<LLMEngineType, number>) ||
        DEFAULT_PROPERTIES.llmWeights;
      weightChatGPTInput.value = String(weights[LLMEngineType.ChatGPT]);
      weightGeminiInput.value = String(weights[LLMEngineType.Gemini]);
      weightOllamaInput.value = String(weights[LLMEngineType.Ollama]);
      weightMistralInput.value = String(weights[LLMEngineType.Mistral]);
      weightAnthropicInput.value = String(weights[LLMEngineType.Anthropic]);

      chatGptApiKeyInput.value =
        (items['chatGptApiKey'] as string) || EMPTY_STRING;
      geminiApiKeyInput.value =
        (items['geminiApiKey'] as string) || EMPTY_STRING;
      mistralApiKeyInput.value =
        (items['mistralApiKey'] as string) || EMPTY_STRING;
      anthropicApiKeyInput.value =
        (items['anthropicApiKey'] as string) || EMPTY_STRING;

      toggleConsensusOptions(enableConsensusCheckbox.checked);
      updateSingleApiKeyInput();
    },
  );

  llmModelSelect.addEventListener('change', () => {
    const apiKeyInput = document.getElementById(
      'singleApiKey',
    ) as HTMLInputElement;

    const apiKeyContainer = apiKeyInput.parentElement;

    if (llmModelSelect.value === 'Ollama') {
      apiKeyInput.disabled = true;
      apiKeyInput.placeholder =
        'No API key required for Ollama! Ensure Ollama is installed locally on your system.';
      apiKeyContainer?.classList.add('warning');
      apiKeyInput.value = '';
    } else {
      apiKeyInput.disabled = false;
      apiKeyInput.placeholder = '';
      apiKeyContainer?.classList.remove('warning');
    }

    updateSingleApiKeyInput();
  });

  window.addEventListener('load', () => {
    if (llmModelSelect.value === 'Ollama') {
      const apiKeyInput = document.getElementById(
        'singleApiKey',
      ) as HTMLInputElement;

      const apiKeyContainer = apiKeyInput.parentElement;

      apiKeyInput.disabled = true;
      apiKeyInput.placeholder = 'No API key required for Ollama';
      apiKeyContainer?.classList.add('warning');
      apiKeyInput.value = '';
    }
  });

  const toggleConsensusOptions = (enableConsensus: boolean) => {
    if (enableConsensus) {
      consensusWeightsDiv.classList.remove('hidden');
      document.querySelector('label[for="llmModel"]')?.classList.add('hidden');
      document
        .querySelector('label[for="singleApiKey"]')
        ?.classList.add('hidden');
      llmModelSelect.parentElement?.classList.add('hidden');
      singleApiKeyInput.parentElement?.classList.add('hidden');
    } else {
      consensusWeightsDiv.classList.add('hidden');
      document
        .querySelector('label[for="llmModel"]')
        ?.classList.remove('hidden');
      document
        .querySelector('label[for="singleApiKey"]')
        ?.classList.remove('hidden');
      llmModelSelect.parentElement?.classList.remove('hidden');
      singleApiKeyInput.parentElement?.classList.remove('hidden');
    }
  };

  const updateSingleApiKeyInput = () => {
    const selectedModel = llmModelSelect.value;
    let apiKeyValue = '';

    switch (selectedModel) {
      case 'ChatGPT':
        apiKeyValue = chatGptApiKeyInput.value;
        break;
      case 'Gemini':
        apiKeyValue = geminiApiKeyInput.value;
        break;
      case 'Ollama':
        apiKeyValue = '';
        break;
      case 'Mistral':
        apiKeyValue = mistralApiKeyInput.value;
        break;
      case 'Anthropic':
        apiKeyValue = anthropicApiKeyInput.value;
        break;
      default:
        // eslint-disable-next-line no-console
        console.warn('Unknown model selected:', selectedModel);
        break;
    }

    singleApiKeyInput.value = apiKeyValue;
  };

  singleApiKeyInput.addEventListener('input', () => {
    const selectedModel = llmModelSelect.value;
    const apiKeyValue = singleApiKeyInput.value;

    switch (selectedModel) {
      case 'ChatGPT':
        chatGptApiKeyInput.value = apiKeyValue;
        break;
      case 'Gemini':
        geminiApiKeyInput.value = apiKeyValue;
        break;
      case 'Ollama':
        break;
      case 'Mistral':
        mistralApiKeyInput.value = apiKeyValue;
        break;
      case 'Anthropic':
        anthropicApiKeyInput.value = apiKeyValue;
        break;
      default:
        // eslint-disable-next-line no-console
        console.warn('Unknown model selected:', selectedModel);
        break;
    }
  });

  enableConsensusCheckbox.addEventListener('change', (e: Event) => {
    const target = e.target as HTMLInputElement;
    toggleConsensusOptions(target.checked);
  });

  llmModelSelect.addEventListener('change', () => {
    updateSingleApiKeyInput();
  });

  saveButton.addEventListener('click', () => {
    const saveOptions = async () => {
      const sleepDuration = parseInt(sleepDurationInput.value, 10);
      const llmModel = llmModelSelect.value;
      const enableConsensus = enableConsensusCheckbox.checked;
      const chatGptApiKey = chatGptApiKeyInput.value;
      const geminiApiKey = geminiApiKeyInput.value;
      const mistralApiKey = mistralApiKeyInput.value;
      const anthropicApiKey = anthropicApiKeyInput.value;

      const llmWeights = {
        [LLMEngineType.ChatGPT]: parseFloat(weightChatGPTInput.value),
        [LLMEngineType.Gemini]: parseFloat(weightGeminiInput.value),
        [LLMEngineType.Ollama]: parseFloat(weightOllamaInput.value),
        [LLMEngineType.Mistral]: parseFloat(weightMistralInput.value),
        [LLMEngineType.Anthropic]: parseFloat(weightAnthropicInput.value),
      };

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
                reject(new Error(chrome.runtime.lastError.message));
              } else {
                resolve();
              }
            },
          );
        });
        alert('Options saved successfully!');
      } catch (error) {
        alert(
          `Error saving options. Please try again. ${error instanceof Error ? error.message : String(error)}`,
        );
      }
    };

    void saveOptions();
  });
});

document.addEventListener('DOMContentLoaded', function () {
  const modelSelect = document.getElementById('llmModel') as HTMLSelectElement;
  const apiKeyInputLink = document.getElementById(
    'singleApiKeyLink',
  ) as HTMLAnchorElement;
  const enableConsensusCheckbox = document.getElementById(
    'enableConsensus',
  ) as HTMLInputElement;

  function updateApiKeyLink(): void {
    const selectedModel = modelSelect.value;
    const selectedModelType = getModelTypeFromName(selectedModel);

    if (!selectedModelType) {
      return;
    }

    const warningMessage = document.querySelector(
      '.warning-message',
    ) as HTMLElement;

    const apiLink = getAPIPlatformSourceLink(selectedModelType);
    if (apiLink === '') {
      apiKeyInputLink.style.display = 'none';
      warningMessage.style.display = 'block';
    } else {
      apiKeyInputLink.href = apiLink;
      apiKeyInputLink.textContent = 'Get API Key';
      apiKeyInputLink.style.display = 'block';
      warningMessage.style.display = 'none';
    }
  }

  function updateConsensusApiLinks() {
    const consensusSection = document.getElementById(
      'consensusWeights',
    ) as HTMLElement;

    if (enableConsensusCheckbox.checked) {
      consensusSection.classList.remove('hidden');

      updateConsensusApiLink('chatGptApiKey', 'ChatGPT');
      updateConsensusApiLink('geminiApiKey', 'Gemini');
      updateConsensusApiLink('ollamaApiKey', 'Ollama');
      updateConsensusApiLink('mistralApiKey', 'Mistral');
      updateConsensusApiLink('anthropicApiKey', 'Anthropic');
    } else {
      consensusSection.classList.add('hidden');
    }
  }

  function updateConsensusApiLink(apiKeyElementId: string, modelName: string) {
    const apiKeyInput = document.getElementById(
      apiKeyElementId,
    ) as HTMLInputElement;
    const modelDetected = getModelTypeFromName(modelName);
    if (!modelDetected) {
      return;
    }
    const apiLink = getAPIPlatformSourceLink(modelDetected);

    if (apiLink) {
      apiKeyInput.disabled = false;
      const apiLinkElement =
        apiKeyInput.nextElementSibling as HTMLAnchorElement;
      apiLinkElement.href = apiLink;
      apiLinkElement.style.display = 'block';
    } else {
      apiKeyInput.disabled = true;
      const apiLinkElement =
        apiKeyInput.nextElementSibling as HTMLAnchorElement;
      apiLinkElement.style.display = 'none';
    }
  }

  modelSelect.addEventListener('change', updateApiKeyLink);
  enableConsensusCheckbox.addEventListener('change', updateConsensusApiLinks);

  // Initial call to set up the form when it loads
  updateApiKeyLink();
  updateConsensusApiLinks();
});
