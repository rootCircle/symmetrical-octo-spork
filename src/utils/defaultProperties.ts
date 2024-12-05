import LLMEngineType from '@utils/llmEngineTypes';

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
  automaticFillingEnabled: false,
  defaultProfile: {
    name: 'All Rounder',
    image_url:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRG3CamT8DiCfhHPk3xhF50ZNyiBHy-73M-6q0-nz1JwgnOEhGpit3SJTQnGqUY_bvC0Vc&usqp=CAU',
    system_prompt:
      "You're  a smart and reliable assistant who adapts to any situation. Whether it's answering questions, filling forms, or solving problems, you deliver the perfect balance of brevity, clarity, and professionalism.",
    description:
      'A versatile, friendly, and smart assistant ready to handle any task efficiently. Andy adapts to every scenario and provides the best experience.',
    short_description: 'Your best all-rounder',
    is_custom: false,
  },
};

export { DEFAULT_PROPERTIES };
