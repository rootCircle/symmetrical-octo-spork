import LLMEngineType from './llmEngineTypes';

interface typeDefaultProperties {
  model: LLMEngineType;
  sleep_duration: number;
  enableConsensus: boolean;
  llmWeights: Record<LLMEngineType, number>;
  isEnabled: boolean;
  profileAvatarImage: string;
  profileName: string;
}
const LLMWeightsMap = {
  [LLMEngineType.Gemini]: 0.18,
  [LLMEngineType.ChatGPT]: 0.26,
  [LLMEngineType.Anthropic]: 0.35,
  [LLMEngineType.Mistral]: 0.13,
  [LLMEngineType.Ollama]: 0.08,
  [LLMEngineType.ChromeAI]: 0.08,
};

const DEFAULT_PROPERTIES: typeDefaultProperties = {
  sleep_duration: 1500,
  model: LLMEngineType.Gemini,
  enableConsensus: false,
  llmWeights: LLMWeightsMap,
  isEnabled: true,
  profileAvatarImage: 'https://w.wallhaven.cc/full/5g/wallhaven-5gxvv3.png',
  profileName: 'Luna',
};

export { DEFAULT_PROPERTIES };
