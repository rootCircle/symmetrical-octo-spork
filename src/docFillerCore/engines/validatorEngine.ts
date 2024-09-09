import { EMPTY_STRING } from '@utils/constant';
import { QType } from '@utils/questionTypes';

export class ValidatorEngine {
  constructor() {}

  public validate(
    fieldType: QType,
    extractedValue: ExtractedValue,
    response: any
  ): boolean | null {
    if (!response) {
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
        case QType.DATE_TIME_WITH_MERIDIEM:
          return this.validateDateTimeWithMeridiem(response);
        case QType.DATE_TIME_WITH_MERIDIEM_WITHOUT_YEAR:
          return this.validateDateTimeWithMeridiemWithoutYear(response);
        case QType.TEXT_URL:
          return this.validateTextUrl(response);
        case QType.TIME_WITH_MERIDIEM:
          return this.validateTimeWithMeridiem(response);
      }
    } else {
      return false;
    }
  }

  private validateText(response: string): boolean {
    const text = response.trim();
    return text.length > 0 && !(text.includes('\n') || text.includes('\r'));
  }

  private validateTextUrl(response: string): boolean {
    return this.validateText(response);
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
    return response instanceof Date && !isNaN(response.valueOf());
  }

  private validateDateAndTime(response: Date): boolean {
    return this.validateDate(response);
  }

  private validateTime(response: Date): boolean {
    return this.validateDate(response);
  }

  private validateTimeWithMeridiem(response: Date): boolean {
    return this.validateDate(response);
  }

  private validateDuration(response: string): boolean {
    // Accepts: hh-mm-ss
    const durationValid = /^([01][0-9]|[2][0-3])(-[0-5][0-9]){2}$/;
    return Boolean(response && response.match(durationValid));
  }

  private validateDateWithoutYear(response: Date): boolean {
    return this.validateDate(response);
  }

  private validateDateTimeWithoutYear(response: Date): boolean {
    return this.validateDate(response);
  }

  private validateDateTimeWithMeridiem(response: Date): boolean {
    return this.validateDate(response);
  }

  private validateDateTimeWithMeridiemWithoutYear(response: Date): boolean {
    return this.validateDate(response);
  }

  private validateMultiCorrect(
    extractedValue: ExtractedValue,
    response: MultiCorrectOrMultipleOption[]
  ): boolean {
    const responseOptions = response
      .map((option) => option.optionText?.trim())
      .filter((text) => Boolean(text));

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
        option.isOther &&
        option.otherOptionValue &&
        this.validateText(option?.otherOptionValue)
    );
    return isMulticorrect || !(isMulticorrect || isValidOther);
  }

  private validateMultipleChoice(
    extractedValue: ExtractedValue,
    response: MultiCorrectOrMultipleOption
  ): boolean {
    if (typeof response.optionText !== 'string') {
      return false;
    }

    const trimmedResponse = response.optionText.trim().toLowerCase();

    const actualOptions =
      extractedValue.options?.map((option) =>
        option.data.trim().toLowerCase()
      ) || [];

    const isValid = actualOptions.includes(trimmedResponse);
    return isValid;
  }

  private validateMultipleChoiceWithOther(
    extractedValue: ExtractedValue,
    response: MultiCorrectOrMultipleOption
  ): boolean {
    const isValidChoice = this.validateMultipleChoice(extractedValue, response);

    const isOtherOption =
      (response.isOther ?? false) &&
      response.otherOptionValue &&
      this.validateText(response.otherOptionValue);

    return isValidChoice || Boolean(isOtherOption);
  }

  private validateLinearScale(
    extractedValue: ExtractedValue,
    response: GenericLLMResponse
  ): boolean {
    const validOptions = (extractedValue.options ?? []).map(
      (option) => option.data
    );

    return validOptions.includes(response?.answer ?? EMPTY_STRING);
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
    response: GenericLLMResponse
  ): boolean {
    return true;
    // return this.validateMultipleChoice(extractedValue, response);
  }
}
