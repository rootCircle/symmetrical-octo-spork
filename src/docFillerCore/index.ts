/* eslint-disable no-console */
import { DetectBoxType } from '@docFillerCore/detectors/detectBoxType';
import { FieldExtractorEngine } from '@docFillerCore/engines/fieldExtractorEngine';
import { ValidatorEngine } from '@docFillerCore/engines/validatorEngine';
import { QuestionExtractorEngine } from '@docFillerCore/engines/questionExtractorEngine';
import { PromptEngine } from '@docFillerCore/engines/promptEngine';
import { FillerEngine } from '@docFillerCore/engines/fillerEngine';
import { LLMEngine } from '@docFillerCore/engines/gptEngine';
import { Settings } from '@utils/settings';
import { ConsensusEngine } from '@docFillerCore/engines/consensusEngine';
import { MarkedQuestionChecker } from '@docFillerCore/engines/markedQuestionChecker';
import { DEFAULT_PROPERTIES } from '@utils/defaultProperties';

async function runDocFillerEngine() {
  const questions = new QuestionExtractorEngine().getValidQuestions();

  const checker = new DetectBoxType();
  const fields = new FieldExtractorEngine();
  const prompts = new PromptEngine();
  const validator = new ValidatorEngine();
  const filler = new FillerEngine();
  const ismarked = new MarkedQuestionChecker();
  const enableConsensus = await Settings.getInstance().getEnableConsensus();
  let consensusEngine;
  let llm;
  if (enableConsensus) {

    consensusEngine = new ConsensusEngine();
  } else {
    try {
      llm = new LLMEngine(await Settings.getInstance().getCurrentLLMModel());
    } catch (e) {
      console.error(e);
      return;
    }
  }
  const skipMarkedSetting = await new Promise<boolean>((resolve) => {
    const defaultSkipMarked = DEFAULT_PROPERTIES.skipMarkedQuestions;
    chrome.storage.sync.get(['skipMarkedQuestions'], (items) => {
      resolve(
        typeof items['skipMarkedQuestions'] === 'boolean'
          ? items['skipMarkedQuestions']
          : defaultSkipMarked,
      );
    });
  });

  for (const question of questions) {
    try {
      const fieldType = checker.detectType(question);

      if (fieldType !== null) {
        const fieldValue = fields.getFields(question, fieldType);
        console.log(question);

        console.log(`Field Type : ${fieldType}`);
        console.log('Fields ↴');

        console.log('Field Value ↴');
        console.log(fieldValue);

        const isFilled = ismarked.markedCheck(fieldType, fieldValue);

        console.log('Is Already Filled ↴');
        console.log(isFilled);

        if (skipMarkedSetting && isFilled) {
          question.style.opacity = '0.6';
          console.log('Skipping already marked question:', question);
          continue;
        }

        const promptString = prompts.getPrompt(fieldType, fieldValue);
        console.log('Prompt ↴');
        console.log(promptString);

        let response = null;

        if (enableConsensus && consensusEngine) {
          response = await consensusEngine.generateAndValidate(
            promptString,
            fieldValue,
            fieldType,
          );
        } else if (llm) {
          response = await llm.getResponse(promptString, fieldType, llm.engine);
        }

        console.log('LLM Response ↴');
        console.log(response);

        if (response === null) {
          console.log('No response from LLM');
          continue;
        }
        const parsed_response = validator.validate(
          fieldType,
          fieldValue,
          response,
        );
        console.log(`Parsed Response : ${parsed_response}`);

        if (parsed_response) {
          const fillerStatus = await filler.fill(
            fieldType,
            fieldValue,
            response,
          );
          console.log(`Filler Status ${fillerStatus}`);
        }

        console.log();
      }
    } catch (e) {
      console.error(e);
    }
  }
}

export { runDocFillerEngine };
