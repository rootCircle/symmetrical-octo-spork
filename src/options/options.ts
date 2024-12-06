import { DEFAULT_PROPERTIES } from '@utils/defaultProperties';
import LLMEngineType, { getModelName } from '@utils/llmEngineTypes';
import { EMPTY_STRING } from '@utils/settings';

import {
  createProfileCards,
  handleProfileFormSubmit,
} from './optionProfileHandler';
import {
  updateApiKeyInputField,
  updateApiKeyLink,
  updateConsensusApiLinks,
} from './optionApiHandler';
import { initializeOptionPasswordField } from './optionPasswordField';

document.addEventListener('DOMContentLoaded', () => {
  const modalHTML = `
    <div id="addProfileModal" class="modal hidden">
      <div class="modal-content">
        <span class="close-button">&times;</span>
        <h2>Add New Profile</h2>
        <form id="addProfileForm" autocomplete="off">
          <div class="form-group">
            <label for="profileName">Name</label>
            <input type="text" id="profileName" required>
          </div>
          <div class="form-group">
            <label for="profileImage">Image URL</label>
            <input type="url" id="profileImage" type="url" autocomplete="off" placeholder="https://w.wallhaven.cc/full/5g/wallhaven-5gxvv3.png" value="https://w.wallhaven.cc/full/5g/wallhaven-5gxvv3.png" >
          </div>
          <div class="form-group">
            <label for="profilePrompt">Prompt</label>
            <textarea id="profilePrompt" required></textarea>
          </div>
          <div class="form-group">
            <label for="profileShortDescription">Short Description</label>
            <input type="text" id="profileShortDescription" required>
          </div>
          <div class="form-actions">
            <button type="submit">Save Profile</button>
            <button type="button" class="cancel-button">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', modalHTML);

  createProfileCards()
    .then(() => {
      const modal = document.getElementById('addProfileModal');
      const closeButton = modal?.querySelector('.close-button');
      const cancelButton = modal?.querySelector('.cancel-button');
      const addProfileForm = document.getElementById('addProfileForm');

      closeButton?.addEventListener('click', () => {
        if (modal) {
          modal.classList.add('hidden');
        }
      });

      cancelButton?.addEventListener('click', () => {
        if (modal) {
          modal.classList.add('hidden');
        }
      });

      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      addProfileForm?.addEventListener('submit', handleProfileFormSubmit);

      modal?.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.classList.add('hidden');
        }
      });
    })
    .catch(() => {});
});

// Settings related event listeners

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
  const weightChromeAIInput = document.getElementById(
    'weightChromeAI',
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
  const modelSelect = document.getElementById('llmModel') as HTMLSelectElement;
  const apiKeyInputLink = document.getElementById(
    'singleApiKeyLink',
  ) as HTMLAnchorElement;

  initializeOptionPasswordField();

  modelSelect.addEventListener('change', () => {
    updateApiKeyLink(modelSelect, apiKeyInputLink);
  });
  enableConsensusCheckbox.addEventListener('change', () => {
    updateConsensusApiLinks(enableConsensusCheckbox);
  });

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

      updateApiKeyInputField(singleApiKeyInput, llmModelSelect);

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
      weightChromeAIInput.value = String(weights[LLMEngineType.ChromeAI]);
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

      // Initial call to set up the form when it loads
      updateApiKeyLink(modelSelect, apiKeyInputLink);
      updateConsensusApiLinks(enableConsensusCheckbox);
      updateSingleApiKeyInput(llmModelSelect.value);
    },
  );

  llmModelSelect.addEventListener('change', () => {
    const apiKeyInput = document.getElementById(
      'singleApiKey',
    ) as HTMLInputElement;

    updateApiKeyInputField(apiKeyInput, llmModelSelect);

    updateSingleApiKeyInput(llmModelSelect.value);
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

  const updateSingleApiKeyInput = (selectedModel: string) => {
    let apiKeyValue = '';

    switch (selectedModel) {
      case 'ChatGPT':
        apiKeyValue = chatGptApiKeyInput.value;
        break;
      case 'Gemini':
        apiKeyValue = geminiApiKeyInput.value;
        break;
      case 'Ollama':
      case 'ChromeAI':
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
      case 'ChromeAI':
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
    updateSingleApiKeyInput(llmModelSelect.value);
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
        [LLMEngineType.ChromeAI]: parseFloat(weightChromeAIInput.value),
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
