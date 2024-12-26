import { DEFAULT_PROPERTIES } from '@utils/defaultProperties';
import { v4 } from 'uuid';

import { profilesData } from './profilesData';

async function loadProfiles(): Promise<Profiles> {
  return new Promise((resolve) => {
    chrome.storage.sync.get(['customProfiles'], (result) => {
      const customProfiles: Profiles =
        // biome-ignore lint/complexity/useLiteralKeys: <explanation>
        (result['customProfiles'] as Profiles) || {};

      const mergedProfiles = {
        [DEFAULT_PROPERTIES.defaultProfileKey]:
          DEFAULT_PROPERTIES.defaultProfile,
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
        // biome-ignore lint/complexity/useLiteralKeys: <explanation>
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
          // biome-ignore lint/complexity/useLiteralKeys: <explanation>
          (result['customProfiles'] as Profiles) || {};
        const { [profileKey]: deletedProfile, ...remainingProfiles } =
          customProfiles;

        const updates: Record<string, Profiles | string> = {
          customProfiles: remainingProfiles,
        };

        // biome-ignore lint/complexity/useLiteralKeys: <explanation>
        if (result['selectedProfileKey'] === profileKey) {
          // biome-ignore lint/complexity/useLiteralKeys: <explanation>
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
      resolve(
        // biome-ignore lint/complexity/useLiteralKeys: <explanation>
        (result['selectedProfileKey'] as string) ??
        DEFAULT_PROPERTIES.defaultProfileKey,
      );
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
