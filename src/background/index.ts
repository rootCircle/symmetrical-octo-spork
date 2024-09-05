import { runDocFillerEngine } from '@docFillerCore/index';

console.log('Hello from background script!');

// TODO:  Fix not working!
// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
//   if (message.data === 'FILL_FORM') {
//     runDocFillerEngine();
//     message.data = null;
//     console.log('FILL_FORM message received');
//   }
// });
