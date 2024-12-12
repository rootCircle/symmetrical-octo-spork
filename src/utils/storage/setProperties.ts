import { getSkipMarkedStatus } from './getProperties';

export async function setSkipMarkedStatus(): Promise<void> {
  const currentState = await getSkipMarkedStatus();
  const newState = !currentState;
  await chrome.storage.sync.set({ skipMarkedQuestions: newState });
}
