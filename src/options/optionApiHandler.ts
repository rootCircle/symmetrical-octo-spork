import {
  LLMEngineType,
  getAPIPlatformSourceLink,
  getModelName,
  getModelTypeFromName,
} from '@utils/llmEngineTypes';

function updateApiKeyLink(
  modelSelect: HTMLSelectElement,
  apiKeyInputLink: HTMLAnchorElement,
): void {
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

function updateConsensusApiLinks(
  enableConsensusCheckbox: HTMLInputElement,
): void {
  const consensusSection = document.getElementById(
    'consensusWeights',
  ) as HTMLElement;

  if (enableConsensusCheckbox.checked) {
    consensusSection.classList.remove('hidden');

    updateConsensusApiLink(
      'chatGptApiKey',
      getModelName(LLMEngineType.ChatGPT),
    );
    updateConsensusApiLink('geminiApiKey', getModelName(LLMEngineType.Gemini));
    updateConsensusApiLink('ollamaApiKey', getModelName(LLMEngineType.Ollama));
    updateConsensusApiLink(
      'chromeAIApiKey',
      getModelName(LLMEngineType.ChromeAI),
    );
    updateConsensusApiLink(
      'mistralApiKey',
      getModelName(LLMEngineType.Mistral),
    );
    updateConsensusApiLink(
      'anthropicApiKey',
      getModelName(LLMEngineType.Anthropic),
    );
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
    const apiLinkElement = apiKeyInput.nextElementSibling as HTMLAnchorElement;
    apiLinkElement.href = apiLink;
    apiLinkElement.style.display = 'block';
  } else {
    apiKeyInput.disabled = true;
    const apiLinkElement = apiKeyInput.nextElementSibling as HTMLAnchorElement;
    apiLinkElement.style.display = 'none';
  }
}

function updateApiKeyInputField(
  apiKeyInput: HTMLInputElement,
  llmModelSelect: HTMLSelectElement,
) {
  const apiKeyContainer = apiKeyInput.parentElement;
  if (
    llmModelSelect.value === getModelName(LLMEngineType.Ollama) ||
    llmModelSelect.value === getModelName(LLMEngineType.ChromeAI)
  ) {
    apiKeyInput.disabled = true;
    apiKeyInput.placeholder =
      llmModelSelect.value === getModelName(LLMEngineType.Ollama)
        ? 'No API key required for Ollama! Ensure Ollama is installed locally on your system.'
        : 'No API key required for Chrome AI';
    apiKeyContainer?.classList.add('warning');
    apiKeyInput.value = '';
  } else {
    apiKeyInput.disabled = false;
    apiKeyInput.placeholder = '';
    apiKeyContainer?.classList.remove('warning');
  }
}

export {
  updateConsensusApiLink,
  updateApiKeyLink,
  updateConsensusApiLinks,
  updateApiKeyInputField,
};
