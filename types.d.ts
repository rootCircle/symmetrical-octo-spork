// https://github.com/oven-sh/bun/issues/358#issuecomment-1715648224

/// <reference lib="dom" />

interface Option {
  data: string;
}

interface ExtractedValue {
  title?: string;
  description?: string | null;
  dom?: HTMLElement;
  options?: Option[];
  other?: OtherOption;
  rowColumnOption?: RowColumnOption[];
  rowArray?: string[];
  columnArray?: string[];
  bounds?: LowerUpperBound;
  date?: HTMLInputElement | null;
  month?: HTMLInputElement | null;
  year?: HTMLInputElement | null;
  hour?: HTMLInputElement | null;
  minute?: HTMLInputElement | null;
  second?: HTMLInputElement | null;
  meridiem?: HTMLElement;
}

interface DOMPointer {
  dom: HTMLElement;
}

interface Option {
  dom?: HTMLElement;
  data: string;
}

interface OtherOption extends Option {
  inputBoxDom: HTMLInputElement;
}

interface ParamsMultiChoiceOrCorrectResult {
  options: Option[];
  other?: OtherOption;
}

interface LowerUpperBound {
  lowerBound: string;
  upperBound: string;
}

interface ParamsLinearScaleResult {
  bounds: LowerUpperBound;
  options: Option[];
}

interface ParamsMultipleChoiceGridResult {
  rowColumnOption: RowColumnOption[];
  rowArray: string[];
  columnArray: string[];
}

interface RowColumnOption {
  row: string;
  cols: Option[];
}

interface CheckboxGridResult {
  rowColumnOption: RowColumnOption[];
  rowArray: string[];
  columnArray: string[];
}

interface DropdownResult {
  dom?: HTMLElement;
  options: Option[];
}

interface DateTimeDomFields {
  date?: HTMLInputElement | null;
  month?: HTMLInputElement | null;
  year?: HTMLInputElement | null;
  hour?: HTMLInputElement | null;
  minute?: HTMLInputElement | null;
  second?: HTMLInputElement | null;
  meridiem?: HTMLElement;
}

interface MultiCorrectOrMultipleOption {
  isOther?: boolean;
  optionText?: string;
  otherOptionValue?: string;
}

interface RowColumn {
  row: string;
  selectedColumn: string;
}
