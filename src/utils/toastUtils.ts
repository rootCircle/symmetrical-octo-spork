export function showToast(message: string, type: 'success' | 'error' | 'info' = 'info', duration: number = 3000) {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toast-message');
    if (!toast || !toastMessage) {
      // eslint-disable-next-line no-console
      console.error('Toast elements not found');
      return;
    }
    toastMessage.textContent = message;
    toast.className = `toast ${type}`;
    setTimeout(() => {
      toast.classList.add('show');
    }, 100);
    setTimeout(() => {
      toast.classList.remove('show');
    }, duration);
  }