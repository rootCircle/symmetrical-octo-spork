/* eslint-disable no-console */

import { runDocFillerEngine } from '@docFillerCore/index';
import { DEFAULT_PROPERTIES } from '@utils/defaultProperties';
import {
  getSelectedProfileKey,
  loadProfiles,
} from '@utils/storage/profiles/profileManager';
import { validateLLMConfiguration } from '@utils/missingApiKey';
import { showToast } from '@utils/toastUtils';

document.addEventListener('DOMContentLoaded', () => {
  let previousState = false;
  chrome.storage.sync.get(['automaticFillingEnabled'], (items) => {
    const automaticFillingEnabled =
      (items['automaticFillingEnabled'] as boolean) ??
      DEFAULT_PROPERTIES.automaticFillingEnabled;
    previousState = automaticFillingEnabled;
    updateToggleState(automaticFillingEnabled);
  });
  const toggleButton = document.getElementById('toggleButton');
  const toggleOn = toggleButton?.querySelector('.toggle-on') as HTMLElement;
  const toggleOff = toggleButton?.querySelector('.toggle-off') as HTMLElement;
  const fillSection = document.querySelector<HTMLElement>(
    '.button-section-vertical-right',
  );
  const refreshButton = document.querySelector<HTMLElement>(
    '.button-section-vertical-left',
  );
  const apiMessage = document.querySelector('.api-message') as HTMLElement;
  const apiMessageText = apiMessage?.querySelector(
    '.api-message-text',
  ) as HTMLElement;

  if (
    !toggleButton ||
    !toggleOn ||
    !toggleOff ||
    !refreshButton ||
    !fillSection ||
    !apiMessage ||
    !apiMessageText
  ) {
    console.error('Required elements not found');
    return;
  }

  refreshButton.style.display = 'none';
  fillSection.style.display = 'none';

  async function checkAndUpdateApiMessage() {
    type ValidationResult = {
      invalidEngines: string[];
      isConsensusEnabled: boolean;
    };
    const validation = (await validateLLMConfiguration()) as ValidationResult;
    let multiple = '';
    if (validation.invalidEngines.length > 1) {
      multiple = 's';
    }
    if (validation.invalidEngines.length > 0) {
      apiMessage.style.display = 'block';
      if (validation.isConsensusEnabled) {
        apiMessageText.textContent = `Please add API keys in Options for the required model${multiple} (${validation.invalidEngines.join(', ')}) or set their weight${multiple} to 0 in consensus settings`;
      } else {
        apiMessageText.textContent =
          'Please add an API key in Options to use DocFiller';
      }
      if (toggleButton) {
        toggleOn.style.cursor = 'not-allowed';
        toggleOff.style.cursor = 'not-allowed';

      }
    } else {
      apiMessage.style.display = 'none';
      toggleButton?.classList.remove('disabled');
      if (toggleButton) {
        toggleOn.style.cursor = 'pointer';
          toggleOff.style.cursor = 'pointer';
        }
    }
  }
  toggleButton.addEventListener('click', () => {
    const saveState = async () => {
      try {
        await new Promise<void>((resolve, reject) => {
          chrome.storage.sync.get(['automaticFillingEnabled'], (items) => {
            const newState = !(
              items['automaticFillingEnabled'] ??
              DEFAULT_PROPERTIES.automaticFillingEnabled
            );
            chrome.storage.sync.set(
              { automaticFillingEnabled: newState },
              () => {
                if (chrome.runtime.lastError) {
                  reject(new Error(chrome.runtime.lastError.message));
                } else {
                  if (previousState !== newState) {
                    refreshButton.style.display = 'flex';
                  }
                  previousState = newState;
                  updateToggleState(newState);
                  resolve();
                }
              },
            );
          });
        });
        await checkAndUpdateApiMessage();
      } catch (error) {
        console.error(
          `Error saving state. ${error instanceof Error ? error.message : String(error)}`,
        );
      }
    };

    void saveState();
  });

  fillSection.addEventListener('click', () => {

    // Show toast when fill action starts

    showToast('Starting auto-fill process...', 'info');


    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {

        const tab = tabs[0];


        chrome.scripting

            .executeScript({

                target: { tabId: tab?.id || 0 },

                func: runDocFillerEngine,

            })

            .then(() => {

                // Show success toast when fill completes

                showToast('Auto-fill completed successfully!', 'success');

            })

            .catch((error) => {

                // Show error toast if fill fails

                showToast(`Auto-fill failed: ${error}`, 'error');

                console.error(error);

            });

    });


    runDocFillerEngine().catch((error) => {

        showToast(`Auto-fill failed: ${error}`, 'error');

        console.error(error);

    });

});


refreshButton.addEventListener('click', () => {


    showToast('Refreshing page...', 'info');


    chrome.tabs.reload().catch((error) => {


        showToast(`Failed to refresh: ${error}`, 'error');

        console.error('Failed to reload tab:', error);

    });

});

  function updateToggleState(isEnabled: boolean): void {
    toggleOn.style.display = isEnabled ? 'block' : 'none';
    toggleOff.style.display = isEnabled ? 'none' : 'block';
    if (fillSection) {
        fillSection.style.display = isEnabled ? 'none' : 'flex';
    }

    if (isEnabled) {
        showToast('Power On', 'success');
    } else {
        showToast('Power Off', 'error');
    }
}

  async function fillProfile() {
    const imageUrlInput = document.querySelector(
      '.profile-avatar img',
    ) as HTMLImageElement;
    const nameElement = document.querySelector('.profile-name') as HTMLElement;

    const selectedProfileKey = await getSelectedProfileKey();
    const profiles = await loadProfiles();

    imageUrlInput.src =
      profiles[selectedProfileKey]?.image_url ??
      DEFAULT_PROPERTIES.defaultProfile.image_url;

    nameElement.textContent =
      profiles[selectedProfileKey]?.name ??
      DEFAULT_PROPERTIES.defaultProfile.name;
  }

  Promise.all([checkAndUpdateApiMessage(), fillProfile()]).catch(console.error);
});
