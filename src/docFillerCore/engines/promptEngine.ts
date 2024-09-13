import { EMPTY_STRING } from '@utils/settings';
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
          otherOption,
        );

      case QType.MULTI_CORRECT:
        return this.getMultiCorrectPrompt(title, description, options);

      case QType.MULTI_CORRECT_WITH_OTHER:
        return this.getMultiCorrectWithOtherPrompt(
          title,
          description,
          options,
          otherOption,
        );
      case QType.DROPDOWN:
        return this.getDropdownPrompt(title, description, options);

      case QType.CHECKBOX_GRID:
        return this.getCheckboxGridPrompt(
          title,
          description,
          rowOptions,
          columnOptions,
        );

      case QType.MULTIPLE_CHOICE_GRID:
        return this.getMultipleChoiceGrid(
          title,
          description,
          rowOptions,
          columnOptions,
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
    return `Please provide a concise, single-sentence response to the following question:${title} — ${description}`;
  }

  private getTextEmailPrompt(title: string, description: string): string {
    return `Please generate a valid and realistic email address in the standard format (username@domain.com) based on the following: 
    ${title} — ${description}.If a valid email cannot be generated, return 'dummyemail@gmail.com'.`;
  }

  private getTextURLPrompt(title: string, description: string): string {
    return (
      'Please provide a plain text URL (not formatted as a hyperlink or markdown) in response to the following: ' +
      `${title} — ${description}.\n` +
      'Ensure the URL is in plain text without any hyperlink formatting.'
    );
  }

  private getParagraphPrompt(title: string, description: string): string {
    return (
      'Please provide a detailed response in the form of a plain text paragraph for the following: ' +
      `${title} — ${description}.\n` +
      'Ensure the response is in plain text without any markdown or special formatting.'
    );
  }

  private getLinearScalePrompt(
    title: string,
    description: string,
    options: OptionType[],
    bounds: LowerUpperBound,
  ): string {
    return (
      `Prompt:\nPlease respond with an integer on a linear scale from 1 to ${options.length}.\n` +
      `- A value of 1 corresponds to "${bounds?.lowerBound ?? EMPTY_STRING}".\n` +
      `- A value of ${options.length} corresponds to "${bounds?.upperBound ?? EMPTY_STRING}".\n` +
      `The values between 1 and ${options.length} are distributed uniformly.\n` +
      'Provide only the appropriate integer value that best matches the given scale.\n' +
      `\nQuestion: ${title}\n${description}`
    );
  }

  private getMultipleChoicePrompt(
    title: string,
    description: string,
    options: OptionType[],
  ): string {
    return (
      'Prompt:\nPlease select the correct answer from the options below.\n' +
      'Provide only the exact text of the correct option, without adding any extra characters or explanations.\n' +
      `\nQuestion Description: ${description}\n` +
      `Question Title: ${title}\n` +
      `\nOptions:\n${options.map((option, index) => `${index + 1}. ${option.data}`).join('\n')}`
    );
  }

  private getMultipleChoiceWithOtherPrompt(
    title: string,
    description: string,
    options: OptionType[],
    otherOption: string,
  ): string {
    return (
      'Prompt:\nYou are given a multiple-choice question with a list of options, including an "Other" option. ' +
      'Please select only one option that best answers the question. If you select "Other," ' +
      'provide your custom answer on a new line, starting with "Other:".\n' +
      '\nInstructions:\n- Return only the text of the selected option.\n' +
      '- If "Other" is selected, ensure that your custom answer follows the format "Other: <Your Answer>" on a new line.\n' +
      '- Do not include any additional text or explanations.\n' +
      `\nQuestion:\n${title}\n${description}\n` +
      `\nOptions:\n${options.map((option) => option.data).join('\n')}\n${otherOption}`
    );
  }

  private getMultiCorrectPrompt(
    title: string,
    description: string,
    options: OptionType[],
  ): string {
    return (
      'Prompt:\nYou are given a multiple-correct quiz question with several answer choices. ' +
      'Your task is to identify and return only the correct options from the list below. ' +
      'Provide the exact text of each correct option, and avoid adding any extra text or explanations.\n' +
      '\nExample Response:\nOption 1\nOption 3\n' +
      '\nInstructions:\n- Select all the correct options and return them as separate lines of text.\n' +
      '- Only include the correct options; do not add any additional text or commentary.\n' +
      `\nQuestion:\n${title}\n${description}\n` +
      `\nOptions:\n${options.map((option, index) => `${index + 1}. ${option.data}`).join('\n')}`
    );
  }
  private getMultiCorrectWithOtherPrompt(
    title: string,
    description: string,
    options: OptionType[],
    otherOption: string,
  ): string {
    return (
      "You are tasked with solving a `multiple-correct with other` question. With good precision ,return only the options which are correct. The 'Other' option can be selected alongside one or more of the listed options. If 'Other' is chosen, provide an explanation for what additional correct option(s) should be included." +
      `\n**Question**: ${title}\n${description}\n` +
      `\n**Options**:\n${options.map((option, index) => `${index + 1}. ${option.data}`).join('\n')}\n${options.length + 1}. ${otherOption}\n`
    );
  }

  private getDropdownPrompt(
    title: string,
    description: string,
    options: OptionType[],
  ): string {
    return (
      'Select the most appropriate option from the dropdown for the question below:\n' +
      `Question: ${title}\nDescription: ${description}\n\n` +
      `Options:\n${options.map((option) => option.data).join('\n')}\n\n` +
      'Respond with only the correct option. No additional text is needed.'
    );
  }

  private getCheckboxGridPrompt(
    title: string,
    description: string,
    rowOptions: string,
    columnOptions: string,
  ): string {
    return (
      'You are given a checkbox grid question with rows and columns.\n\n' +
      'Instructions:\n1. For each row, list the columns that apply to it.\n' +
      '2. Respond with only the correct columns for each row in the format Row: [Columns].\n' +
      '3. Do not include any extra text, explanations, or the question itself.\n\n' +
      'Example:\nRows: [Can Fly, Lives in Water, Is a Mammal, Has a Tail]\nColumns: [Lion, Eagle, Dolphin, Kangaroo]\n' +
      'Expected Answer:\nCan Fly: [Eagle]\nLives in Water: [Dolphin]\nIs a Mammal: [Lion, Dolphin, Kangaroo]\nHas a Tail: [Lion, Eagle, Dolphin, Kangaroo]\n\n' +
      `Question: ${title}\nDescription: ${description}\nRows: [${rowOptions}]\nColumns: [${columnOptions}]`
    );
  }

  private getMultipleChoiceGrid(
    title: string,
    description: string,
    rowOptions: string,
    columnOptions: string,
  ): string {
    return (
      'Prompt:\nYou are a quiz solver tasked with answering a Multiple Choice Grid question. The question consists of multiple sub-questions, each sharing the same set of answer options.\n' +
      'Example:\nOptions: [Scientist, Writer, Journalist, Teacher]\nMatch each person with their previous designations:\nCharles Darwin\nLewis Carroll\nAlbert Einstein\nBarkha Dutt\n\n' +
      'Correct answers for this example would be:\nScientist\nWriter\nScientist, Teacher\nJournalist\n\n' +
      `Now for the actual question:\nOptions available: [${columnOptions}]\n\n` +
      `Question Title: ${title}\nDescription: ${description}\nSub-questions are as follows (provide answers from the options for each):\n${rowOptions}\n\n` +
      'Instructions:\n1. Print only the answers corresponding to each sub-question from the available options.\n' +
      '2. Do not include any extra text, headings, or question descriptions.\n' +
      '3. List each answer on a new line, in the same order as the sub-questions.'
    );
  }

  // Date Prompt
  private getDatePrompt(title: string, description: string): string {
    return `Provide only the date based on your response to the following question: ${title} - ${description}. Ensure to return the date object with zero-padding where applicable. Return only the date with no additional text or formatting.`;
  }

  // Time Prompt
  private getTimePrompt(title: string, description: string): string {
    return `Provide only the time based on your response to the following question: ${title} - ${description}. Ensure to return the date object with zero-padding where applicable. Return only the time with no additional text or formatting.`;
  }

  // Time with Meridiem Prompt
  private getTimeWithMeridiemPrompt(
    title: string,
    description: string,
  ): string {
    return `Provide only the date and time based on your response to the following question: ${title} - ${description}. Ensure to return the date object with zero-padding where applicable. Return only the time with no additional text or formatting.`;
  }

  // DateTime with Meridiem Prompt
  private getDateTimeWithMeridiemPrompt(
    title: string,
    description: string,
  ): string {
    return `Provide only the date and time based on your response to the following question: ${title} - ${description}. Ensure to return date object/YYYY HH:mm AM/PM with zero-padding where applicable. Return only the date and time with no additional text or formatting.`;
  }

  // DateTime Prompt
  private getDateTimePrompt(title: string, description: string): string {
    return `Provide only the date and time based on your response to the following question: ${title} - ${description}. Ensure to return Date object with zero-padding where applicable. Return only the date and time with no additional text or formatting.`;
  }

  // Duration Prompt
  private getDurationPrompt(title: string, description: string): string {
    return `Based on the following question, provide the duration as a Date object, ensuring to zero-pad where applicable: ${title} - ${description}. 
    Example: If the duration is 52 seconds, return it as a Date object like this: { date: Date Tue Jan 24 1950 5:30:52 GMT+0530 (India Standard Time) }. 
    Please return only the duration in the specified format, without any additional text or formatting.`;
  }

  // Date Without Year Prompt
  private getDateWithoutYearPrompt(title: string, description: string): string {
    return `Provide only the date and time based on your response to the following question: ${title} - ${description}. Ensure to return date object with zero-padding where applicable. Return only the date and time with no additional text or formatting.`;
  }

  // DateTime Without Year Prompt
  private getDateTimeWithoutYearPrompt(
    title: string,
    description: string,
  ): string {
    return `Provide only the date and time based on your response to the following question: ${title} - ${description}. Ensure to return date object with zero-padding where applicable. Return only the date and time with no additional text or formatting.`;
  }

  // DateTime with Meridiem Without Year Prompt
  private getDateTimeWithMeridiemWithoutYear(
    title: string,
    description: string,
  ): string {
    return `Provide only the date and time based on your response to the following question: ${title} - ${description}. Ensure to return date object with zero-padding where applicable. Return only the date and time with no additional text or formatting.`;
  }
}
