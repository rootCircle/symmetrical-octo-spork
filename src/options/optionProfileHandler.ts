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
  const profilesContainer = document.createElement('div');
  profilesContainer.className = 'profiles-container';
  const cardsContainer = document.createElement('div');
  cardsContainer.className = 'profile-cards';

  const selectedProfileKey = await getSelectedProfileKey();

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
  const defaultImageUrl = DEFAULT_PROPERTIES.profileAvatarImage;

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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
  } catch (error) {
    alert('Failed to save profile. Please try again.');
  }
}

export { createProfileCards, showAddProfileModal, handleProfileFormSubmit };
