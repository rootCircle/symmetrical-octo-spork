import { DetectBoxTypeTimeCacher } from '@docFillerCore/detectors/detectBoxTypeTimeCacher';
import { QType } from '@utils/questionTypes';
import { EMPTY_STRING } from '@utils/constant';

export class DetectBoxType {
  private timeCacher: DetectBoxTypeTimeCacher;

  constructor() {
    this.timeCacher = new DetectBoxTypeTimeCacher();
  }

  public detectType(element: HTMLElement): QType | null {
    const possibleBoxesMethod: {
      [key in QType]: (element: HTMLElement) => boolean;
    } = {
      [QType.DROPDOWN]: this.isDropdown,
      [QType.TEXT]: this.isText,
      [QType.PARAGRAPH]: this.isParagraph,
      [QType.TEXT_EMAIL]: this.isTextEmail,
      [QType.TEXT_NUMERIC]: this.isTextNumeric,
      [QType.TEXT_TEL]: this.isTextTelephone,
      [QType.TEXT_URL]: this.isTextURL,
      [QType.MULTI_CORRECT]: this.isMultiCorrect,
      [QType.MULTI_CORRECT_WITH_OTHER]: this.isMultiCorrectWithOther,
      [QType.LINEAR_SCALE]: this.isLinearScale,
      [QType.MULTIPLE_CHOICE]: this.isMultipleChoice,
      [QType.MULTIPLE_CHOICE_WITH_OTHER]: this.isMultipleChoiceWithOther,
      [QType.MULTIPLE_CHOICE_GRID]: this.isMultipleChoiceGrid,
      [QType.CHECKBOX_GRID]: this.isCheckboxGrid,
      [QType.DATE]: this.isDate,
      [QType.DATE_AND_TIME]: this.isDateAndTime,
      [QType.TIME]: this.isTime,
      [QType.DURATION]: this.isDuration,
      [QType.DATE_WITHOUT_YEAR]: this.isDateWithoutYear,
      [QType.DATE_TIME_WITHOUT_YEAR]: this.isDateWithoutYearWithTime,
      [QType.DATE_TIME_WITH_MERIDIEM]: this.isDateAndTimeWithMeridiem,
      [QType.TIME_WITH_MERIDIEM]: this.isTimeWithMeridiem,
      [QType.DATE_TIME_WITH_MERIDIEM_WITHOUT_YEAR]:
        this.isDateWithoutYearWithTimeAndMeridiem,
    };

    for (const key in possibleBoxesMethod) {
      if (possibleBoxesMethod[key as QType](element)) {
        return key as QType;
      }
    }

    return null;
  }

  public isDropdown(element: HTMLElement): boolean {
    return Boolean(
      element.querySelector('div[role=listbox]') &&
        !element.querySelector('input')
    );
  }

  private isText(element: HTMLElement): boolean {
    const inputFields = element.querySelectorAll('input');
    const inputType =
      inputFields.length === 1 ? inputFields[0].getAttribute('type') : null;
    return (
      inputFields.length === 1 &&
      inputType !== 'hidden' &&
      !['email', 'tel', 'url', 'number'].includes(inputType || EMPTY_STRING)
    );
  }

  private isParagraph(element: HTMLElement): boolean {
    return Boolean(element.querySelector('textarea'));
  }

  private isTextEmail(element: HTMLElement): boolean {
    return Boolean(element.querySelector('input[type=email]'));
  }

  private isTextNumeric(element: HTMLElement): boolean {
    return Boolean(element.querySelector('input[type=number]'));
  }

  private isTextTelephone(element: HTMLElement): boolean {
    return Boolean(element.querySelector('input[type=tel]'));
  }

  private isTextURL(element: HTMLElement): boolean {
    return Boolean(element.querySelector('input[type=url]'));
  }

  private isMultiCorrect(element: HTMLElement): boolean {
    const options = element.querySelectorAll('div[role=list] label');
    const optionCount = options.length;
    return Boolean(
      element.querySelector('div[role=list]') &&
        !(
          optionCount > 0 &&
          options[optionCount - 1].nextElementSibling &&
          options[optionCount - 1].nextElementSibling?.querySelector(
            'input:not([type=hidden])'
          )
        )
    );
  }

  private isMultiCorrectWithOther(element: HTMLElement): boolean {
    const options = element.querySelectorAll('div[role=list] label');
    const optionCount = options.length;
    return Boolean(
      element.querySelector('div[role=list]') &&
        optionCount > 0 &&
        options[optionCount - 1].nextElementSibling &&
        options[optionCount - 1].nextElementSibling?.querySelector(
          'input:not([type=hidden])'
        )
    );
  }

  private isLinearScale(element: HTMLElement): boolean {
    const optionBox = element.querySelector('div[role=radiogroup] label');
    return Boolean(
      optionBox &&
        optionBox.querySelector('div') &&
        !optionBox.querySelector('span')
    );
  }

  private isMultipleChoice(element: HTMLElement): boolean {
    const options = element.querySelectorAll('div[role=radiogroup] label');
    const optionCount = options.length;
    return Boolean(
      element.querySelector('div[role=radiogroup] label span') &&
        !(
          optionCount > 0 &&
          options[optionCount - 1].nextElementSibling &&
          options[optionCount - 1].nextElementSibling?.querySelector(
            'input:not([type=hidden])'
          )
        )
    );
  }

  private isMultipleChoiceWithOther(element: HTMLElement): boolean {
    const options = element.querySelectorAll('div[role=radiogroup] label');
    const optionCount = options.length;
    return Boolean(
      element.querySelector('div[role=radiogroup] label span') &&
        optionCount > 0 &&
        options[optionCount - 1].nextElementSibling &&
        options[optionCount - 1].nextElementSibling?.querySelector(
          'input:not([type=hidden])'
        )
    );
  }

  private isCheckboxGrid(element: HTMLElement): boolean {
    return Boolean(
      element.querySelector('div[role=group] label div[role=checkbox]')
    );
  }

  private isMultipleChoiceGrid(element: HTMLElement): boolean {
    /**
     *  UNSTABLE [Refer Tweak for details]
     *  Tweak:
     *  - Multiple Grid are grouped horizontally for each row.
     *  - It was expectedly known that each row has
     *    a `radiogroup` role for each containing row.
     *  - Inside that div houses a span with `presentation` role still housing the entire row.
     *  - But the same feature is realized for Multiple Choice and Linear Scale.
     *  - To differentiate, we had to extract rendered style properties for that span.
     *    Any design changes done externally will make this unusable.
     *  - To differentiate, we are checking the display property for the rendered span to be `table-row`.
     *    The other two, Multiple Choice and Linear Scale, have a display property set to `flex`.
     *  - This means any external extension redesigning the page may break this function.
     *  - To be extra pedantic, we ensure that the child of that span actually has radio buttons,
     *    which is a div with role `radio`.
     */

    const radioGroups = element.querySelector(
      'div[role=radiogroup] span[role=presentation]'
    );
    const hasTableRowDisplay =
      radioGroups && getComputedStyle(radioGroups).display === 'table-row';
    return Boolean(
      hasTableRowDisplay && radioGroups.querySelector('div[role=radio]')
    );
  }

  private isDate(element: HTMLElement): boolean {
    const [
      inputFieldCount,
      hasYear,
      hasMonth,
      hasDate,
      hasHour,
      hasMinute,
      hasSecond,
      hasMeridiemField,
    ] = this.timeCacher.getTimeParams(element);

    return Boolean(
      inputFieldCount === 3 &&
        hasYear &&
        hasMonth &&
        hasDate &&
        !hasHour &&
        !hasMinute &&
        !hasSecond &&
        !hasMeridiemField
    );
  }

  private isDateAndTime(element: HTMLElement): boolean {
    const [
      inputFieldCount,
      hasYear,
      hasMonth,
      hasDate,
      hasHour,
      hasMinute,
      hasSecond,
      hasMeridiemField,
    ] = this.timeCacher.getTimeParams(element);

    return Boolean(
      inputFieldCount === 5 &&
        hasYear &&
        hasMonth &&
        hasDate &&
        hasHour &&
        hasMinute &&
        !hasSecond &&
        !hasMeridiemField
    );
  }

  private isTime(element: HTMLElement): boolean {
    const [
      inputFieldCount,
      hasYear,
      hasMonth,
      hasDate,
      hasHour,
      hasMinute,
      hasSecond,
      hasMeridiemField,
    ] = this.timeCacher.getTimeParams(element);

    return Boolean(
      inputFieldCount === 2 &&
        !hasYear &&
        !hasMonth &&
        !hasDate &&
        hasHour &&
        hasMinute &&
        !hasSecond &&
        !hasMeridiemField
    );
  }

  private isDuration(element: HTMLElement): boolean {
    const [
      inputFieldCount,
      hasYear,
      hasMonth,
      hasDate,
      hasHour,
      hasMinute,
      hasSecond,
      hasMeridiemField,
    ] = this.timeCacher.getTimeParams(element);

    const hasHourReal = Boolean(
      element.querySelector('input[aria-label="Hours"]')
    );
    const hasMinuteReal = Boolean(
      element.querySelector('input[aria-label="Minutes"]')
    );

    return Boolean(
      inputFieldCount === 3 &&
        !hasYear &&
        !hasMonth &&
        !hasDate &&
        hasHourReal &&
        hasMinuteReal &&
        hasSecond &&
        !hasMeridiemField
    );
  }

  private isDateWithoutYear(element: HTMLElement): boolean {
    const [
      inputFieldCount,
      hasYear,
      hasMonth,
      hasDate,
      hasHour,
      hasMinute,
      hasSecond,
      hasMeridiemField,
    ] = this.timeCacher.getTimeParams(element);

    return Boolean(
      inputFieldCount === 2 &&
        !hasYear &&
        hasMonth &&
        hasDate &&
        !hasHour &&
        !hasMinute &&
        !hasSecond &&
        !hasMeridiemField
    );
  }

  private isDateWithoutYearWithTime(element: HTMLElement): boolean {
    const [
      inputFieldCount,
      hasYear,
      hasMonth,
      hasDate,
      hasHour,
      hasMinute,
      hasSecond,
      hasMeridiemField,
    ] = this.timeCacher.getTimeParams(element);

    return Boolean(
      inputFieldCount === 4 &&
        !hasYear &&
        hasMonth &&
        hasDate &&
        hasHour &&
        hasMinute &&
        !hasSecond &&
        !hasMeridiemField
    );
  }

  private isDateAndTimeWithMeridiem(element: HTMLElement): boolean {
    const [
      inputFieldCount,
      hasYear,
      hasMonth,
      hasDate,
      hasHour,
      hasMinute,
      hasSecond,
      hasMeridiemField,
    ] = this.timeCacher.getTimeParams(element);

    return Boolean(
      inputFieldCount === 5 &&
        hasYear &&
        hasMonth &&
        hasDate &&
        hasHour &&
        hasMinute &&
        !hasSecond &&
        hasMeridiemField
    );
  }

  private isTimeWithMeridiem(element: HTMLElement): boolean {
    const [
      inputFieldCount,
      hasYear,
      hasMonth,
      hasDate,
      hasHour,
      hasMinute,
      hasSecond,
      hasMeridiemField,
    ] = this.timeCacher.getTimeParams(element);

    return Boolean(
      inputFieldCount === 3 &&
        !hasYear &&
        !hasMonth &&
        !hasDate &&
        hasHour &&
        hasMinute &&
        !hasSecond &&
        hasMeridiemField
    );
  }

  private isDateWithoutYearWithTimeAndMeridiem(element: HTMLElement): boolean {
    const [
      inputFieldCount,
      hasYear,
      hasMonth,
      hasDate,
      hasHour,
      hasMinute,
      hasSecond,
      hasMeridiemField,
    ] = this.timeCacher.getTimeParams(element);

    return Boolean(
      inputFieldCount === 4 &&
        !hasYear &&
        hasMonth &&
        hasDate &&
        hasHour &&
        hasMinute &&
        !hasSecond &&
        hasMeridiemField
    );
  }
}
