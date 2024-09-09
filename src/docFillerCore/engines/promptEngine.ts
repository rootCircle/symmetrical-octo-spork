import { EMPTY_STRING } from '@utils/constant';
import { QType } from '@utils/questionTypes';

export class PromptEngine {
  public getPrompt(fieldType: QType, value: ExtractedValue): string {
    const title = value.title ?? EMPTY_STRING;
    const description = value.description ?? EMPTY_STRING;
    const options = value.options ?? [];
    const bounds = (value.bounds as LowerUpperBound) || null;
    const rowOptions = value.rowArray?.join('\n') ?? EMPTY_STRING;
    const columnOptions = value.columnArray?.join(', ') ?? EMPTY_STRING;
    const otherOption = value.other?.data ?? EMPTY_STRING;

    switch (fieldType) {
      case QType.TEXT:
        return this.getTextPrompt(title, description);

      case QType.TEXT_EMAIL:
        return this.getTextEmailPrompt(title, description);

      case QType.TEXT_URL:
        return this.getTextURLPrompt(title, description);

      case QType.PARAGRAPH:
        return this.getParagraphPrompt(title, description);

      case QType.LINEAR_SCALE:
        return this.getLinearScalePrompt(title, description, options, bounds);

      case QType.MULTIPLE_CHOICE:
        return this.getMultipleChoicePrompt(title, description, options);

      case QType.MULTIPLE_CHOICE_WITH_OTHER:
        return this.getMultipleChoiceWithOtherPrompt(
          title,
          description,
          options,
          otherOption
        );

      case QType.MULTI_CORRECT:
        return this.getMultiCorrectPrompt(title, description, options);

      case QType.MULTI_CORRECT_WITH_OTHER:
        return this.getMultiCorrectWithOtherPrompt(
          title,
          description,
          options,
          otherOption
        );
      case QType.DROPDOWN:
        return this.getDropdownPrompt(title, description, options);

      case QType.CHECKBOX_GRID:
        return this.getCheckboxGridPrompt(
          title,
          description,
          rowOptions,
          columnOptions
        );

      case QType.MULTIPLE_CHOICE_GRID:
        return this.getMultipleChoiceGrid(
          title,
          description,
          rowOptions,
          columnOptions
        );

      case QType.DATE:
        return this.getDatePrompt(title, description);

      case QType.TIME:
        return this.getTimePrompt(title, description);

      case QType.TIME_WITH_MERIDIEM:
        return this.getTimeWithMeridiemPrompt(title, description);

      case QType.DATE_TIME_WITH_MERIDIEM:
        return this.getDateTimeWithMeridiemPrompt(title, description);

      case QType.DATE_AND_TIME:
        return this.getDateTimePrompt(title, description);

      case QType.DURATION:
        return this.getDurationPrompt(title, description);

      case QType.DATE_WITHOUT_YEAR:
        return this.getDateWithoutYearPrompt(title, description);

      case QType.DATE_TIME_WITHOUT_YEAR:
        return this.getDateTimeWithoutYearPrompt(title, description);

      case QType.DATE_TIME_WITH_MERIDIEM_WITHOUT_YEAR:
        return this.getDateTimeWithMeridiemWithoutYear(title, description);
    }
  }

  private getTextPrompt(title: string, description: string): string {
    return (
      `Please provide a response in text form for the following question: ` +
      `${description} ${title}`
    );
  }

  private getTextEmailPrompt(title: string, description: string): string {
    return (
      `Please provide the email address in text form for the following ` +
      `question: ${description} ${title}\n` +
      `If you don't have a response, you can provide dummy@email.com`
    );
  }

  private getTextURLPrompt(title: string, description: string): string {
    return (
      `Please provide a URL hyperlink in text form(not markdown) for the following question: ` +
      `${description} ${title}\n` +
      `Give it in plain text, without any hyperlinking as in markdown!`
    );
  }

  private getParagraphPrompt(title: string, description: string): string {
    return (
      `Please provide a detailed response in paragraph form for the ` +
      `following question: ${description} ${title}`
    );
  }

  private getLinearScalePrompt(
    title: string,
    description: string,
    options: Option[],
    bounds: LowerUpperBound
  ): string {
    return (
      `Prompt:\nOn a scale from 1 to ${options.length}\n` +
      `key 1 represents "${bounds?.lowerBound ?? EMPTY_STRING}" and key ${
        options.length
      } ` +
      `represents "${
        bounds?.upperBound ?? EMPTY_STRING
      }" with uniform distribution between.\n` +
      `\nQuestion: ${title} ${description}`
    );
  }

  private getMultipleChoicePrompt(
    title: string,
    description: string,
    options: Option[]
  ): string {
    return (
      `Please provide the correct option (just option and don't write anything else)` +
      ` corresponding to the right answer for ` +
      `the following multiple-choice question: ${description} ${title}\n` +
      `${options.map((option) => option.data).join('\n')}`
    );
  }

  private getMultipleChoiceWithOtherPrompt(
    title: string,
    description: string,
    options: Option[],
    otherOption: string
  ): string {
    return (
      `Prompt:\nYou are presented with a Multiple-choice question that includes an "Other" option. ` +
      `Select the exact correct options from the list provided. If you choose "Other", ` +
      `provide your specific answer on a new line starting with "Other: <Your Answer>".\n\n` +
      `Example:\nQuestion:\nWhich of the following programming languages are used for web development?\n\nOptions:\n` +
      `JavaScript\nPython\nC++\nOther:\n\nYour response should be:\n` +
      `JavaScript\nOther:\nPHP, JQuery, CSS, HTML.\n\nInstructions:\n` +
      `Only return the selected options; do not include any additional text. If "Other" is selected, ` +
      `make sure your specific answer follows "Other:" on the next line.\n\nQuestion:\n` +
      `${title}\n${description}\n\nOptions:\n` +
      `${options.map((option) => option.data).join('\n')}\n${otherOption}`
    );
  }

  private getMultiCorrectPrompt(
    title: string,
    description: string,
    options: Option[]
  ): string {
    return (
      `Prompt:\nAs a Quiz solver, I am presenting you with a Multi-correct question. ` +
      `Your task is to identify and provide the exact correct options among the given choices. ` +
      `Please refrain from including any additional text in your response.\nExample:\n` +
      `Question:\nWhich of the following statements is/are correct?\n\nOptions:\n` +
      `A chemical equation tells us about the substances involved in a reaction.\n` +
      `A chemical equation informs us about the symbols and formulae of the substances involved ` +
      `in a reaction.\nA chemical equation does not tell us about the atoms or molecules of ` +
      `the reactants and products involved in a reaction.\nAll are correct.\n\nYour response should be:\n` +
      `A chemical equation tells us about the substances involved in a reaction.\n` +
      `A chemical equation informs us about the symbols and formulae of the substances involved ` +
      `in a reaction.\n\nInstructions:\nOnly return the correct options; avoid including any ` +
      `supplementary text.\n\nQuestion:\n${title}\n${description}\n\nOptions:\n` +
      `${options.map((option) => option.data).join('\n')}`
    );
  }
  private getMultiCorrectWithOtherPrompt(
    title: string,
    description: string,
    options: Option[],
    otherOption: string
  ): string {
    return (
      `Prompt:\nAs a Quiz solver, I am presenting you with a Multi-correct with 'other' option ` +
      `question. Your task is to identify and provide the exact correct options among the given ` +
      `choices. Please refrain from including any additional text in your response. If your option ` +
      `is the last option 'Other:', then write 'Other:' on the first line and provide your 1-line ` +
      `answer for the question.\nExample:\nQuestion:\nWhich of the following statements is/are ` +
      `correct?\n\nOptions:\nA chemical equation tells us about the substances involved in a ` +
      `reaction.\nA chemical equation informs us about the symbols and formulae of the substances ` +
      `involved in a reaction.\nA chemical equation does not tell us about the atoms or molecules ` +
      `of the reactants and products involved in a reaction.\nAll are correct.\n\nYour response should ` +
      `be:\nA chemical equation tells us about the substances involved in a reaction.\nA chemical ` +
      `equation informs us about the symbols and formulae of the substances involved in a reaction.\n\n` +
      `Example:\nQuestion:\nWhich of the following numbers is positive?\nOptions:\n-1\n-2\n7\nOther:\n` +
      `Expected output: Your response should be: Other:\nNone of the given numbers is positive.\n\n` +
      `Instructions:\nOnly return the correct options; avoid including any supplementary text. If your ` +
      `option is the last option 'Other:', then write 'Other:' on the first line and provide your 1-line ` +
      `answer or explanation for the question on the next line.\n\nQuestion:\n${title}\n${description}\n\n` +
      `Options:\n${options
        .map((option) => option.data)
        .join('\n')}\n${otherOption}`
    );
  }

  private getDropdownPrompt(
    title: string,
    description: string,
    options: Option[]
  ): string {
    return (
      `Please select one most appropriate correct option from the dropdown list for the ` +
      `following question: ${description} ${title}\n` +
      `${options.map((option) => option.data).join('\n')}\n\n` +
      `Please give only the answer and nothing else!`
    );
  }

  private getCheckboxGridPrompt(
    title: string,
    description: string,
    rowOptions: string,
    columnOptions: string
  ): string {
    return (
      `Prompt:\nAs a Quiz solver, I am presenting you with a checkbox grid question which ` +
      `contains multiple sub-questions with the same options for all.\nExample: Options available: ` +
      `[Scientist, Writer, Journalist, Teacher]\nQuestion: Match each person with his past designations.\n` +
      `Sub-questions are given below: Charles Darwin\nLewis Carroll\nDr Sarvepalli Radhakrishnan\n` +
      `Barkha Dutt\n\nExpected Answer: Scientist\nWriter\nTeacher\nJournalist\n\nInstructions: ` +
      `Print only the answers among the given options. Don't write anything else, no extra text, neither ` +
      `question text. Only return correct options, with a new line for each answer.\nQuestion: ` +
      `Options available: [${columnOptions}]\n${title}\n${description}\nSub-questions are ` +
      `given below: answer for the following:\n${rowOptions}`
    );
  }

  private getMultipleChoiceGrid(
    title: string,
    description: string,
    rowOptions: string,
    columnOptions: string
  ): string {
    return (
      `Prompt:\nAs a Quiz solver, I am presenting you with a Multiple choice grid question which ` +
      `contains multiple sub-questions with the same options for all.\nExample: Options available: ` +
      `[Scientist, Writer, Journalist, Teacher]\nQuestion: Match each person with his past designations.\n` +
      `Sub-questions are given below: Charles Darwin\nLewis Carroll\nAlbert Einstein\nBarkha Dutt\n\n` +
      `Answer you should have returned for this question: Scientist\nWriter\nScientist, Teacher\n` +
      `Journalist\n\nMy Question: Options available: [${columnOptions}]\n${title}\n${description}\n` +
      `Sub-questions are given below (only print options for these): \n${rowOptions}\nInstructions: ` +
      `Print only the answers among the given options. Don't write anything else, no extra text, no ` +
      `heading, neither question text. Only return correct options, with a new line for each answer.`
    );
  }

  private getDatePrompt(title: string, description: string): string {
    return `Please provide the correct time that best corresponds to your response for the following question: ${description} ${title}. Only return the correct time, nothing else, and do not include any other text.`;
  }

  private getTimePrompt(title: string, description: string): string {
    return `Please provide the correct time that best corresponds to your response for the following question: ${description} ${title}. Only return the correct time, nothing else, and do not include any other text.`;
  }

  private getTimeWithMeridiemPrompt(
    title: string,
    description: string
  ): string {
    return `Please provide the correct time that best corresponds to your response for the following question: ${description} ${title}. Only return the correct time, nothing else, and do not include any other text.`;
  }

  private getDateTimeWithMeridiemPrompt(
    title: string,
    description: string
  ): string {
    return `Please provide the correct time that best corresponds to your response for the following question: ${description} ${title}. Only return the correct time (fill in the required fields among year, month, date, hour, minute, seconds as per the question; keep the rest as "00"), nothing else, and do not include any other text.`;
  }

  private getDateTimePrompt(title: string, description: string): string {
    return `Please provide the correct time that best corresponds to your response for the following question: ${description} ${title}. Only return the correct time (fill in the required fields among year, month, date, hour, minute, seconds as per the question; keep the rest as "00"), nothing else, and do not include any other text.`;
  }

  private getDurationPrompt(title: string, description: string): string {
    return `Please provide the correct time that best corresponds to your response for the following question: ${description} ${title}. Only return the correct time (fill in the required fields among year, month, date, hour, minute, seconds as per the question; keep the rest as "00"), nothing else, and do not include any other text.`;
  }

  private getDateWithoutYearPrompt(title: string, description: string): string {
    return `Please provide the correct time that best corresponds to your response for the following question: ${description} ${title}. Only return the correct time (fill in the required fields among year, month, date, hour, minute, seconds as per the question; keep the rest as "00"), nothing else, and do not include any other text.`;
  }

  private getDateTimeWithoutYearPrompt(
    title: string,
    description: string
  ): string {
    return `Please provide the correct time that best corresponds to your response for the following question: ${description} ${title}. Only return the correct time (fill in the required fields among year, month, date, hour, minute, seconds as per the question; keep the rest as "00"), nothing else, and do not include any other text.`;
  }

  private getDateTimeWithMeridiemWithoutYear(
    title: string,
    description: string
  ): string {
    return `Please provide the correct time that best corresponds to your response for the following question: ${description} ${title}. Only return the correct time as per question(fill in the required fields among year, month, date, hour, minute, seconds as per the question; keep the rest as "00"), nothing else, and do not include any other text.`;
  }
}
