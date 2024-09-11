/* eslint-disable no-console */
import { DetectBoxType } from '@docFillerCore/detectors/detectBoxType';
import { FieldExtractorEngine } from '@docFillerCore/engines/fieldExtractorEngine';
import { ValidatorEngine } from '@docFillerCore/engines/validatorEngine';
import { QuestionExtractorEngine } from '@docFillerCore/engines/questionExtractorEngine';
import { PromptEngine } from '@docFillerCore/engines/promptEngine';
import { FillerEngine } from '@docFillerCore/engines/fillerEngine';
import { LLMEngine } from '@docFillerCore/engines/gptEngine';
import { CURRENT_LLM_MODEL, ENABLE_CONSENSUS } from '@utils/constant';
import { ConsensusEngine } from '@docFillerCore/engines/consensusEngine';

async function runDocFillerEngine() {
  console.clear(); // Temporary code, while debugging
  const questions = new QuestionExtractorEngine().getValidQuestions();

  const checker = new DetectBoxType();
  const fields = new FieldExtractorEngine();
  const prompts = new PromptEngine();
  const llm = LLMEngine.getInstance(CURRENT_LLM_MODEL);
  const validator = new ValidatorEngine();
  const filler = new FillerEngine();

  for (const question of questions) {
    const fieldType = checker.detectType(question);

    if (fieldType !== null) {
      const fieldValue = fields.getFields(question, fieldType);
      const promptString = prompts.getPrompt(fieldType, fieldValue);

      console.log(question);

      console.log(`Field Type : ${fieldType}`);
      console.log('Fields ↴');

      console.log('Field Value ↴');
      console.log(fieldValue);

      console.log('Prompt ↴');
      console.log(promptString);

      let response = null;

      if (ENABLE_CONSENSUS) {
        const consensusEngine = new ConsensusEngine();
        response = await consensusEngine.generateAndValidate(
          promptString,
          fieldValue,
          fieldType,
        );
      } else {
        response = await llm.getResponse(promptString, fieldType);
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
        const fillerStatus = await filler.fill(fieldType, fieldValue, response);
        console.log(`Filler Status ${fillerStatus}`);
      }

      console.log();
    }
  }
}

export { runDocFillerEngine };
