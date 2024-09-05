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
        return this.fillText(fieldValue, 'this is text');

      case QType.TEXT_EMAIL:
        return this.fillEmail(fieldValue, 'harshit123@gmail.com');

      case QType.PARAGRAPH:
        return this.fillParagraph(fieldValue, 'this is a paragraph \newww');

      case QType.LINEAR_SCALE:
        return this.fillLinearScale(fieldValue, '1');

      // case QType.DROPDOWN:
      //   return await this.fillDropDown(fieldValue, 'Option 2');

      // case QType.CHECKBOX_GRID:
      //   return await this.fillCheckboxGrid(fieldValue, [
      //     {
      //       row: 'Row 1',
      //       cols: [{ data: 'Column 1' }, { data: 'Column 2' }],
      //     },
      //     { row: 'Row 2', cols: [{ data: 'Column 2' }] },
      //   ]);

      // case QType.MULTIPLE_CHOICE_GRID:
      //   return await this.fillMultipleChoiceGrid(fieldValue, [
      //     { row: 'Row 1', cols: [{ data: 'Column 1' }] },
      //     { row: 'Row 2', cols: [{ data: 'Column 2' }] },
      //     { row: 'Brooooo', cols: [{ data: 'Column 2' }] },
      //   ]);

      case QType.DATE:
        return this.fillDate(fieldValue, '11-11-2111');

      case QType.DATE_AND_TIME:
        return this.fillDateAndTime(fieldValue, '01-01-2003-01-01');

      case QType.TIME:
        return this.fillTime(fieldValue, '02-02');

      case QType.DURATION:
        return this.fillDuration(fieldValue, '11-11-11');

      case QType.DATE_WITHOUT_YEAR:
        return this.fillDateWithoutYear(fieldValue, '11-11');

      case QType.DATE_TIME_WITHOUT_YEAR:
        return this.fillDateTimeWithoutYear(fieldValue, '22-01-01-01');

      // case QType.MULTI_CORRECT_WITH_OTHER:
      // case QType.MULTI_CORRECT:
      //   return this.fillCheckBox(fieldValue, [
      //     'Sightseeing',
      //     'Day 2',
      //     { optionTitle: 'Other:', optionText: 'My name is Monark Jain' },
      //   ]);

      default:
        return false;
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

  private fillParagraph(fieldValue: ExtractedValue, value: string): boolean {
    return this.fillText(fieldValue, value);
  }

  private fillDate(fieldValue: ExtractedValue, value: string): boolean {
    const datePattern = /^(\d{2})-(\d{2})-(\d{4})$/;

    if (!datePattern.test(value)) return false;

    const [day, month, year] = value.split('-');
    const date = new Date(`${year}-${month}-${day}`);

    // Invalid date format as raised by date constructor
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/Date#return_value
    if (isNaN(date.valueOf())) return false;

    if (
      !(
        date.getDate() === Number(day) &&
        // Month numbering start from 0...11
        date.getMonth() + 1 === Number(month) &&
        date.getFullYear() === Number(year)
      )
    ) {
      return false;
    }

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
    value: string
  ): Promise<boolean> {
    await sleep(SLEEP_DURATION);

    const datePattern = /^(\d{2})-(\d{2})-(\d{4})-(\d{2})-(\d{2})$/;
    if (!datePattern.test(value)) return false;

    const [day, month, year, hours, minutes] = value.split('-');
    const date = new Date(`${year}-${month}-${day}`);

    // Invalid date format as raised by date constructor
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/Date#return_value
    if (isNaN(date.valueOf())) return false;

    if (
      !(
        date.getDate() === Number(day) &&
        // Month numbering start from 0...11
        date.getMonth() + 1 === Number(month) &&
        date.getFullYear() === Number(year)
      )
    ) {
      return false;
    }

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

  private fillTime(fieldValue: ExtractedValue, value: string): boolean {
    const [hours, minutes] = value.split('-');
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

  private fillDateWithoutYear(
    fieldValue: ExtractedValue,
    value: string
  ): boolean {
    const [day, month] = value.split('-');
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
    value: string
  ): Promise<boolean> {
    await sleep(SLEEP_DURATION);

    const [day, month, hours, minutes] = value.split('-');
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

  // private async fillCheckBox(
  //   fieldValue: ExtractedValue,
  //   value: Array<string | { optionTitle: string; optionText: string }>
  // ): Promise<boolean> {
  //   await sleep(SLEEP_DURATION);

  //   if (!Array.isArray(value)) return false;

  //   for (const val of value) {
  //     if (typeof val === 'string') {
  //       const option = fieldValue.options?.find((opt) => opt.data === val);
  //       if (option) {
  //         (option.dom as HTMLInputElement).click();
  //       }
  //     } else if (val.optionTitle === 'Other:') {
  //       const otherOption = fieldValue.other?.find(
  //         (opt) => opt.data === val.optionText
  //       );
  //       if (otherOption) {
  //         otherOption.dom?.click();
  //         otherOption.inputBoxDom.value = val.optionText;
  //         (otherOption.inputBoxDom as HTMLInputElement).dispatchEvent(
  //           new Event('input', { bubbles: true })
  //         );
  //       }
  //     }
  //   }

  //   return true;
  // }

  // private async fillDropDown(
  //   fieldValue: ExtractedValue,
  //   value: string
  // ): Promise<boolean> {
  //   await sleep(SLEEP_DURATION);

  //   for (const option of fieldValue.options || []) {
  //     if (option.data === value) {
  //       const dropdown = option.dom;
  //       await sleep(500);
  //       fieldValue.dom?.querySelector('div[role=presentation]')?.dispatchEvent(new Event('click', {bubbles: true}));
  //       // await sleep(SLEEP_DURATION);
  //       const optionToBeSelected = fieldValue.dom?.querySelector(`div[data-value="${value}"][role=option]`) as HTMLElement;
        
  //       console.log("Meow" + optionToBeSelected)
  //       optionToBeSelected.dispatchEvent(new Event('click', {bubbles: true}));
  //       return true;
  //     }
  //   }

  //   const dropdown = fieldValue.dom as HTMLSelectElement;
  //   if (dropdown) {
  //     dropdown.value = value;
  //     dropdown.dispatchEvent(new Event('change', { bubbles: true }));
  //     return true;
  //   }
  //   return false;
  // }

  private async fillLinearScale(
    fieldValue: ExtractedValue,
    value: string
  ): Promise<boolean> {
    await sleep(SLEEP_DURATION);

    fieldValue.options?.forEach((scale) => {
      if (scale.data === value) {
        (scale.dom as HTMLInputElement)?.dispatchEvent(
          new Event('click', { bubbles: true })
        );
        return true;
      }
    });

    return false;
  }

  // private fillCheckboxGrid(
  //   fieldValue: ExtractedValue,
  //   options: RowColumnOption[]
  // ): boolean {
  //   fieldValue.rowColumnOption?.forEach((col) => {
  //     const row = options.find((option) => option.row === col.row);
  //     if (row) {
  //       row.cols.forEach((optionValue) => {
  //         const checkbox = fieldValue.dom?.querySelector(
  //           `input[value="${optionValue.data}"]`
  //         ) as HTMLInputElement;
  //         if (checkbox) {
  //           checkbox.click();
  //         }
  //       });
  //     }
  //   });
  //   return true;
  // }

  // private async fillMultipleChoiceGrid(
  //   fieldValue: ExtractedValue,
  //   options: RowColumnOption[]
  // ): Promise<boolean> {
  //   await sleep(SLEEP_DURATION);

  //   options.forEach((option) => {
  //     const checkbox = fieldValue.dom?.querySelector(
  //       `input[value="${option.row}"]`
  //     ) as HTMLInputElement;
  //     if (checkbox) {
  //       checkbox.click();
  //     }
  //   });
  //   return true;
  // }
}
