// https://github.com/oven-sh/bun/issues/358#issuecomment-1715648224

/// <reference lib="dom" />

interface ExtractedValue {
  title?: string;
  description?: string | null;
  dom?: HTMLElement;
  options?: OptionType[];
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

interface OptionType {
  dom?: HTMLElement;
  data: string;
}

interface OtherOption extends OptionType {
  inputBoxDom: HTMLInputElement;
}

interface ParamsMultiChoiceOrCorrectResult {
  options: OptionType[];
  other?: OtherOption;
}

interface LowerUpperBound {
  lowerBound: string;
  upperBound: string;
}

interface ParamsLinearScaleResult {
  bounds: LowerUpperBound;
  options: OptionType[];
}

interface ParamsMultipleChoiceGridResult {
  rowColumnOption: RowColumnOption[];
  rowArray: string[];
  columnArray: string[];
}

interface RowColumnOption {
  row: string;
  cols: OptionType[];
}

interface CheckboxGridResult {
  rowColumnOption: RowColumnOption[];
  rowArray: string[];
  columnArray: string[];
}

interface DropdownResult {
  dom?: HTMLElement;
  options: OptionType[];
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

interface GenericLLMResponse {
  answer: string;
}

interface LinearScaleResponse {
  answer: number;
}

interface LLMResponse {
  text?: string;
  genericResponse?: GenericLLMResponse;
  date?: Date;
  multiCorrect?: MultiCorrectOrMultipleOption[];
  multipleChoice?: MultiCorrectOrMultipleOption;
  linearScale?: LinearScaleResponse;
  multipleChoiceGrid?: RowColumn[];
  checkboxGrid?: RowColumnOption[];
}

interface Profile {
  system_prompt: string;
  image_url: string;
  name: string;
  short_description: string;
  is_custom: boolean;
}

interface Profiles {
  [key: string]: Profile;
}

// types.d.ts
// Remove duplicate MetricsData interface and merge them:

interface MetricsData {
  history: MetricsHistory[];
  formMetrics: {
    totalFormsFilled: number;
    successfulFills: number;
    // successfulQuestionFilled: number; // Added this from second interface
    failedFills: number;
    // questionsByType: Record<QType, number>;
    lastFilledDate: string;
    currentStreak: number;
    activeStreak: number;
  };
  timeMetrics: {
    // totalTimeSaved: number;
    averageTimePerForm: number;
    totalHoursSaved: number;
    totalMinSaved: number;
    totalSecSaved: number;
  };
  aiMetrics: {
    apiCalls: Record<LLMEngineType, number>;
    tokenUsage: Record<LLMEngineType, number>;
    averageResponseTime: Record<LLMEngineType, number>;
  };
}

interface MetricsUpdateParams {
  llmModel: LLMEngineType;
  timeAI: number;
  totalQuestions: number;
  successfulQuestions: number;
  toBeFilledQuestions: number;
  responseTime: number;
}

interface MetricsHistory {
  date: string;
  formsFilled: number;
  timeAI: number; // Time taken by AI in seconds
  // questionsToBeFilled: number; // Number of questions in form
  // success: boolean;
  // successfulFills: number;
  totalQuestions: number;
  successfulQuestions: number;
  toBeFilledQuestions: number;
}
