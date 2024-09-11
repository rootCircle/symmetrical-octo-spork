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
        // Temporary error message for unsupported websites!
        const errorMsg = document.createElement('p');
        errorMsg.textContent = 'Website not supported!!!';
        document.body.appendChild(errorMsg);
      }
    },
  );
}

// Listen for DOMContentLoaded event to ensure the button is loaded
document.addEventListener('DOMContentLoaded', listenFillFormAction);

document.addEventListener('DOMContentLoaded', () => {
  const fillerButton =
    document.querySelector<HTMLButtonElement>('#filler_button');
  if (fillerButton) {
    fillerButton.addEventListener('click', () => {
      chrome.runtime
        .sendMessage({ data: 'FILL_FORM' })
        .then(() => {})
        .catch(() => {});
    });
  }
});
