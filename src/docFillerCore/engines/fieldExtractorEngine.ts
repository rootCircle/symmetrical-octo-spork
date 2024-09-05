import { QType } from '@utils/questionTypes';

import { EMPTY_STRING } from '@utils/constant';

export class FieldExtractorEngine {
  /**
   * Extracts the questions and description from the DOM object and returns it
   * It might also extract the options in case of MCQs or other types, where answers do
   * play a critical role
   */

  getFields(element: HTMLElement, fieldType: QType): ExtractedValue {
    let fields = {
      title: this.getTitle(element),
      description: this.getDescription(element),
    };

    // Append dynamic values like options based on the field type
    const optionFields = this.getParams(fieldType, element);
    fields = { ...fields, ...optionFields };

    return fields;
  }

  getParams(questionType: QType, element: HTMLElement): ExtractedValue | null {
    // Function for extracting options based on question type

    switch (questionType) {
      case QType.MULTI_CORRECT:
        return this.getParamsMultiCorrect(element) as ExtractedValue;

      case QType.MULTI_CORRECT_WITH_OTHER:
        return this.getParamsMultiCorrectWithOther(element) as ExtractedValue;

      case QType.MULTIPLE_CHOICE:
        return this.getParamsMultipleChoice(element) as ExtractedValue;

      case QType.MULTIPLE_CHOICE_WITH_OTHER:
        return this.getParamsMultipleChoiceWithOther(element) as ExtractedValue;

      case QType.LINEAR_SCALE:
        return this.getParamsLinearScale(element) as ExtractedValue;

      case QType.CHECKBOX_GRID:
        return this.getParamsCheckboxGrid(element) as ExtractedValue;

      case QType.MULTIPLE_CHOICE_GRID:
        return this.getParamsMultipleChoiceGrid(element) as ExtractedValue;

      case QType.DROPDOWN:
        return this.getParamsDropdown(element) as ExtractedValue;

      case QType.TEXT:
        return this.getDomText(element) as ExtractedValue;

      case QType.PARAGRAPH:
        return this.getDomTextParagraph(element) as ExtractedValue;

      case QType.TEXT_EMAIL:
        return this.getDomTextEmail(element) as ExtractedValue;

      case QType.TEXT_NUMERIC:
        return this.getDomTextNumeric(element) as ExtractedValue;

      case QType.TEXT_TEL:
        return this.getDomTextTel(element) as ExtractedValue;

      case QType.TEXT_URL:
        return this.getDomTextUrl(element) as ExtractedValue;

      case QType.DATE:
        return this.getDomDate(element) as ExtractedValue;

      case QType.DATE_AND_TIME:
        return this.getDomDateAndTime(element) as ExtractedValue;

      case QType.TIME:
        return this.getDomTime(element) as ExtractedValue;

      case QType.DURATION:
        return this.getDomDuration(element) as ExtractedValue;

      case QType.DATE_WITHOUT_YEAR:
        return this.getDomDateWithoutYear(element) as ExtractedValue;

      case QType.DATE_TIME_WITHOUT_YEAR:
        return this.getDomDateTimeWithoutYear(element) as ExtractedValue;

      case QType.DATE_TIME_WITH_MERIDIEM:
        return this.getDomDateTimeWithMeridiem(element) as ExtractedValue;

      case QType.TIME_WITH_MERIDIEM:
        return this.getDomTimeWithMeridiem(element) as ExtractedValue;

      case QType.DATE_TIME_WITH_MERIDIEM_WITHOUT_YEAR:
        return this.getDomDateTimeWithMeridiemWithoutYear(
          element
        ) as ExtractedValue;
    }
  }

  private getTitle(element: HTMLElement): string {
    let required = element.querySelector('div[role="heading"]');

    if (!required) {
      return EMPTY_STRING;
    }

    required = required.children[0] as HTMLElement;

    let content = EMPTY_STRING;

    Array.from(required.childNodes).forEach((node) => {
      if (node.nodeName === '#text') {
        content += `${(node as Text).textContent}\n`;
      } else {
        content += `${(node as HTMLElement).textContent}\n`;
      }
    });

    return content.trimEnd();
  }

  private getDescription(element: HTMLElement): string | null {
    let headingElement = element.querySelector('div[role="heading"]');

    if (!headingElement) {
      return null;
    }

    // Get the second child of the parent element of the div with role="heading"
    let required = headingElement.parentElement?.children[1] as HTMLElement;

    if (!required || required.textContent === EMPTY_STRING) {
      return null;
    }

    let content = EMPTY_STRING;

    Array.from(required.childNodes).forEach((node) => {
      if (node.nodeName === '#text') {
        content += `${(node as Text).textContent}\n`;
      } else {
        content += `${(node as HTMLElement).textContent}\n`;
      }
    });

    return content.trimEnd();
  }

  private getParamsMultiCorrect(
    element: HTMLElement
  ): ParamsMultiChoiceOrCorrectResult {
    const optionLabels = element.querySelectorAll('span[dir="auto"]');

    if (optionLabels.length === 0) {
      return { options: [] };
    }

    const superDivs = element.querySelectorAll('div[role="checkbox"]');
    const clickElements: HTMLElement[] = [];

    superDivs.forEach((optionDiv) => {
      const thirdDiv = optionDiv.children[2] as HTMLElement;
      const clickDiv = thirdDiv.firstElementChild as HTMLElement;
      if (clickDiv) {
        clickElements.push(clickDiv.firstElementChild as HTMLElement);
      }
    });

    const optionData: string[] = [];
    optionLabels.forEach((label) => {
      optionData.push(label.textContent?.trim() || EMPTY_STRING);
    });

    const options: Option[] = [];

    if (
      clickElements.length > 0 &&
      clickElements.length === optionData.length
    ) {
      for (let i = 0; i < clickElements.length; i++) {
        options.push({ data: optionData[i], dom: clickElements[i] });
      }
    }

    return { options };
  }

  private getParamsMultiCorrectWithOther(
    element: HTMLElement
  ): ParamsMultiChoiceOrCorrectResult {
    const optionLabels = element.querySelectorAll('span[dir="auto"]');

    if (optionLabels.length === 0) {
      return { options: [], other: [] };
    }

    const superDivs = element.querySelectorAll('div[role="checkbox"]');
    const clickElements: HTMLElement[] = [];

    superDivs.forEach((optionDiv) => {
      const thirdDiv = optionDiv.children[2] as HTMLElement;
      const clickDiv = thirdDiv.firstElementChild as HTMLElement;
      if (clickDiv) {
        clickElements.push(clickDiv.firstElementChild as HTMLElement);
      }
    });

    const optionData: string[] = [];
    optionLabels.forEach((label) => {
      if (label.textContent) {
        optionData.push(label.textContent.trim());
      }
    });

    const options: Option[] = [];
    const otherOption: OtherOption[] = [];

    // Remove the last option and add 'other_option' field in the object
    const lastOptionIndex = optionData.length - 1;
    const otherOptionData = optionData.splice(lastOptionIndex, 1)[0];

    if (
      clickElements.length > 0 &&
      clickElements.length === optionData.length + 1
    ) {
      for (let i = 0; i < clickElements.length - 1; i++) {
        options.push({ data: optionData[i], dom: clickElements[i] });
      }
      const inputInMultiCorrectWithOther = element.querySelector(
        'input[dir="auto"]'
      ) as HTMLInputElement;
      otherOption.push({
        data: otherOptionData,
        dom: clickElements[clickElements.length - 1],
        inputBoxDom: inputInMultiCorrectWithOther,
      });
    }

    return { options, other: otherOption };
  }

  private getParamsMultipleChoice(
    element: HTMLElement
  ): ParamsMultiChoiceOrCorrectResult {
    const optionLabels = element.querySelectorAll('span[dir="auto"]');

    if (optionLabels.length === 0) {
      return { options: [] };
    }

    const superDivs = element.querySelectorAll('div[role="radio"]');
    const clickElements: HTMLElement[] = [];

    superDivs.forEach((optionDiv) => {
      const thirdDiv = optionDiv.children[2] as HTMLElement;
      const clickDiv = thirdDiv.firstElementChild as HTMLElement;
      if (clickDiv) {
        clickElements.push(clickDiv);
      }
    });

    const optionData: string[] = [];
    optionLabels.forEach((label) => {
      if (label.textContent) {
        optionData.push(label.textContent.trim());
      }
    });

    const options: Option[] = [];

    if (
      clickElements.length > 0 &&
      clickElements.length === optionData.length
    ) {
      for (let i = 0; i < clickElements.length; i++) {
        options.push({ data: optionData[i], dom: clickElements[i] });
      }
    }

    return { options };
  }

  private getParamsMultipleChoiceWithOther(
    element: HTMLElement
  ): ParamsMultiChoiceOrCorrectResult {
    const optionLabels = element.querySelectorAll('span[dir="auto"]');

    if (optionLabels.length === 0) {
      // Return an empty options array if no option labels are found
      return { options: [], other: [] };
    }

    const superDivs = element.querySelectorAll('div[role="radio"]');
    const clickElements: HTMLElement[] = [];

    superDivs.forEach((optionDiv) => {
      const thirdDiv = optionDiv.children[2] as HTMLElement;
      const clickDiv = thirdDiv.firstElementChild as HTMLElement;
      if (clickDiv) {
        clickElements.push(clickDiv.firstElementChild as HTMLElement);
      }
    });

    const optionData: string[] = [];
    optionLabels.forEach((label) => {
      if (label.textContent) {
        optionData.push(label.textContent.trim());
      }
    });

    const options: Option[] = [];
    const otherDom: OtherOption[] = [];

    // Remove the last option and add 'Other' field in the object
    const lastOptionIndex = optionData.length - 1;
    const otherOptionData = optionData.splice(lastOptionIndex, 1)[0];

    if (
      clickElements.length > 0 &&
      clickElements.length === optionData.length + 1
    ) {
      for (let i = 0; i < clickElements.length - 1; i++) {
        options.push({ data: optionData[i], dom: clickElements[i] });
      }
      const inputInMultipleChoiceWithOther = element.querySelector(
        'input[dir="auto"]'
      ) as HTMLInputElement;
      otherDom.push({
        data: otherOptionData,
        dom: clickElements[clickElements.length - 1],
        inputBoxDom: inputInMultipleChoiceWithOther,
      });
    }

    return { options, other: otherDom };
  }

  private getParamsLinearScale(element: HTMLElement): ParamsLinearScaleResult {
    const elementsWithHierarchy =
      element
        .querySelector('span[role="presentation"]')
        ?.querySelectorAll('div > div:last-child > div:last-child') || [];

    let lowerBound: string = EMPTY_STRING;
    let upperBound: string = EMPTY_STRING;

    const superDivs = element.querySelectorAll('div[role="radio"]');
    const domsArray: HTMLElement[] = [];

    superDivs.forEach((optionDiv) => {
      const thirdDiv = optionDiv.children[2] as HTMLElement;
      const clickDiv = thirdDiv.firstElementChild as HTMLElement;
      const targetDom = clickDiv.firstElementChild as HTMLElement;
      if (targetDom) {
        domsArray.push(targetDom);
      }
    });

    // Determine lowerBound and upperBound
    elementsWithHierarchy.forEach((elm, index) => {
      const textContent = elm.textContent?.trim() || EMPTY_STRING;
      if (lowerBound === EMPTY_STRING && textContent !== EMPTY_STRING) {
        lowerBound = textContent;
      } else if (lowerBound !== EMPTY_STRING && textContent !== EMPTY_STRING) {
        upperBound = textContent;
      }
    });

    const optionElements = element.querySelectorAll('div[dir="auto"]');
    const options = Array.from(optionElements).map(
      (optionElement) => optionElement.textContent?.trim() || EMPTY_STRING
    );

    const optionsArray: Option[] = [];
    if (domsArray.length > 0) {
      let j = 0;
      for (let i = 0; i < options.length; i++) {
        if (options[i] !== EMPTY_STRING) {
          optionsArray.push({ data: options[i], dom: domsArray[j++] });
        }
      }
    }

    const lowerUpperBound: LowerUpperBound = { lowerBound, upperBound };

    return { bounds: lowerUpperBound, options: optionsArray };
  }

  private getParamsMultipleChoiceGrid(
    element: HTMLElement
  ): ParamsMultipleChoiceGridResult {
    const path =
      'div:first-child > div:first-child > div:nth-child(2) > div:first-child > div:nth-child(2) > div';

    const rows = element.querySelectorAll('div[role="radiogroup"]');
    const columns = element.querySelectorAll(`${path}:first-child > div`);

    const columnsArray = Array.from(columns)
      .slice(1)
      .map((column) => column.textContent?.trim() || EMPTY_STRING);

    const rowsArray = Array.from(rows).map(
      (row) => row.textContent?.trim() || EMPTY_STRING
    );

    const optionsArray: HTMLElement[][] = [];
    rows.forEach((row) => {
      const childColumns = row.querySelectorAll('div[role="radio"]');
      const rowColumns: HTMLElement[] = [];

      childColumns.forEach((column) => {
        const targetDom = column;
        rowColumns.push(targetDom as HTMLElement);
      });

      optionsArray.push(rowColumns);
    });

    const optionDom: Option[] = [];
    for (let i = 0; i < rowsArray.length; i++) {
      for (let j = 0; j < columnsArray.length; j++) {
        optionDom.push({ data: columnsArray[j], dom: optionsArray[i][j] });
      }
    }

    const rowColDom: RowColumnOption[] = [];
    let q = 0;
    for (let i = 0; i < rowsArray.length; i++) {
      const cols = [];
      for (let p = q; p < columnsArray.length * (i + 1); p++, q++) {
        cols.push(optionDom[p]);
      }
      rowColDom.push({ row: rowsArray[i], cols });
    }

    return {
      rowColumnOption: rowColDom,
      rowArray: rowsArray,
      columnArray: columnsArray,
    };
  }

  private getParamsCheckboxGrid(element: HTMLElement): CheckboxGridResult {
    const path =
      'div:first-child > div:first-child > div:nth-child(2) > div:first-child > div:nth-child(2) > div';

    const rows = element.querySelectorAll(`${path}:nth-child(2n)`);
    const columns = element.querySelectorAll(`${path}:first-child > div`);

    const columnsArray = Array.from(columns)
      .slice(1)
      .map((column) => column.textContent?.trim() || EMPTY_STRING);

    const rowsArray = Array.from(rows).map(
      (row) => row.textContent?.trim() || EMPTY_STRING
    );

    const optionArray = Array.from(
      element.querySelectorAll('div[role=group] label')
    );

    const optionsArray: HTMLElement[][] = [];
    const rowsLength = rowsArray.length;
    const columnsLength = columnsArray.length;

    for (let i = 0; i < rowsLength; i++) {
      const rowArray: HTMLElement[] = [];
      for (let j = 0; j < columnsLength; j++) {
        const index = i * columnsLength + j;
        rowArray.push(optionArray[index] as HTMLElement);
      }
      optionsArray.push(rowArray);
    }

    const optionDom: Option[] = [];
    for (let i = 0; i < rowsArray.length; i++) {
      for (let j = 0; j < columnsArray.length; j++) {
        optionDom.push({ data: columnsArray[j], dom: optionsArray[i][j] });
      }
    }

    const rowColDom: RowColumnOption[] = [];
    let checkboxNumber = 0;

    for (let rowIndex = 0; rowIndex < rowsArray.length; rowIndex++) {
      const arr: Option[] = [];
      for (
        let p = checkboxNumber;
        p < columnsArray.length * (rowIndex + 1);
        p++, checkboxNumber++
      ) {
        arr.push(optionDom[p]);
      }
      rowColDom.push({ row: rowsArray[rowIndex], cols: arr });
    }

    return {
      rowColumnOption: rowColDom,
      rowArray: rowsArray,
      columnArray: columnsArray,
    };
  }

  private getParamsDropdown(element: HTMLElement): DropdownResult {
    const optionDivs = element.querySelectorAll('div[role="option"]');
    if (!optionDivs.length) {
      return { options: [] };
    }

    const options: Option[] = [];
    // 0th index is `Choose`
    for (let i = 1; i < optionDivs.length; i++) {
      const optionDiv = optionDivs[i];
      const span = optionDiv.querySelector('span');

      if (span) {
        options.push({
          data: span.textContent?.trim() || EMPTY_STRING,
          dom: optionDiv as HTMLElement,
        });
      }
    }

    return {
      dom: element.querySelector('div[role=listbox]') as HTMLElement,
      options,
    };
  }

  private getDomText(element: HTMLElement): DOMPointer {
    const inputField = element.querySelector('input[type=text]');
    return { dom: inputField as HTMLElement };
  }

  private getDomTextEmail(element: HTMLElement): DOMPointer {
    const inputField = element.querySelector(
      'input[type=text], input[type=email]'
    );
    return { dom: inputField as HTMLElement };
  }

  private getDomTextParagraph(element: HTMLElement): DOMPointer {
    const inputField = element.querySelector('textarea');
    return { dom: inputField as HTMLElement };
  }

  private getDomDate(element: HTMLElement): DateTimeDomFields {
    const inputField = element.querySelectorAll(
      'input[type=text], input[type=date]'
    );
    let dateDom: HTMLInputElement | null = null;
    let monthDom: HTMLInputElement | null = null;
    let yearDom: HTMLInputElement | null = null;

    inputField.forEach((input) => {
      switch (input.getAttribute('aria-label')) {
        case 'Day of the month':
          dateDom = input as HTMLInputElement;
          break;
        case 'Month':
          monthDom = input as HTMLInputElement;
          break;
        case 'Year':
          yearDom = input as HTMLInputElement;
          break;
        default:
          break;
      }
    });

    return { date: dateDom, month: monthDom, year: yearDom };
  }

  private getDomDateAndTime(element: HTMLElement): DateTimeDomFields {
    const inputField = element.querySelectorAll(
      'input[type=text], input[type=date]'
    );
    let dateDom: HTMLInputElement | null = null;
    let monthDom: HTMLInputElement | null = null;
    let yearDom: HTMLInputElement | null = null;
    let hourDom: HTMLInputElement | null = null;
    let minuteDom: HTMLInputElement | null = null;

    inputField.forEach((input) => {
      switch (input.getAttribute('aria-label')) {
        case 'Day of the month':
          dateDom = input as HTMLInputElement;
          break;
        case 'Month':
          monthDom = input as HTMLInputElement;
          break;
        case 'Year':
          yearDom = input as HTMLInputElement;
          break;
        case 'Hour':
          hourDom = input as HTMLInputElement;
          break;
        case 'Minute':
          minuteDom = input as HTMLInputElement;
          break;
        default:
          break;
      }
    });

    return {
      date: dateDom,
      month: monthDom,
      year: yearDom,
      hour: hourDom,
      minute: minuteDom,
    };
  }

  private getDomDuration(element: HTMLElement): DateTimeDomFields {
    const inputField = element.querySelectorAll('input[type=text]');
    let hourDom: HTMLInputElement | null = null;
    let minuteDom: HTMLInputElement | null = null;
    let secondDom: HTMLInputElement | null = null;

    inputField.forEach((input) => {
      switch (input.getAttribute('aria-label')) {
        case 'Hours':
          hourDom = input as HTMLInputElement;
          break;
        case 'Minutes':
          minuteDom = input as HTMLInputElement;
          break;
        case 'Seconds':
          secondDom = input as HTMLInputElement;
          break;
        default:
          break;
      }
    });

    return {
      hour: hourDom,
      minute: minuteDom,
      second: secondDom,
    };
  }

  private getDomDateWithoutYear(element: HTMLElement): DateTimeDomFields {
    const inputField = element.querySelectorAll(
      'input[type=text], input[type=date]'
    );
    let dateDom: HTMLInputElement | null = null;
    let monthDom: HTMLInputElement | null = null;

    inputField.forEach((input) => {
      switch (input.getAttribute('aria-label')) {
        case 'Day of the month':
          dateDom = input as HTMLInputElement;
          break;
        case 'Month':
          monthDom = input as HTMLInputElement;
          break;
        default:
          break;
      }
    });

    return { date: dateDom, month: monthDom };
  }

  getDomDateTimeWithoutYear(element: HTMLElement): DateTimeDomFields {
    const inputField = element.querySelectorAll(
      'input[type=text], input[type=date]'
    );
    let dateDom: HTMLInputElement | null = null;
    let monthDom: HTMLInputElement | null = null;
    let hourDom: HTMLInputElement | null = null;
    let minuteDom: HTMLInputElement | null = null;

    inputField.forEach((input) => {
      switch (input.getAttribute('aria-label')) {
        case 'Day of the month':
          dateDom = input as HTMLInputElement;
          break;
        case 'Month':
          monthDom = input as HTMLInputElement;
          break;
        case 'Hour':
          hourDom = input as HTMLInputElement;
          break;
        case 'Minute':
          minuteDom = input as HTMLInputElement;
          break;
        default:
          break;
      }
    });

    return {
      date: dateDom,
      month: monthDom,
      hour: hourDom,
      minute: minuteDom,
    };
  }

  private getDomTextNumeric(element: HTMLElement): DOMPointer {
    const inputField = element.querySelector(
      'input[type=text]'
    ) as HTMLInputElement;
    return { dom: inputField };
  }

  private getDomTextTel(element: HTMLElement): DOMPointer {
    const inputField = element.querySelector(
      'input[type=text]'
    ) as HTMLInputElement;
    return { dom: inputField };
  }

  private getDomTextUrl(element: HTMLElement): DOMPointer {
    const inputField = element.querySelector(
      'input[type=url]'
    ) as HTMLInputElement;
    return { dom: inputField };
  }

  private getDomDateTimeWithMeridiem(element: HTMLElement): DateTimeDomFields {
    const meridiem = element.querySelector('div[role=option]') as HTMLElement;
    const inputField = element.querySelectorAll(
      'input[type=text], input[type=date]'
    ) as NodeListOf<HTMLInputElement>;

    let dateDom: HTMLInputElement | null = null;
    let monthDom: HTMLInputElement | null = null;
    let yearDom: HTMLInputElement | null = null;
    let hourDom: HTMLInputElement | null = null;
    let minuteDom: HTMLInputElement | null = null;

    inputField.forEach((input) => {
      const ariaLabel = input.getAttribute('aria-label');
      switch (ariaLabel) {
        case 'Day of the month':
          dateDom = input;
          break;
        case 'Month':
          monthDom = input;
          break;
        case 'Year':
          yearDom = input;
          break;
        case 'Hour':
          hourDom = input;
          break;
        case 'Minute':
          minuteDom = input;
          break;
      }
    });

    return {
      date: dateDom,
      month: monthDom,
      year: yearDom,
      hour: hourDom,
      minute: minuteDom,
      meridiem,
    };
  }

  private getDomTimeWithMeridiem(element: HTMLElement): DateTimeDomFields {
    const meridiem = element.querySelector('div[role=option]') as HTMLElement;
    const inputField = element.querySelectorAll(
      'input[type=text], input[type=date]'
    ) as NodeListOf<HTMLInputElement>;

    let hourDom: HTMLInputElement | null = null;
    let minuteDom: HTMLInputElement | null = null;

    inputField.forEach((input) => {
      const ariaLabel = input.getAttribute('aria-label');
      switch (ariaLabel) {
        case 'Hour':
          hourDom = input;
          break;
        case 'Minute':
          minuteDom = input;
          break;
      }
    });

    return { hour: hourDom, minute: minuteDom, meridiem };
  }

  private getDomDateTimeWithMeridiemWithoutYear(
    element: HTMLElement
  ): DateTimeDomFields {
    const meridiem = element.querySelector('div[role=option]') as HTMLElement;
    const inputField = element.querySelectorAll(
      'input[type=text], input[type=date]'
    ) as NodeListOf<HTMLInputElement>;

    let dateDom: HTMLInputElement | null = null;
    let monthDom: HTMLInputElement | null = null;
    let hourDom: HTMLInputElement | null = null;
    let minuteDom: HTMLInputElement | null = null;

    inputField.forEach((input) => {
      const ariaLabel = input.getAttribute('aria-label');
      switch (ariaLabel) {
        case 'Day of the month':
          dateDom = input;
          break;
        case 'Month':
          monthDom = input;
          break;
        case 'Hour':
          hourDom = input;
          break;
        case 'Minute':
          minuteDom = input;
          break;
      }
    });

    return {
      date: dateDom,
      month: monthDom,
      hour: hourDom,
      minute: minuteDom,
      meridiem,
    };
  }

  private getDomTime(element: HTMLElement): DateTimeDomFields {
    const inputField = element.querySelectorAll(
      'input[type=text]'
    ) as NodeListOf<HTMLInputElement>;

    let hourDom: HTMLInputElement | null = null;
    let minuteDom: HTMLInputElement | null = null;

    inputField.forEach((input) => {
      const ariaLabel = input.getAttribute('aria-label');
      switch (ariaLabel) {
        case 'Hour':
          hourDom = input;
          break;
        case 'Minute':
          minuteDom = input;
          break;
      }
    });

    return { hour: hourDom, minute: minuteDom };
  }
}
