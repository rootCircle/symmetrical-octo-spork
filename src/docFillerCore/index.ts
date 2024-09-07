import { DetectBoxType } from '@docFillerCore/detectors/detectBoxType';
import { FieldExtractorEngine } from '@docFillerCore/engines/fieldExtractorEngine';
import { ParserEngine } from '@docFillerCore/engines/parserEngine';
import { QuestionExtractorEngine } from '@docFillerCore/engines/questionExtractorEngine';
import { PromptEngine } from '@docFillerCore/engines/promptEngine';
import { FillerEngine } from '@docFillerCore/engines/fillerEngine';
import { LLMEngine } from '@docFillerCore/engines/gptEngine';
import { CURRENT_LLM_MODEL } from '@utils/constant';

async function runDocFillerEngine() {
  console.clear(); // Temporary code, while debugging
  const questions = new QuestionExtractorEngine().getValidQuestions();

  const checker = new DetectBoxType();
  const fields = new FieldExtractorEngine();
  const prompts = new PromptEngine();
  const llm = LLMEngine.getInstance(CURRENT_LLM_MODEL);
  const parser = new ParserEngine();
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

      const response = await llm.getResponse(promptString);
      console.log('LLM Response ↴');
      console.log(response);

      const parsed_response = parser.parse(fieldType, fieldValue, 'response');
      console.log(`Parsed Response : ${parsed_response}`);

      const fillerStatus = await filler.fill(fieldType, fieldValue, 'response');
      console.log(`Filler Status ${fillerStatus}`);

      console.log();
    }
  }
}

export { runDocFillerEngine };
