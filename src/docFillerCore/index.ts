import { DetectBoxType } from '@docFillerCore/detectors/detectBoxType';
import { FieldExtractorEngine } from '@docFillerCore/engines/fieldExtractorEngine';
// import { FillerEngine } from '@docFillerCore/engines/filler-engine';
import { ParserEngine } from '@docFillerCore/engines/parserEngine';
import { QuestionExtractorEngine } from '@docFillerCore/engines/questionExtractorEngine';
import { PromptEngine } from '@docFillerCore/engines/promptEngine';

function runDocFillerEngine() {
  console.clear(); // Temporary code, while debugging
  console.log('in main run() function');
  const questions = new QuestionExtractorEngine().getValidQuestions();
  console.log(questions);

  const checker = new DetectBoxType();
  const fields = new FieldExtractorEngine();
  const prompts = new PromptEngine();
  const parser = new ParserEngine();

  questions.forEach((question) => {
    const fieldType = checker.detectType(question);
    runDocFillerEngine;
    if (fieldType !== null) {
      const fieldValue = fields.getFields(question, fieldType);
      const parsed_response = parser.parse(fieldType, fieldValue, 'response');

      console.log(question);

      console.log(`Field Type : ${fieldType}`);
      console.log('Fields ↴');

      console.log('Field Value ↴');
      console.log(fieldValue);

      console.log(`Parsed Response : ${parsed_response}`);
      console.log();

      console.log('Prompt ↴');
      console.log(prompts.getPrompt(fieldType, fieldValue));
    }
  });
}

export { runDocFillerEngine };
