import { v4 } from 'uuid';
import { EMPTY_STRING } from '@utils/settings';

import { profilesData } from './profilesData';

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

async function deleteProfile(profileKey: string): Promise<void> {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get(
      ['customProfiles', 'selectedProfileKey'],
      (result) => {
        const customProfiles: Profiles =
          (result['customProfiles'] as Profiles) || {};
        // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
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

async function getSelectedProfileKey() {
  return await new Promise<string>((resolve) => {
    chrome.storage.sync.get(['selectedProfileKey'], (result) => {
      resolve((result['selectedProfileKey'] as string) || EMPTY_STRING);
    });
  });
}

export {
  loadProfiles,
  saveCustomProfile,
  deleteProfile,
  saveSelectedProfileKey,
  getSelectedProfileKey,
};
