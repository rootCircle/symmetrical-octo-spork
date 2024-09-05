import { DetectBoxType } from '@docFillerCore/detectors/detectBoxType';
import { FieldExtractorEngine } from '@docFillerCore/engines/fieldExtractorEngine';
import { ParserEngine } from '@docFillerCore/engines/parserEngine';
import { QuestionExtractorEngine } from '@docFillerCore/engines/questionExtractorEngine';
import { PromptEngine } from '@docFillerCore/engines/promptEngine';
import { FillerEngine } from '@docFillerCore/engines/fillerEngine';

async function runDocFillerEngine() {
  console.clear(); // Temporary code, while debugging
  const questions = new QuestionExtractorEngine().getValidQuestions();

  const checker = new DetectBoxType();
  const fields = new FieldExtractorEngine();
  const prompts = new PromptEngine();
  const parser = new ParserEngine();
  const filler = new FillerEngine();

  for (const question of questions) {
    const fieldType = checker.detectType(question);

    if (fieldType !== null) {
      const fieldValue = fields.getFields(question, fieldType);
      const parsed_response = parser.parse(fieldType, fieldValue, 'response');

      console.log(question);

      console.log(`Field Type : ${fieldType}`);
      console.log('Fields ↴');

      console.log('Field Value ↴');
      console.log(fieldValue);

      console.log(`Parsed Response : ${parsed_response}`);

      console.log('Prompt ↴');
      console.log(prompts.getPrompt(fieldType, fieldValue));
      const fillerStatus = await filler.fill(fieldType, fieldValue, 'response');
      console.log(`Filler Status ${fillerStatus}`);

      console.log();
    }
  }
}

export { runDocFillerEngine };
