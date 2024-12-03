/* eslint-disable no-unused-vars */
import { v4 } from 'uuid';
import { DEFAULT_PROPERTIES } from '@utils/defaultProperties';
import LLMEngineType, {
  getAPIPlatformSourceLink,
  getModelName,
  getModelTypeFromName,
} from '@utils/llmEngineTypes';
import { EMPTY_STRING } from '@utils/settings';

interface Profile {
  prompt: string;

  image_url: string;

  name: string;

  description: string;

  short_description: string;
}

interface Profiles {
  [key: string]: Profile;
}

// Default profiles data

const profilesData: Profiles = {
  andy: {
    prompt: 'Help me with coding tasks',

    image_url: 'https://randomuser.me/api/portraits/men/1.jpg',

    name: 'Andy Developer',

    description: 'Full stack developer with expertise in React and Node.js',

    short_description: 'Full Stack Developer',
  },
};

// Function to load profiles from Chrome storage

async function loadProfiles(): Promise<Profiles> {
  return new Promise((resolve) => {
    chrome.storage.sync.get(['customProfiles'], (result) => {
      const customProfiles: Profiles =
        (result['customProfiles'] as Profiles) || {};

      const mergedProfiles = {
        ...profilesData,
        ...customProfiles,
      };

      resolve(mergedProfiles);
    });
  });
}

// Function to save custom profile

async function saveCustomProfile(profile: Profile): Promise<void> {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get(['customProfiles'], (result) => {
      const customProfiles: Profiles =
        (result['customProfiles'] as Profiles) || {};

      const profileKey = v4();

      const updatedProfiles = {
        ...customProfiles,

        [profileKey]: profile,
      };

      chrome.storage.sync.set(
        {
          customProfiles: updatedProfiles,

          selectedProfileKey: profileKey,
        },
        () => {
          if (chrome.runtime.lastError) {
            reject(
              new Error(
                chrome.runtime.lastError?.message || 'Unknown error occurred',
              ),
            );
          } else {
            resolve();
          }
        },
      );
    });
  });
}

// Function to delete profile
async function deleteProfile(profileKey: string): Promise<void> {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get(
      ['customProfiles', 'selectedProfileKey'],
      (result) => {
        const customProfiles: Profiles =
          (result['customProfiles'] as Profiles) || {};
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { [profileKey]: deletedProfile, ...remainingProfiles } =
          customProfiles;

        const updates: Record<string, Profiles | string> = {
          customProfiles: remainingProfiles,
        };

        if (result['selectedProfileKey'] === profileKey) {
          updates['selectedProfileKey'] = '';
        }

        chrome.storage.sync.set(updates, () => {
          if (chrome.runtime.lastError) {
            reject(
              new Error(
                chrome.runtime.lastError.message || 'Failed to delete profile',
              ),
            );
          } else {
            resolve();
          }
        });
      },
    );
  });
}

// Function to save selected profile key

async function saveSelectedProfileKey(profileKey: string): Promise<void> {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.set({ selectedProfileKey: profileKey }, () => {
      if (chrome.runtime.lastError) {
        reject(
          new Error(
            chrome.runtime.lastError?.message || 'Unknown error occurred',
          ),
        );
      } else {
        resolve();
      }
    });
  });
}

// Function to create profile cards

async function createProfileCards() {
  const container = document.querySelector('.container');

  if (!container) {
    return;
  }

  const existingProfilesContainer = container.querySelector(
    '.profiles-container',
  );

  if (existingProfilesContainer) {
    existingProfilesContainer.remove();
  }

  const profiles = await loadProfiles();

  const profilesContainer = document.createElement('div');

  profilesContainer.className = 'profiles-container';

  const cardsContainer = document.createElement('div');

  cardsContainer.className = 'profile-cards';

  const selectedProfileKey = await new Promise<string>((resolve) => {
    chrome.storage.sync.get(['selectedProfileKey'], (result) => {
      resolve((result['selectedProfileKey'] as string) || EMPTY_STRING);
    });
  });

  Object.entries(profiles).forEach(([profileKey, profile]) => {
    const card = document.createElement('div');

    card.className = 'profile-card';

    if (profileKey === selectedProfileKey) {
      card.classList.add('selected');
    }

    card.innerHTML = `

      <div class="card-icons">

        <div class="delete-mark ${profileKey === 'andy' ? 'hidden' : ''}">×</div>

        <div class="tick-mark ${profileKey === selectedProfileKey ? '' : 'hidden'}">✓</div>

      </div>

      <img src="${profile.image_url}" alt="${profile.name}" class="profile-image">

      <h3>${profile.name}</h3>

      <p>${profile.short_description}</p>

    `;

    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    card.addEventListener('click', async () => {
      document.querySelectorAll('.profile-card').forEach((c) => {
        c.classList.remove('selected');

        const tickMark = c.querySelector('.tick-mark');

        if (tickMark) {
          tickMark.classList.add('hidden');
        }
      });

      card.classList.add('selected');

      const tickMark = card.querySelector('.tick-mark');

      if (tickMark) {
        tickMark.classList.remove('hidden');
      }

      await saveSelectedProfileKey(profileKey);
    });

    const deleteButton = card.querySelector('.delete-mark');

    if (deleteButton) {
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      deleteButton.addEventListener('click', async (e) => {
        e.stopPropagation();

        if (confirm('Are you sure you want to delete this profile?')) {
          await deleteProfile(profileKey);

          await createProfileCards();
        }
      });
    }

    cardsContainer.appendChild(card);
  });

  const addCard = document.createElement('div');

  addCard.className = 'profile-card add-profile';

  addCard.innerHTML = `

    <div class="add-profile-content">

      <div class="add-icon">+</div>

      <p>Add New Profile</p>

    </div>

  `;

  addCard.addEventListener('click', showAddProfileModal);

  cardsContainer.appendChild(addCard);

  profilesContainer.appendChild(cardsContainer);

  container.insertBefore(profilesContainer, container.firstChild);
}

// Function to show add profile modal

function showAddProfileModal() {
  const modal = document.getElementById('addProfileModal');

  if (modal) {
    modal.classList.remove('hidden');
  }
}

// Handle form submission

async function handleProfileFormSubmit(submitEvent: Event) {
  submitEvent.preventDefault();

  const form = submitEvent.target as HTMLFormElement;
  const imageUrl = (form.querySelector('#profileImage') as HTMLInputElement)
    .value;

  // Use the dummy image URL if no image URL is provided
  const defaultImageUrl = 'https://w.wallhaven.cc/full/5g/wallhaven-5gxvv3.png';

  const newProfile: Profile = {
    name: (form.querySelector('#profileName') as HTMLInputElement).value,
    image_url: imageUrl.trim() || defaultImageUrl, // Use default if empty
    prompt: (form.querySelector('#profilePrompt') as HTMLTextAreaElement).value,
    description: (
      form.querySelector('#profileDescription') as HTMLTextAreaElement
    ).value,
    short_description: (
      form.querySelector('#profileShortDescription') as HTMLInputElement
    ).value,
  };

  try {
    await saveCustomProfile(newProfile);
    const modal = document.getElementById('addProfileModal');
    if (modal) {
      modal.classList.add('hidden');
    }
    form.reset();
    await createProfileCards();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    alert('Failed to save profile. Please try again.');
  }
}

// Initialize the application

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

            <label for="profileDescription">Description</label>

            <textarea id="profileDescription" required></textarea>

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
      updateSingleApiKeyInput();
    },
  );

  llmModelSelect.addEventListener('change', () => {
    const apiKeyInput = document.getElementById(
      'singleApiKey',
    ) as HTMLInputElement;

    const apiKeyContainer = apiKeyInput.parentElement;
    if (
      llmModelSelect.value === 'Ollama' ||
      llmModelSelect.value === 'ChromeAI'
    ) {
      apiKeyInput.disabled = true;
      apiKeyInput.placeholder =
        llmModelSelect.value === 'Ollama'
          ? 'No API key required for Ollama! Ensure Ollama is installed locally on your system.'
          : 'No API key required for Chrome AI';
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
    if (
      llmModelSelect.value === 'Ollama' ||
      llmModelSelect.value === 'ChromeAI'
    ) {
      const apiKeyInput = document.getElementById(
        'singleApiKey',
      ) as HTMLInputElement;

      const apiKeyContainer = apiKeyInput.parentElement;

      apiKeyInput.disabled = true;
      apiKeyInput.placeholder =
        llmModelSelect.value === 'Ollama'
          ? 'No API key required for Ollama'
          : 'No API key required for Chrome AI';
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
      updateConsensusApiLink('chromeAIApiKey', 'ChromeAI');
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
