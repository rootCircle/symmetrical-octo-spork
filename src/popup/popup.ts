/* eslint-disable no-console */
function listenFillFormAction(): void {
  const fillerButton =
    document.querySelector<HTMLButtonElement>('#filler_button');

  if (!fillerButton) {
    console.error('Filler button not found.');
    return;
  }

  chrome.tabs.query(
    {
      active: true,
      currentWindow: true,
      url: '*://*.docs.google.com/*',
    },
    (tabs) => {
      if (tabs.length > 0) {
        fillerButton.addEventListener('click', () => {
          if (tabs && tabs[0] && tabs[0].id !== undefined) {
            chrome.scripting
              .executeScript({
                target: { tabId: tabs[0].id },
                func: () => {
                  chrome.runtime
                    .sendMessage({ data: 'FILL_FORM' })
                    .then(() => {})
                    .catch(() => {});
                },
              })
              .then(() => {})
              .catch(() => {});
          } else {
            console.error('Tab ID is undefined.');
          }
        });
      } else {
        const errorMsg = document.createElement('p');
        errorMsg.textContent = 'Website not supported!!!';
        document.body.appendChild(errorMsg);
      }
    },
  );
}
document.addEventListener('DOMContentLoaded', () => {
  const toggleButton = document.getElementById('toggleButton');
  const toggleOn = toggleButton?.querySelector('.toggle-on') as HTMLElement;
  const toggleOff = toggleButton?.querySelector('.toggle-off') as HTMLElement;
  const fillSection = document.querySelector<HTMLElement>(
    '.button-section-vertical-right',
  );
  const refreshButton = document.querySelector<HTMLElement>(
    '.button-section-vertical-left',
  );
  let previousState = false;

  if (
    !toggleButton ||
    !toggleOn ||
    !toggleOff ||
    !refreshButton ||
    !fillSection
  ) {
    console.error('Required elements not found');
    return;
  }

  refreshButton.style.display = 'none';
  fillSection.style.display = 'none';

  chrome.storage.sync.get(['isEnabled'], (items) => {
    const isEnabled = (items['isEnabled'] as boolean) ?? false;
    previousState = isEnabled;
    updateToggleState(isEnabled);
  });

  toggleButton.addEventListener('click', () => {
    const saveState = async () => {
      try {
        await new Promise<void>((resolve, reject) => {
          chrome.storage.sync.get(['isEnabled'], (items) => {
            const newState = !(items['isEnabled'] ?? true);
            chrome.storage.sync.set({ isEnabled: newState }, () => {
              if (chrome.runtime.lastError) {
                reject(new Error(chrome.runtime.lastError.message));
              } else {
                if (previousState !== newState) {
                  refreshButton.style.display = 'flex';
                }
                previousState = newState;
                updateToggleState(newState);
                console.log('State successfully saved:', newState);
                resolve();
              }
            });
          });
        });
      } catch (error) {
        console.error(
          `Error saving state. ${error instanceof Error ? error.message : String(error)}`,
        );
      }
    };

    void saveState();
  });

  refreshButton.addEventListener('click', () => {
    chrome.tabs.reload().catch((error) => {
      console.error('Failed to reload tab:', error);
    });
  });

  function updateToggleState(isEnabled: boolean): void {
    toggleOn.style.display = isEnabled ? 'block' : 'none';
    toggleOff.style.display = isEnabled ? 'none' : 'block';
    if (fillSection) {
      fillSection.style.display = isEnabled ? 'none' : 'flex';
    }
  }
});

document.addEventListener('DOMContentLoaded', listenFillFormAction);
