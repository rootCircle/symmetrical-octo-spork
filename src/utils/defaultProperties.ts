import LLMEngineType from './llmEngineTypes';

interface typeDefaultProperties {
  model: LLMEngineType;
  sleep_duration: number;
  enableConsensus: boolean;
  llmWeights: Record<LLMEngineType, number>;
  automaticFillingEnabled: boolean;
  defaultProfile: Profile;
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
  automaticFillingEnabled: true,
  defaultProfile: {
    name: 'Luna',
    image_url: 'https://w.wallhaven.cc/full/5g/wallhaven-5gxvv3.png',
    system_prompt:
      'You are an helpful chatbot with great general knowledge. You are here to help users with their queries.',
    description:
      'Luna is a chatbot that is here to help you with your queries.',
    short_description:
      'Luna is a chatbot that is here to help you with your queries.',
  },
};

export { DEFAULT_PROPERTIES };
