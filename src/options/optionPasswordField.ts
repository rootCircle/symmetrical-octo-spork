export const initializeOptionPasswordField = () => {
  document.querySelectorAll('[id^="toggle"]').forEach(function (toggle) {
    toggle.addEventListener('click', function () {
      const targetID = toggle.getAttribute('for');
      if (!targetID) {
        return;
      }
      const inputField = document.getElementById(targetID) as HTMLInputElement;
      if (!inputField) {
        return;
      }
      const type = inputField.type === 'password' ? 'text' : 'password';
      inputField.type = type;

      toggle.textContent = type === 'password' ? '👁️' : '🙈';
    });
  });
};
