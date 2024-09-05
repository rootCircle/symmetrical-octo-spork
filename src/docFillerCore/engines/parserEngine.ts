import { QType } from '@utils/questionTypes';
import ValidationUtils from '@utils/validationUtils';

export class ParserEngine {
  private validationUtil: ValidationUtils;

  constructor() {
    this.validationUtil = new ValidationUtils();
  }

  public parse(
    fieldType: QType,
    extractedValue: ExtractedValue,
    response: string
  ): boolean | null {
    // TODO: Just for testing, remove this later
    const testResponse = {
      TEXT: 'Andrew',
      EMAIL: 'abc@gmail.com',
      PARAGRAPH:
        "Please enjoy these great stories, fairy-tales, fables, and nursery rhymes for children. They help kids learn to read and make excellent bedtime stories! We have hundreds of great children's stories for you to share.",
      MULTI_CORRECT: 'Swimming\nHiking',
      MULTI_CORRECT_WITH_OTHER: 'Day 1\nDay 2',
      DATE: '22-12-2022',
      TIME: '10-12',
      DATE_AND_TIME: '22-12-2022-12-12',
      DURATION: '21-34-58',
      DATE_WITHOUT_YEAR: '31-12',
      DATE_TIME_WITHOUT_YEAR: '31-12-17-12',
      MULTIPLE_CHOICE: 'Tanzania',
      MULTIPLE_CHOICE_WITH_OTHER: 'Tanzania',
      LINEAR_SCALE: '1',
      MULTIPLE_CHOICE_GRID:
        'Strongly disagree\nAgree\nStrongly agree\nDisagree',
      CHECKBOX_GRID: 'Japan\nCanada',
      DROPDOWN: 'Asia',
    };

    const validatedResponse = this.validateResponse(response);

    if (validatedResponse === false) {
      return false;
    }

    if (fieldType !== null && extractedValue !== null) {
      switch (fieldType) {
        case QType.TEXT:
          return this.validateText(testResponse.TEXT);
        case QType.TEXT_EMAIL:
          return this.validateEmail(testResponse.EMAIL);
        case QType.MULTI_CORRECT_WITH_OTHER:
          return this.validateMultiCorrectWithOther(
            extractedValue,
            testResponse.MULTI_CORRECT_WITH_OTHER
          );
        case QType.MULTI_CORRECT:
          return this.validateMultiCorrect(
            extractedValue,
            testResponse.MULTI_CORRECT
          );
        case QType.PARAGRAPH:
          return this.validateParagraph(testResponse.PARAGRAPH);
        case QType.DATE:
          return this.validateDate(testResponse.DATE);
        case QType.DATE_AND_TIME:
          return this.validateDateAndTime(testResponse.DATE_AND_TIME);
        case QType.TIME:
          return this.validateTime(testResponse.TIME);
        case QType.DURATION:
          return this.validateDuration(testResponse.DURATION);
        case QType.DATE_WITHOUT_YEAR:
          return this.validateDateWithoutYear(testResponse.DATE_WITHOUT_YEAR);
        case QType.DATE_TIME_WITHOUT_YEAR:
          return this.validateDateTimeWithoutYear(
            testResponse.DATE_TIME_WITHOUT_YEAR
          );
        case QType.MULTIPLE_CHOICE:
          return this.validateMultipleChoice(
            extractedValue,
            testResponse.MULTIPLE_CHOICE
          );
        case QType.MULTIPLE_CHOICE_WITH_OTHER:
          return this.validateMultipleChoiceWithOther(
            extractedValue,
            testResponse.MULTIPLE_CHOICE_WITH_OTHER
          );
        case QType.LINEAR_SCALE:
          return this.validateLinearScale(
            extractedValue,
            testResponse.LINEAR_SCALE
          );
        case QType.MULTIPLE_CHOICE_GRID:
          return this.validateMultipleChoiceGrid(
            extractedValue,
            testResponse.MULTIPLE_CHOICE_GRID
          );
        // case QType.CHECKBOX_GRID:
        //     return this.validateCheckBoxGrid(extractedValue, testResponse.CHECKBOX_GRID);
        case QType.DROPDOWN:
          return this.validateDropdown(extractedValue, testResponse.DROPDOWN);
        default:
          return null;
      }
    } else {
      return false;
    }
  }

  // TODO: Check if it not one of those LLM error messages like those on safety etc

  private validateResponse(response: string): boolean {
    return !response.startsWith('As an AI model');
  }

  private validateText(response: string): boolean {
    const text = response.trim();
    return text.length > 0 && !(text.includes('\n') || text.includes('\r'));
  }

  private validateParagraph(response: string): boolean {
    return response.trim().length > 0;
  }

  private validateEmail(response: string): boolean {
    // Checking valid email in accord to RFC 5322
    // https://stackoverflow.com/questions/201323/how-can-i-validate-an-email-address-using-a-regular-expression/201378#201378

    const mailRegex =
      /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
    return Boolean(response && response.match(mailRegex));
  }

  private validateDate(response: string): boolean {
    // Accepts: dd-MM-yyyy
    const dateValid =
      /^([0][1-9]|[1-2][0-9]|[3][0-1])-([0][1-9]|[1][0-2])-(\d{4})$/;
    const dateArr = response.match(dateValid);
    if (dateArr) {
      const [_, date, month, year] = dateArr;
      return this.validationUtil.validateDate(date, month, year);
    }
    return false;
  }

  private validateDateAndTime(response: string): boolean {
    // Accepts: dd-MM-yyyy-hh-mm
    const dateTimeValid =
      /^([0][1-9]|[1-2][0-9]|[3][0-1])-([0][1-9]|[1][0-2])-(\d{4})-([01][0-9]|[2][0-3])-([0-5][0-9])$/;
    const dateArr = response.match(dateTimeValid);
    if (dateArr) {
      const [_, date, month, year, hour, minute] = dateArr;
      return this.validationUtil.validateDate(date, month, year);
    }
    return false;
  }

  private validateTime(response: string): boolean {
    // Accepts: hh-mm
    const timeValid = /^([01][0-9]|[2][0-3])-([0-5][0-9])$/;
    return Boolean(response && response.match(timeValid));
  }

  private validateDuration(response: string): boolean {
    // Accepts: hh-mm-ss
    const durationValid = /^([01][0-9]|[2][0-3])(-[0-5][0-9]){2}$/;
    return Boolean(response && response.match(durationValid));
  }

  private validateDateWithoutYear(response: string): boolean {
    // Accepts: dd-MM
    const dateWYearValid =
      /^([0][1-9]|[1-2][0-9]|[3][0-1])-([0][1-9]|[1][0-2])$/;
    const dateArr = response.match(dateWYearValid);
    if (dateArr) {
      const [_, date, month] = dateArr;
      return this.validationUtil.validateDate(date, month);
    }
    return false;
  }

  private validateDateTimeWithoutYear(response: string): boolean {
    // Accepts: dd-MM-hh-mm
    const dateTimeWYearValid =
      /^([0][1-9]|[1-2][0-9]|[3][0-1])-([0][1-9]|[1][0-2])-([01][0-9]|[2][0-3])-([0-5][0-9])$/;
    const dateArr = response.match(dateTimeWYearValid);
    if (dateArr) {
      const [_, date, month, hour, minute] = dateArr;
      return this.validationUtil.validateDate(date, month);
    }
    return false;
  }

  private validateMultiCorrect(
    extractedValue: ExtractedValue,
    response: string
  ): boolean {
    const responseOptions = response
      .split(/\r?\n/)
      .map((option) => option.trim());
    const actualOptions = extractedValue.options?.map((option) =>
      option.data.trim()
    );

    return responseOptions.every((option) =>
      actualOptions?.some(
        (actualOption) => option.toLowerCase() === actualOption.toLowerCase()
      )
    );
  }

  private validateMultiCorrectWithOther(
    extractedValue: ExtractedValue,
    response: string
  ): boolean {
    return (
      this.validateMultiCorrect(extractedValue, response) ||
      (response.startsWith('Other') && this.validateText(response))
    );
  }

  private validateMultipleChoice(
    extractedValue: ExtractedValue,
    response: string
  ): boolean {
    const trimmedResponse = response.trim();
    const actualOptions = extractedValue.options?.map((option) =>
      option.data.trim()
    );

    return Boolean(
      actualOptions?.some(
        (option) => option.toLowerCase() === trimmedResponse.toLowerCase()
      )
    );
  }

  private validateMultipleChoiceWithOther(
    extractedValue: ExtractedValue,
    response: string
  ): boolean {
    return (
      this.validateMultipleChoice(extractedValue, response) ||
      (response.startsWith('Other') && this.validateText(response))
    );
  }

  private validateLinearScale(
    extractedValue: ExtractedValue,
    response: string
  ): boolean {
    // Validations works the same as for MultipleChoice behind the hood!
    return this.validateMultipleChoice(extractedValue, response);
  }

  private validateMultipleChoiceGrid(
    extractedValue: ExtractedValue,
    response: string
  ): boolean {
    const responseOptions = response
      .trim()
      .split(/\r?\n/)
      .map((option) => option.trim());

    if (responseOptions.length !== (extractedValue.rowArray || []).length) {
      return false;
    }

    const actualOptions = extractedValue.columnArray || [];

    return responseOptions.every((option) =>
      actualOptions.some(
        (actualOption) => option.toLowerCase() === actualOption.toLowerCase()
      )
    );
  }

  // TODO: Implement this
  private validateCheckBoxGrid(
    extractedValue: ExtractedValue,
    response: string
  ): boolean {
    return false;
    // return this.validateMultipleChoiceGrid(extractedValue, response);
  }

  private validateDropdown(
    extractedValue: ExtractedValue,
    response: string
  ): boolean {
    // Validations works the same as for MultipleChoice behind the hood!

    return this.validateMultipleChoice(extractedValue, response);
  }
}
