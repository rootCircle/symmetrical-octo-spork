// Ensure you have the necessary type definitions in your tsconfig.json
// and have installed @types/webextension-polyfill

function listenFillFormAction(): void {
  // Select the filler-button
  const fillerButton =
    document.querySelector<HTMLButtonElement>('#filler_button');

  if (!fillerButton) {
    console.error('Filler button not found.');
    return;
  }

  // Query the active tab in the current window
  browser.tabs
    .query({
      active: true,
      currentWindow: true,
      url: '*://*.docs.google.com/*',
    })
    .then((tabs) => {
      if (tabs && tabs.length > 0) {
        // Attach the event listener
        fillerButton.addEventListener('click', () => {
          if (tabs[0].id !== undefined) {
            // Send a message to the current tab content script
            browser.tabs.sendMessage(tabs[0].id, {
              data: 'FILL_FORM',
            });
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
    })
    .catch((err: any) => {
      // Handle errors
      const errorMsg = document.createElement('p');
      errorMsg.textContent = `Error: ${err.message}`;
      document.body.appendChild(errorMsg);
    });
}

// On opening the extension
browser.tabs
  .executeScript({ file: '/background/index.js' })
  .then(listenFillFormAction)
  .catch((err: any) => {
    // Error reporting
    const errorMsg = document.createElement('p');
    errorMsg.textContent = `Error: ${err.message}`;
    document.body.appendChild(errorMsg);
  });
