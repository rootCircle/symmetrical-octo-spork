async function setSkipMarkedStatus(
  skipMarkedToggle: HTMLElement,
  currentState: boolean,
): Promise<void> {
  const newState = !currentState;

  return new Promise<void>((resolve, reject) => {
    chrome.storage.sync.set({ skipMarkedQuestions: newState }, () => {
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError.message));
      } else {
        skipMarkedToggle.classList.toggle('active', newState);
        resolve();
      }
    });
  });
}

export { setSkipMarkedStatus };
