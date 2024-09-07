import { QType } from '@utils/questionTypes.ts';
import { SLEEP_DURATION } from '@utils/constant';

// Sleep utility function
function sleep(milliseconds: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

export class FillerEngine {
  public async fill(
    fieldType: QType,
    fieldValue: ExtractedValue,
    value: string
  ): Promise<boolean> {
    if (fieldType === null) return false;

    switch (fieldType) {
      case QType.TEXT:
        return this.fillText(fieldValue, '1000');

      case QType.TEXT_EMAIL:
        return this.fillEmail(fieldValue, 'harshit123@gmail.com');

      case QType.TEXT_URL:
        return this.fillTextURL(fieldValue, 'https://google.com');

      case QType.PARAGRAPH:
        return this.fillParagraph(fieldValue, 'this is a paragraph \new');

      case QType.LINEAR_SCALE:
        return await this.fillLinearScale(fieldValue, '1');

      case QType.DROPDOWN:
        return await this.fillDropDown(fieldValue, 'Option 3');

      case QType.CHECKBOX_GRID:
        return await this.fillCheckboxGrid(fieldValue, [
          {
            row: 'Row 1',
            cols: [{ data: 'Column 1' }, { data: 'Column 2' }],
          },
          { row: 'Row 2', cols: [{ data: 'Column 2' }] },
        ] as RowColumnOption[]);

      case QType.MULTIPLE_CHOICE_GRID:
        return await this.fillMultipleChoiceGrid(fieldValue, [
          { row: 'Row 1', selectedColumn: 'Column 1' },
          { row: 'Row 2', selectedColumn: 'Column 2' },
          { row: 'Brooooo', selectedColumn: 'Column 2' },
        ]);

      case QType.DATE: {
        const dateValue = new Date(
          'Mon Jun 17 2004 21:01:01 GMT+0530 (India Standard Time)'
        );
        return this.fillDate(fieldValue, dateValue);
      }

      case QType.DATE_AND_TIME: {
        const dateValue = new Date(
          'Mon Jun 17 2004 21:01:01 GMT+0530 (India Standard Time)'
        );
        return await this.fillDateAndTime(fieldValue, dateValue);
      }

      case QType.DATE_TIME_WITH_MERIDIEM: {
        const dateValue = new Date(
          'Mon Jun 17 2004 21:01:01 GMT+0530 (India Standard Time)'
        );
        return await this.fillDateAndTimeWithMeridiem(fieldValue, dateValue);
      }

      case QType.DATE_TIME_WITH_MERIDIEM_WITHOUT_YEAR: {
        const dateValue = new Date(
          'Mon Jun 17 2004 21:01:01 GMT+0530 (India Standard Time)'
        );
        return await this.fillDateTimeWithMeridiemWithoutYear(
          fieldValue,
          dateValue
        );
      }

      case QType.TIME_WITH_MERIDIEM: {
        const dateValue = new Date(
          'Mon Jun 17 2004 21:01:01 GMT+0530 (India Standard Time)'
        );
        return await this.fillTimeWithMeridiem(fieldValue, dateValue);
      }

      case QType.TIME: {
        const dateValue = new Date(
          'Mon Jun 17 2004 21:01:01 GMT+0530 (India Standard Time)'
        );
        return this.fillTime(fieldValue, dateValue);
      }

      case QType.DURATION: {
        return this.fillDuration(fieldValue, '11-11-11');
      }

      case QType.DATE_WITHOUT_YEAR: {
        const dateValue = new Date(
          'Mon Jun 17 2004 21:01:01 GMT+0530 (India Standard Time)'
        );
        return this.fillDateWithoutYear(fieldValue, dateValue);
      }

      case QType.DATE_TIME_WITHOUT_YEAR: {
        const dateValue = new Date(
          'Mon Jun 17 2004 21:01:01 GMT+0530 (India Standard Time)'
        );
        return await this.fillDateTimeWithoutYear(fieldValue, dateValue);
      }

      case QType.MULTI_CORRECT_WITH_OTHER:
      case QType.MULTI_CORRECT:
        return await this.fillMultiCorrectWithOther(fieldValue, [
          { optionText: 'Sightseeing' },
          { optionText: 'Day 2' },
          { isOther: true, otherOptionValue: 'My name is Andrew!' },
        ] as MultiCorrectOrMultipleOption[]);

      case QType.MULTIPLE_CHOICE_WITH_OTHER:
      case QType.MULTIPLE_CHOICE:
        return await this.fillMultipleChoiceWithOther(fieldValue, {
          // optionText: 'Option 2',
          isOther: true,
          otherOptionValue: 'Random',
        } as MultiCorrectOrMultipleOption);
    }
  }

  private fillText(fieldValue: ExtractedValue, value: string): boolean {
    const inputField = fieldValue.dom as HTMLInputElement;
    if (inputField) {
      inputField.value = value;
      inputField.dispatchEvent(new Event('input', { bubbles: true }));
      return true;
    }
    return false;
  }

  private fillEmail(fieldValue: ExtractedValue, value: string): boolean {
    return this.fillText(fieldValue, value);
  }

  private fillTextURL(fieldValue: ExtractedValue, value: string): boolean {
    return this.fillText(fieldValue, value);
  }

  private fillParagraph(fieldValue: ExtractedValue, value: string): boolean {
    return this.fillText(fieldValue, value);
  }

  private fillDate(fieldValue: ExtractedValue, value: any): boolean {
    if (value instanceof Date) return false;

    const date = value;

    if (isNaN(date.valueOf())) return false;

    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString();

    const inputEvent = new Event('input', { bubbles: true });

    if (fieldValue.date) {
      fieldValue.date.value = day;
      fieldValue.date.dispatchEvent(inputEvent);
    }

    if (fieldValue.month) {
      fieldValue.month.value = month;
      fieldValue.month.dispatchEvent(inputEvent);
    }

    if (fieldValue.year) {
      fieldValue.year.value = year;
      fieldValue.year.dispatchEvent(inputEvent);
    }

    return true;
  }

  private async fillDateAndTime(
    fieldValue: ExtractedValue,
    value: any
  ): Promise<boolean> {
    await sleep(SLEEP_DURATION);
    if (value instanceof Date) return false;

    const date = value;

    if (isNaN(date.valueOf())) return false;

    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    const inputEvent = new Event('input', { bubbles: true });

    if (fieldValue.date) {
      fieldValue.date.value = day;
      fieldValue.date.dispatchEvent(inputEvent);
    }

    if (fieldValue.month) {
      fieldValue.month.value = month;
      fieldValue.month.dispatchEvent(inputEvent);
    }

    if (fieldValue.year) {
      fieldValue.year.value = year;
      fieldValue.year.dispatchEvent(inputEvent);
    }

    if (fieldValue.hour) {
      fieldValue.hour.value = hours;
      fieldValue.hour.dispatchEvent(inputEvent);
    }

    if (fieldValue.minute) {
      fieldValue.minute.value = minutes;
      fieldValue.minute.dispatchEvent(inputEvent);
    }

    return true;
  }

  private async fillDateTimeWithMeridiemWithoutYear(
    fieldValue: ExtractedValue,
    value: any
  ): Promise<boolean> {
    await sleep(SLEEP_DURATION);

    if (value instanceof Date) return false;

    const date = value;

    if (isNaN(date.valueOf())) return false;

    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const hours24 = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');

    const meridiem = hours24 >= 12 ? 'PM' : 'AM';
    const hours = (hours24 % 12 || 12).toString().padStart(2, '0');

    const inputEvent = new Event('input', { bubbles: true });

    if (fieldValue.date) {
      fieldValue.date.value = day;
      fieldValue.date.dispatchEvent(inputEvent);
    }

    if (fieldValue.month) {
      fieldValue.month.value = month;
      fieldValue.month.dispatchEvent(inputEvent);
    }

    if (fieldValue.hour) {
      fieldValue.hour.value = hours;
      fieldValue.hour.dispatchEvent(inputEvent);
    }

    if (fieldValue.minute) {
      fieldValue.minute.value = minutes;
      fieldValue.minute.dispatchEvent(inputEvent);
    }

    if (fieldValue.meridiem) {
      const meridiemDropdown = fieldValue.meridiem;

      if (
        meridiemDropdown &&
        meridiemDropdown.getAttribute('aria-expanded') !== 'true'
      ) {
        meridiemDropdown.dispatchEvent(new Event('click', { bubbles: true }));
        await sleep(SLEEP_DURATION);
      }

      const optionElements = Array.from(
        meridiemDropdown.parentElement?.childNodes || []
      ).find(
        (child) =>
          !(child as HTMLElement).querySelector('div[role=presentation]')
      )?.childNodes;

      if (optionElements) {
        for (const option of Array.from(optionElements)) {
          const span = (option as HTMLElement).querySelector('span');
          const optionText = span?.textContent?.trim();
          if (optionText?.toLowerCase() === meridiem.toLowerCase()) {
            if (span) {
              span.dispatchEvent(new Event('click', { bubbles: true }));
            }
            return true;
          }
        }
      }
    }

    return false;
  }

  private async fillTimeWithMeridiem(
    fieldValue: ExtractedValue,
    value: any
  ): Promise<boolean> {
    await sleep(SLEEP_DURATION);

    if (value instanceof Date) return false;

    const date = value;

    if (isNaN(date.valueOf())) return false;

    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');

    const meridiem = hours >= 12 ? 'PM' : 'AM';
    if (hours > 12) {
      hours -= 12;
    } else if (hours === 0) {
      hours = 12;
    }
    const hours12 = hours.toString().padStart(2, '0');

    const inputEvent = new Event('input', { bubbles: true });

    if (fieldValue.hour) {
      fieldValue.hour.value = hours12;
      fieldValue.hour.dispatchEvent(inputEvent);
    }
    if (fieldValue.minute) {
      fieldValue.minute.value = minutes;
      fieldValue.minute.dispatchEvent(inputEvent);
    }

    if (fieldValue.meridiem) {
      const meridiemDropdown = fieldValue.meridiem;

      if (
        meridiemDropdown &&
        meridiemDropdown.getAttribute('aria-expanded') !== 'true'
      ) {
        meridiemDropdown.dispatchEvent(new Event('click', { bubbles: true }));
        await sleep(SLEEP_DURATION);
      }

      const optionElements = Array.from(
        meridiemDropdown.parentElement?.childNodes || []
      ).find(
        (child) =>
          !(child as HTMLElement).querySelector('div[role=presentation]')
      )?.childNodes;

      if (optionElements) {
        for (const option of Array.from(optionElements)) {
          const span = (option as HTMLElement).querySelector('span');
          const optionText = span?.textContent?.trim();
          if (optionText?.toLowerCase() === meridiem.toLowerCase()) {
            span?.dispatchEvent(new Event('click', { bubbles: true }));
            return true;
          }
        }
      }
    }

    return false;
  }

  private async fillDateAndTimeWithMeridiem(
    fieldValue: ExtractedValue,
    value: any
  ): Promise<boolean> {
    await sleep(SLEEP_DURATION);

    if (value instanceof Date) return false;

    const date = value;

    if (isNaN(date.valueOf())) return false;

    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString();

    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');

    const meridiem = hours >= 12 ? 'PM' : 'AM';
    if (hours > 12) {
      hours -= 12;
    } else if (hours === 0) {
      hours = 12;
    }
    const hours12 = hours.toString().padStart(2, '0');

    const inputEvent = new Event('input', { bubbles: true });

    if (fieldValue.date) {
      fieldValue.date.value = day;
      fieldValue.date.dispatchEvent(inputEvent);
    }
    if (fieldValue.month) {
      fieldValue.month.value = month;
      fieldValue.month.dispatchEvent(inputEvent);
    }
    if (fieldValue.year) {
      fieldValue.year.value = year;
      fieldValue.year.dispatchEvent(inputEvent);
    }

    if (fieldValue.hour) {
      fieldValue.hour.value = hours12;
      fieldValue.hour.dispatchEvent(inputEvent);
    }
    if (fieldValue.minute) {
      fieldValue.minute.value = minutes;
      fieldValue.minute.dispatchEvent(inputEvent);
    }

    if (fieldValue.meridiem) {
      const meridiemDropdown = fieldValue.meridiem;

      if (
        meridiemDropdown &&
        meridiemDropdown.getAttribute('aria-expanded') !== 'true'
      ) {
        meridiemDropdown.dispatchEvent(new Event('click', { bubbles: true }));
        await sleep(SLEEP_DURATION);
      }

      const optionElements = Array.from(
        meridiemDropdown.parentElement?.childNodes || []
      ).find(
        (child) =>
          !(child as HTMLElement).querySelector('div[role=presentation]')
      )?.childNodes;

      if (optionElements) {
        for (const option of Array.from(optionElements)) {
          const span = (option as HTMLElement).querySelector('span');
          const optionText = span?.textContent?.trim();
          if (optionText?.toLowerCase() === meridiem.toLowerCase()) {
            span?.dispatchEvent(new Event('click', { bubbles: true }));
            return true;
          }
        }
      }
    }

    return false;
  }

  private fillTime(fieldValue: ExtractedValue, value: any): boolean {
    if (value instanceof Date) return false;

    const date = value;

    if (isNaN(date.valueOf())) return false;

    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    const inputEvent = new Event('input', { bubbles: true });

    if (fieldValue.hour) {
      fieldValue.hour.value = hours;
      fieldValue.hour.dispatchEvent(inputEvent);
    }

    if (fieldValue.minute) {
      fieldValue.minute.value = minutes;
      fieldValue.minute.dispatchEvent(inputEvent);
    }

    return true;
  }

  private fillDuration(fieldValue: ExtractedValue, value: string): boolean {
    const [hours, minutes, seconds] = value.split('-');
    const inputEvent = new Event('input', { bubbles: true });

    if (fieldValue.hour) {
      fieldValue.hour.value = hours;
      fieldValue.hour.dispatchEvent(inputEvent);
    }
    if (fieldValue.minute) {
      fieldValue.minute.value = minutes;
      fieldValue.minute.dispatchEvent(inputEvent);
    }
    if (fieldValue.second) {
      fieldValue.second.value = seconds;
      fieldValue.second.dispatchEvent(inputEvent);
    }

    return true;
  }

  private fillDateWithoutYear(fieldValue: ExtractedValue, value: any): boolean {
    if (value instanceof Date) return false;

    const date = value;

    if (isNaN(date.valueOf())) return false;

    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');

    const inputEvent = new Event('input', { bubbles: true });

    if (fieldValue.date) {
      fieldValue.date.value = day;
      fieldValue.date.dispatchEvent(inputEvent);
    }

    if (fieldValue.month) {
      fieldValue.month.value = month;
      fieldValue.month.dispatchEvent(inputEvent);
    }

    return true;
  }

  private async fillDateTimeWithoutYear(
    fieldValue: ExtractedValue,
    value: any
  ): Promise<boolean> {
    await sleep(SLEEP_DURATION);

    if (value instanceof Date) return false;

    const date = value;

    if (isNaN(date.valueOf())) return false;

    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    const inputEvent = new Event('input', { bubbles: true });

    if (fieldValue.date) {
      fieldValue.date.value = day;
      fieldValue.date.dispatchEvent(inputEvent);
    }

    if (fieldValue.month) {
      fieldValue.month.value = month;
      fieldValue.month.dispatchEvent(inputEvent);
    }

    if (fieldValue.hour) {
      fieldValue.hour.value = hours;
      fieldValue.hour.dispatchEvent(inputEvent);
    }

    if (fieldValue.minute) {
      fieldValue.minute.value = minutes;
      fieldValue.minute.dispatchEvent(inputEvent);
    }

    return true;
  }

  private async fillMultiCorrectWithOther(
    fieldValue: ExtractedValue,
    value: MultiCorrectOrMultipleOption[]
  ): Promise<boolean> {
    await sleep(SLEEP_DURATION);

    for (const element of fieldValue.options || []) {
      for (const option of value) {
        // For checkbox
        if (option.optionText && !option.isOther) {
          if (element.data.toLowerCase() === option.optionText.toLowerCase()) {
            if (element.dom?.getAttribute('aria-checked') !== 'true') {
              element.dom?.dispatchEvent(new Event('click', { bubbles: true }));
            }
          }
        }
        // For Other option
        else if (option.isOther && option.otherOptionValue) {
          if (fieldValue.other?.dom?.getAttribute('aria-checked') !== 'true') {
            fieldValue.other?.dom?.dispatchEvent(
              new Event('click', { bubbles: true })
            );
          }

          fieldValue.other?.inputBoxDom.setAttribute(
            'value',
            option.otherOptionValue
          );
          fieldValue.other?.inputBoxDom.dispatchEvent(
            new Event('input', { bubbles: true })
          );
        }
      }
    }
    return true;
  }

  private async fillMultipleChoiceWithOther(
    fieldValue: ExtractedValue,
    value: MultiCorrectOrMultipleOption
  ): Promise<boolean> {
    await sleep(SLEEP_DURATION);

    for (const element of fieldValue.options || []) {
      // For checkbox
      if (value.optionText && !value.isOther) {
        if (element.data.toLowerCase() === value.optionText.toLowerCase()) {
          if (element.dom?.getAttribute('aria-checked') !== 'true') {
            element.dom?.dispatchEvent(new Event('click', { bubbles: true }));
          }
        }
      }
      // For Other option
      else if (value.isOther && value.otherOptionValue) {
        if (fieldValue.other?.dom?.getAttribute('aria-checked') !== 'true') {
          fieldValue.other?.dom?.dispatchEvent(
            new Event('click', { bubbles: true })
          );
        }

        fieldValue.other?.inputBoxDom.setAttribute(
          'value',
          value.otherOptionValue
        );
        fieldValue.other?.inputBoxDom.dispatchEvent(
          new Event('input', { bubbles: true })
        );
      }
    }
    return true;
  }

  private async fillLinearScale(
    fieldValue: ExtractedValue,
    value: string
  ): Promise<boolean> {
    await sleep(SLEEP_DURATION);

    fieldValue.options?.forEach((scale) => {
      if (scale.data === value) {
        if (scale.dom?.getAttribute('aria-checked') !== 'true') {
          (scale.dom as HTMLInputElement)?.dispatchEvent(
            new Event('click', { bubbles: true })
          );
          return true;
        }
      }
    });

    return false;
  }

  private async fillCheckboxGrid(
    fieldValue: ExtractedValue,
    options: RowColumnOption[]
  ): Promise<boolean> {
    await sleep(SLEEP_DURATION);

    fieldValue.rowColumnOption?.forEach((row) => {
      const matchingOptionRow = options.find(
        (option) => option.row === row.row
      );
      if (matchingOptionRow) {
        matchingOptionRow.cols.forEach((optionValue) => {
          const checkboxObj = row.cols.find(
            (col) => col.data === optionValue.data
          );
          if (checkboxObj) {
            // Check if already marked
            if (
              !checkboxObj.dom?.querySelector(
                'div[role=checkbox][aria-checked=true]'
              )
            ) {
              checkboxObj.dom?.dispatchEvent(
                new Event('click', { bubbles: true })
              );
            }
          }
        });
      }
    });
    return true;
  }

  private async fillMultipleChoiceGrid(
    fieldValue: ExtractedValue,
    options: RowColumn[]
  ): Promise<boolean> {
    await sleep(SLEEP_DURATION);

    fieldValue.rowColumnOption?.forEach((row) => {
      const matchingOptionRow = options.find(
        (option) => option.row === row.row
      );
      if (matchingOptionRow) {
        const matchingOptionRowCol = row.cols.find(
          (box) => box.data === matchingOptionRow.selectedColumn
        );
        if (matchingOptionRowCol) {
          if (
            matchingOptionRowCol.dom?.getAttribute('aria-checked') !== 'true'
          ) {
            matchingOptionRowCol.dom?.dispatchEvent(
              new Event('click', { bubbles: true })
            );
          }
        }
      }
    });

    return true;
  }

  private async fillDropDown(
    fieldValue: ExtractedValue,
    value: string
  ): Promise<boolean> {
    await sleep(SLEEP_DURATION);
    for (const option of fieldValue.options || []) {
      if (option.data === value) {
        const dropdown = option.dom;
        if (fieldValue.dom) {
          if (fieldValue.dom?.getAttribute('aria-expanded') !== 'true') {
            fieldValue.dom
              ?.querySelector('div[role=presentation]')
              ?.dispatchEvent(new Event('click', { bubbles: true }));
            await sleep(SLEEP_DURATION);
          }
          const allOptions =
            fieldValue.dom.querySelectorAll(`div[role=option]`);
          allOptions.forEach((possibleOption) => {
            if (possibleOption.querySelector('span')?.textContent === value) {
              possibleOption.dispatchEvent(
                new Event('click', { bubbles: true })
              );
              return;
            }
          });

          return true;
        }
      }
    }
    return false;
  }
}
