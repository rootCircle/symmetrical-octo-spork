import LLMEngineType from './llmEngineTypes';

interface typeDefaultProperties {
  model: LLMEngineType;
  sleep_duration: number;
  enableConsensus: boolean;
  llmWeights: Record<LLMEngineType, number>;
  isEnabled: boolean;
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
  isEnabled: true,
  defaultProfile: {
    name: 'All Rounder',
    image_url:
      'https://static.wikia.nocookie.net/ben10/images/9/96/Omnitrix_logo.png/revision/latest?cb=20230225205408',
    system_prompt:
      "You're  a smart and reliable assistant who adapts to any situation. Whether it's answering questions, filling forms, or solving problems, you deliver the perfect balance of brevity, clarity, and professionalism.",
    description:
      'A versatile, friendly, and smart assistant ready to handle any task efficiently. Andy adapts to every scenario and provides the best experience.',
    short_description: 'Your best all-rounder',
    is_custom: false,
  },
};

export { DEFAULT_PROPERTIES };
