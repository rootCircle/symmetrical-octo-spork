import LLMEngineType from './llmEngineTypes';

interface typeDefaultProperties {
  model: LLMEngineType;
  sleep_duration: number;
  enableConsensus: boolean;
  llmWeights: Record<LLMEngineType, number>;
}
const LLMWeightsMap = {
  [LLMEngineType.Gemini]: 0.69,
  [LLMEngineType.ChatGPT]: 0.3,
  [LLMEngineType.Anthropic]: 1,
  [LLMEngineType.Mistral]: 1,
  [LLMEngineType.Ollama]: 0.4,
};

const DEFAULT_PROPERTIES: typeDefaultProperties = {
  sleep_duration: 1500,
  model: LLMEngineType.Gemini,
  enableConsensus: false,
  llmWeights: LLMWeightsMap,
};

export { DEFAULT_PROPERTIES };
