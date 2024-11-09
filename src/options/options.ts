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
  const singleApiKeyInput = document.getElementById(
    'singleApiKey',
  ) as HTMLInputElement;

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
      console.log('Loaded items from storage:', items);
      sleepDurationInput.value = String(items['sleepDuration'] || 2000);
      llmModelSelect.value = items['llmModel'] || 'Gemini';
      enableConsensusCheckbox.checked = Boolean(items['enableConsensus']);
      chatGptApiKeyInput.value = items['chatGptApiKey'] || '';
      geminiApiKeyInput.value = items['geminiApiKey'] || '';
      mistralApiKeyInput.value = items['mistralApiKey'] || '';
      anthropicApiKeyInput.value = items['anthropicApiKey'] || '';

      // Show or hide elements based on consensus setting
      // toggleConsensusOptions(enableConsensusCheckbox.checked);
      updateSingleApiKeyInput();
    },
  );
  // Add this to your existing llmModelSelect event listener

  llmModelSelect.addEventListener('change', () => {
    console.log('Model selection changed to:', llmModelSelect.value);

    const apiKeyInput = document.getElementById(
      'singleApiKey',
    ) as HTMLInputElement;

    const apiKeyContainer = apiKeyInput.parentElement;

    if (llmModelSelect.value === 'Ollama') {
      apiKeyInput.disabled = true;

      apiKeyInput.placeholder = 'No API key required for Ollama';

      apiKeyContainer?.classList.add('warning');

      apiKeyInput.value = '';
    } else {
      apiKeyInput.disabled = false;

      apiKeyInput.placeholder = '';

      apiKeyContainer?.classList.remove('warning');
    }

    updateSingleApiKeyInput();
  });

  // Also add this to check initial state

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

  // Toggle visibility of elements based on consensus state
  const toggleConsensusOptions = (enableConsensus: boolean) => {
    console.log(`Toggling consensus options: ${enableConsensus}`);
    if (enableConsensus) {
      consensusWeightsDiv.classList.remove('hidden');
      // Hide both the select, input and their labels
      document.querySelector('label[for="llmModel"]')?.classList.add('hidden');
      document
        .querySelector('label[for="singleApiKey"]')
        ?.classList.add('hidden');
      llmModelSelect.parentElement?.classList.add('hidden');
      singleApiKeyInput.parentElement?.classList.add('hidden');
    } else {
      consensusWeightsDiv.classList.add('hidden');
      // Show both the select, input and their labels
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

  // Update single API key input based on selected model
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
        console.log('Ollama model selected: no API key required');
        apiKeyValue = '';
        break;
      case 'Mistral':
        apiKeyValue = mistralApiKeyInput.value;
        break;
      case 'Anthropic':
        apiKeyValue = anthropicApiKeyInput.value;
        break;
      default:
        console.warn('Unknown model selected:', selectedModel);
        break;
    }

    singleApiKeyInput.value = apiKeyValue;
    console.log(`API key for ${selectedModel}:`, apiKeyValue);
  };

  // Save the API key to the corresponding model input when changed
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
        console.log(
          "Ignoring input for Ollama model as it doesn't require an API key",
        );
        break;
      case 'Mistral':
        mistralApiKeyInput.value = apiKeyValue;
        break;
      case 'Anthropic':
        anthropicApiKeyInput.value = apiKeyValue;
        break;
      default:
        console.warn('Unknown model selected:', selectedModel);
        break;
    }
    console.log(`Updated API key for ${selectedModel}:`, apiKeyValue);
  });

  // Handle checkbox change
  enableConsensusCheckbox.addEventListener('change', (e: Event) => {
    const target = e.target as HTMLInputElement;
    console.log(`Enable consensus changed to: ${target.checked}`);
    toggleConsensusOptions(target.checked);
  });

  // Handle model selection change to update API key input
  llmModelSelect.addEventListener('change', () => {
    console.log('Model selection changed to:', llmModelSelect.value);
    updateSingleApiKeyInput();
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

    // Log the entire data object for debugging
    console.log('Attempting to save options:', {
      sleepDuration,
      llmModel,
      enableConsensus,
      llmWeights,
      apiKeys: {
        ChatGPT: chatGptApiKey,
        Gemini: geminiApiKey,
        Mistral: mistralApiKey,
        Anthropic: anthropicApiKey,
      },
    });

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

      console.log('Options saved successfully.');
    } catch (error) {
      console.error('Error saving options:', error);
      alert('Error saving options. Please try again.');
    }
  });
});
