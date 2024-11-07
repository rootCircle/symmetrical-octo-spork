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
  const ollamaApiKeyInput = document.getElementById(
    'ollamaApiKey',
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
      'ollamaApiKey',
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
      ollamaApiKeyInput.value = items['ollamaApiKey'] || '';
      mistralApiKeyInput.value = items['mistralApiKey'] || '';
      anthropicApiKeyInput.value = items['anthropicApiKey'] || '';

      // Show or hide elements based on consensus setting
      toggleConsensusOptions(enableConsensusCheckbox.checked);
      updateSingleApiKeyInput();
    },
  );

  // Toggle visibility of elements based on consensus state
  const toggleConsensusOptions = (enableConsensus: boolean) => {
    console.log(`Toggling consensus options: ${enableConsensus}`);
    if (enableConsensus) {
      consensusWeightsDiv.classList.remove('hidden');
      llmModelSelect.classList.add('hidden');
      singleApiKeyInput.classList.add('hidden');
    } else {
      consensusWeightsDiv.classList.add('hidden');
      llmModelSelect.classList.remove('hidden');
      singleApiKeyInput.classList.remove('hidden');
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
    const ollamaApiKey = ollamaApiKeyInput.value;
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
        Ollama: ollamaApiKey, // This will be ignored if it's Ollama
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
            ollamaApiKey,
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
