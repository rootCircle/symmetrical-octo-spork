import { runDocFillerEngine } from '@docFillerCore/index';
import { LLMEngine } from '@docFillerCore/engines/gptEngine';
import { CURRENT_LLM_MODEL } from '@utils/constant';

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // TODO:  Fix not working!

  //   if (message.data === 'FILL_FORM') {
  //     runDocFillerEngine().then(() => {
  //       console.log('FILL_FORM message received');
  //     });
  //     message.data = null;
  //   }

  if (message.type === 'API_CALL') {
    LLMEngine.getInstance(CURRENT_LLM_MODEL)
      .invokeLLM(message.prompt, message.questionType)
      .then((response) => {
        sendResponse({ value: response });
      });
  }

  return true;
});
