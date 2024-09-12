import LLMEngineType from '@utils/llmEngineTypes';

const SLEEP_DURATION: number = 2000;
const EMPTY_STRING: string = '';
const DEFAULT_LLM_MODEL = LLMEngineType.ChatGPT;
const CURRENT_LLM_MODEL = LLMEngineType.Gemini;
const ENABLE_CONSENSUS = true;
export {
  EMPTY_STRING,
  SLEEP_DURATION,
  DEFAULT_LLM_MODEL,
  CURRENT_LLM_MODEL,
  ENABLE_CONSENSUS,
};
