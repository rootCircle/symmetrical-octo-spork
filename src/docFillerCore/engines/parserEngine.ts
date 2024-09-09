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
    response: any
  ): boolean | null {
    if (!response) {
      return false;
    }
    //replaced with data present in testing form for better testing.
    // TODO: Just for testing, remove this later
    // const testResponse = {
    //   TEXT: 'Andrew',
    //   EMAIL: 'abc@gmail.com',
    //   PARAGRAPH:
    //     "Please enjoy these great stories, fairy-tales, fables, and nursery rhymes for children. They help kids learn to read and make excellent bedtime stories! We have hundreds of great children's stories for you to share.",
    //   MULTI_CORRECT: 'Africa\nAsia',
    //   MULTI_CORRECT_WITH_OTHER: 'Solar\nWind',
    //   DATE_AND_TIME: new Date(
    //     'Wed Mar 08 2023 22:03:00 GMT+0530 (India Standard Time)'
    //   ),
    //   DATE: new Date('Wed Mar 08 2023 22:03:00 GMT+0530 (India Standard Time)'),
    //   TIME: new Date('1970-01-01T10:12:00'),
    //   DATE_WITHOUT_YEAR: new Date('2023-12-31'),
    //   DATE_TIME_WITHOUT_YEAR: new Date('2023-12-31T17:12:00'),
    //   DURATION: '21-34-58',
    //   MULTIPLE_CHOICE: 'Galileo Galilei',
    //   MULTIPLE_CHOICE_WITH_OTHER: 'Melbourne',
    //   LINEAR_SCALE: '1',
    //   MULTIPLE_CHOICE_GRID: [
    //     { row: 'first generation', selectedColumn: 'low level' },
    //     { row: 'second generation', selectedColumn: 'high level' },
    //     { row: 'third generation', selectedColumn: 'low level' },
    //     { row: 'fourth generation', selectedColumn: 'high level' },
    //     { row: 'fifth generation', selectedColumn: 'high level' },
    //   ],
    //   CHECKBOX_GRID: [
    //     {
    //       row: 'Apple',
    //       cols: [
    //         { data: 'Speed' },
    //         { data: 'Storage' },
    //         { data: 'Camera Quality' },
    //         { data: 'Pricing' },
    //       ],
    //     },
    //     {
    //       row: 'OnePlus',
    //       cols: [
    //         { data: 'Speed' },
    //         { data: 'Storage' },
    //         { data: 'Camera Quality' },
    //         { data: 'Pricing' },
    //       ],
    //     },
    //     {
    //       row: 'Samsung',
    //       cols: [
    //         { data: 'Speed' },
    //         { data: 'Storage' },
    //         { data: 'Camera Quality' },
    //         { data: 'Pricing' },
    //       ],
    //     },
    //     {
    //       row: 'Motorola',
    //       cols: [
    //         { data: 'Speed' },
    //         { data: 'Storage' },
    //         { data: 'Camera Quality' },
    //         { data: 'Pricing' },
    //       ],
    //     },
    //   ] as RowColumnOption[],
    //   DROPDOWN: 'Giraffe',
    // };

    if (response === false) {
      return false;
    }

    if (fieldType !== null && extractedValue !== null) {
      switch (fieldType) {
        case QType.TEXT:
          return this.validateText(response);
        case QType.TEXT_EMAIL:
          return this.validateEmail(response);
        case QType.MULTI_CORRECT_WITH_OTHER:
          return this.validateMultiCorrectWithOther(extractedValue, response);
        case QType.MULTI_CORRECT:
          return this.validateMultiCorrect(extractedValue, response);
        case QType.PARAGRAPH:
          return this.validateParagraph(response);
        case QType.DATE:
          return this.validateDate(response);
        case QType.DATE_AND_TIME:
          return this.validateDateAndTime(response);
        case QType.TIME:
          return this.validateTime(response);
        case QType.DURATION:
          return this.validateDuration(response);
        case QType.DATE_WITHOUT_YEAR:
          return this.validateDateWithoutYear(response);
        case QType.DATE_TIME_WITHOUT_YEAR:
          return this.validateDateTimeWithoutYear(response);
        case QType.MULTIPLE_CHOICE:
          return this.validateMultipleChoice(extractedValue, response);
        case QType.MULTIPLE_CHOICE_WITH_OTHER:
          return this.validateMultipleChoiceWithOther(extractedValue, response);
        case QType.LINEAR_SCALE:
          return this.validateLinearScale(extractedValue, response);

        case QType.MULTIPLE_CHOICE_GRID:
          return this.validateMultipleChoiceGrid(extractedValue, response);

        case QType.CHECKBOX_GRID:
          return this.validateCheckBoxGrid(extractedValue, response);
        case QType.DROPDOWN:
          return this.validateDropdown(extractedValue, response);
        default:
          return null;
      }
    } else {
      return false;
    }
  }

  private validateText(response: string): boolean {
    const text = response.trim();
    return text.length > 0 && !(text.includes('\n') || text.includes('\r'));
  }

  private validateParagraph(response: string): boolean {
    return response?.trim().length > 0;
  }

  private validateEmail(response: GenericLLMResponse): boolean {
    // Checking valid email in accord to RFC 5322
    // https://stackoverflow.com/questions/201323/how-can-i-validate-an-email-address-using-a-regular-expression/201378#201378

    const mailRegex =
      /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
    return Boolean(response && response?.answer?.match(mailRegex));
  }

  private validateDate(response: Date): boolean {
    // Accepts: dd-MM-yyyy
    if (isNaN(response.valueOf())) return false;
    return response instanceof Date;
  }

  private validateDateAndTime(response: Date): boolean {
    // Accepts: dd-MM-yyyy-hh-mm
    if (isNaN(response.valueOf())) return false;
    return response instanceof Date;
  }

  private validateTime(response: Date): boolean {
    // Accepts: hh-mm

    if (isNaN(response.valueOf())) return false;
    return response instanceof Date;
  }

  private validateDuration(response: string): boolean {
    // Accepts: hh-mm-ss
    const durationValid = /^([01][0-9]|[2][0-3])(-[0-5][0-9]){2}$/;
    return Boolean(response && response.match(durationValid));
  }

  private validateDateWithoutYear(response: Date): boolean {
    // Accepts: dd-MM
    if (isNaN(response.valueOf())) return false;
    return response instanceof Date;
  }

  private validateDateTimeWithoutYear(response: Date): boolean {
    // Accepts: dd-MM-hh-mm
    if (isNaN(response.valueOf())) return false;
    return response instanceof Date;
  }

  private validateMultiCorrect(
    extractedValue: ExtractedValue,
    response: MultiCorrectOrMultipleOption[]
  ): boolean {
    console.log(response);
    const responseOptions = response
      .map((option) => option.optionText?.trim())
      .filter((text) => text !== undefined && text !== '');

    const actualOptions = extractedValue.options?.map((option) =>
      option.data.trim().toLowerCase()
    );

    return responseOptions.every(
      (option) => option && actualOptions?.includes(option.toLowerCase())
    );
  }

  private validateMultiCorrectWithOther(
    extractedValue: ExtractedValue,
    response: MultiCorrectOrMultipleOption[]
  ): boolean {
    const isMulticorrect = this.validateMultiCorrect(extractedValue, response);
    const isValidOther = response.some(
      (option) =>
        option.isOther && this.validateText(option.otherOptionValue || '')
    );
    return isMulticorrect || isValidOther;
  }

  private validateMultipleChoice(
    extractedValue: ExtractedValue,
    response: MultiCorrectOrMultipleOption
  ): boolean {
    if (!response || typeof response.optionText !== 'string') {
      console.log('Response must have a valid optionText.');
      return false;
    }

    const trimmedResponse = response.optionText.trim().toLowerCase();

    const actualOptions =
      extractedValue.options?.map((option) =>
        option.data.trim().toLowerCase()
      ) || [];

    console.log('Actual Options:', actualOptions);
    console.log('Trimmed Response:', trimmedResponse);

    const isValid = actualOptions.includes(trimmedResponse);

    console.log('Is Valid:', isValid);
    console.log('Validation worked');
    return isValid;
  }

  private validateMultipleChoiceWithOther(
    extractedValue: ExtractedValue,
    response: MultiCorrectOrMultipleOption
  ): boolean {
    const isValidChoice = this.validateMultipleChoice(extractedValue, response);

    const isOtherOption = response.isOther ?? false;

    console.log(!!isValidChoice);
    console.log(isOtherOption);

    return !!isValidChoice || isOtherOption;
  }

  private validateLinearScale(
    extractedValue: ExtractedValue,
    response: GenericLLMResponse
  ): boolean {
    console.log(response);
    const selectedValue = parseInt(response.answer, 10);
    console.log('hello ' + selectedValue);
    if (isNaN(selectedValue)) {
      return false;
    }

    const validOptions = (extractedValue.options ?? []).map(
      (option) => option.data
    );

    if (!validOptions.includes(selectedValue.toString())) {
      return false;
    }
    // console.log("found LinearScale")
    return true;
  }

  private validateMultipleChoiceGrid(
    extractedValue: ExtractedValue,
    response: RowColumn[]
  ): boolean {
    if (response.length !== (extractedValue.rowColumnOption || []).length) {
      return false;
    }

    return response.every((responseRow, rowIndex) => {
      const actualRow = extractedValue.rowColumnOption?.[rowIndex];
      if (!actualRow) return false;

      const selectedColumn = responseRow.selectedColumn.trim().toLowerCase();

      const actualColumns = actualRow.cols.map((col) =>
        col.data.trim().toLowerCase()
      );

      return actualColumns.includes(selectedColumn);
    });
  }

  // TODO: Implement this : DONE
  private validateCheckBoxGrid(
    extractedValue: ExtractedValue,
    response: RowColumnOption[]
  ): boolean {
    if (response.length !== (extractedValue.rowColumnOption || []).length) {
      return false;
    }

    return response.every((responseRow, rowIndex) => {
      const actualRow = extractedValue.rowColumnOption?.[rowIndex];
      if (!actualRow) return false;

      const selectedColumns = responseRow.cols.map((col) =>
        col.data.trim().toLowerCase()
      );

      const actualColumns = actualRow.cols.map((col) =>
        col.data.trim().toLowerCase()
      );

      return selectedColumns.every((selectedCol) =>
        actualColumns.includes(selectedCol)
      );
    });
  }

  private validateDropdown(
    extractedValue: ExtractedValue,
    response: MultiCorrectOrMultipleOption[]
  ): boolean {
    return true;
    return this.validateMultipleChoice(extractedValue, response);
  }
}
