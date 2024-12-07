import { DEFAULT_PROPERTIES } from '@utils/defaultProperties';
import {
  loadProfiles,
  saveSelectedProfileKey,
  deleteProfile,
  saveCustomProfile,
  getSelectedProfileKey,
} from '@utils/storage/profiles/profileManager';

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
  const cardsContainer = document.createElement('div');
  cardsContainer.className = 'profile-cards';

  const profilesContainer = document.createElement('div');
  profilesContainer.className = 'profiles-container';

  const selectedProfileKey = await getSelectedProfileKey();
  Object.entries(profiles).forEach(([profileKey, profile]) => {
    const card = document.createElement('div');
    card.className = 'profile-card';
    if (profileKey === selectedProfileKey) {
      card.classList.add('selected');
    }

    card.innerHTML = `<div class="card-icons">
      <div class="delete-mark ${profiles[profileKey]?.is_custom === false ? 'hidden' : ''}">
          ×
      </div>
      <div class="icon-group">
          <div class="${profileKey === selectedProfileKey ? 'edit-mark-selected' : 'edit-mark'} ${profiles[profileKey]?.is_custom === false ? 'hidden' : ''}">✎</div>
          <div class="tick-mark ${profileKey === selectedProfileKey ? '' : 'hidden'}">✓</div>
      </div>
    </div>
    <img loading="lazy" src="${profile.image_url}" alt="${profile.name}" class="profile-image">
    <h3>${profile.name}</h3>
    <p>${profile.short_description}</p>`;

    // Add the edit button handler
    const editButton = card.querySelector('.edit-mark, .edit-mark-selected');
    if (editButton) {
      editButton.addEventListener('click', (e) => {
        e.stopPropagation();
        const modal = document.getElementById('addProfileModal');
        const form = document.getElementById(
          'addProfileForm',
        ) as HTMLFormElement;
        if (modal && form) {
          (form.querySelector('#profileName') as HTMLInputElement).value =
            profile.name;
          (form.querySelector('#profileImage') as HTMLInputElement).value =
            profile.image_url;
          (form.querySelector('#profilePrompt') as HTMLTextAreaElement).value =
            profile.system_prompt;
          (
            form.querySelector('#profileShortDescription') as HTMLInputElement
          ).value = profile.short_description;

          modal.classList.remove('hidden');

          form.onsubmit = async (submitEvent) => {
            submitEvent.preventDefault();
            const updatedProfile: Profile = {
              name: (form.querySelector('#profileName') as HTMLInputElement)
                .value,
              image_url: (
                form.querySelector('#profileImage') as HTMLInputElement
              ).value,
              system_prompt: (
                form.querySelector('#profilePrompt') as HTMLTextAreaElement
              ).value,
              short_description: (
                form.querySelector(
                  '#profileShortDescription',
                ) as HTMLInputElement
              ).value,
              is_custom: true,
            };
            try {
              await saveCustomProfile(updatedProfile);
              await deleteProfile(profileKey);
              modal.classList.add('hidden');
              form.reset();
              await createProfileCards();
            } catch {
              alert('Failed to update profile. Please try again.');
            }
          };
        }
      });
    }

    card.addEventListener('click', () => {
      (async () => {
        document.querySelectorAll('.profile-card').forEach((c) => {
          c.classList.remove('selected');
          const tickMark = c.querySelector('.tick-mark');
          const editMark = c.querySelector('.edit-mark-selected, .edit-mark');
          if (tickMark) {
            tickMark.classList.add('hidden');
          }
          if (editMark) {
            editMark.className = editMark.className.replace(
              'edit-mark-selected',
              'edit-mark',
            );
          }
        });
        card.classList.add('selected');
        const tickMark = card.querySelector('.tick-mark');
        const editMark = card.querySelector('.edit-mark');
        if (tickMark) {
          tickMark.classList.remove('hidden');
        }
        if (editMark && !editMark.classList.contains('hidden')) {
          editMark.className = editMark.className.replace(
            'edit-mark',
            'edit-mark-selected',
          );
        }
        await saveSelectedProfileKey(profileKey);
      })().catch((error) => {
        handleError('Failed to save selected profile key:', error);
      });
    });

    const deleteButton = card.querySelector('.delete-mark');
    if (deleteButton) {
      deleteButton.addEventListener('click', (e) => {
        e.stopPropagation();
        (async () => {
          try {
            await deleteProfile(profileKey);
            await createProfileCards();
          } catch (error) {
            handleError('Failed to delete profile:', error);
          }
        })().catch((error) => {
          handleError('Unexpected error:', error);
        });
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

function showAddProfileModal() {
  const modal = document.getElementById('addProfileModal');

  if (modal) {
    modal.classList.remove('hidden');
  }
}

async function handleProfileFormSubmit(submitEvent: Event) {
  submitEvent.preventDefault();
  const form = submitEvent.target as HTMLFormElement;
  const imageUrl = (form.querySelector('#profileImage') as HTMLInputElement)
    .value;

  // Use the dummy image URL if no image URL is provided
  const defaultImageUrl = DEFAULT_PROPERTIES.defaultProfile.image_url;

  const newProfile: Profile = {
    name: (form.querySelector('#profileName') as HTMLInputElement).value,
    image_url: imageUrl.trim() || defaultImageUrl,
    system_prompt: (form.querySelector('#profilePrompt') as HTMLTextAreaElement)
      .value,
    short_description: (
      form.querySelector('#profileShortDescription') as HTMLInputElement
    ).value,
    is_custom: true,
  };

  try {
    await saveCustomProfile(newProfile);
    const modal = document.getElementById('addProfileModal');
    if (modal) {
      modal.classList.add('hidden');
    }
    form.reset();
    await createProfileCards();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
  } catch (error) {
    alert('Failed to save profile. Please try again.');
  }
}

function handleError(message: string, error: unknown) {
  // Custom error handling logic
  alert(`${message} ${String(error)}`);
}

export { createProfileCards, showAddProfileModal, handleProfileFormSubmit };
