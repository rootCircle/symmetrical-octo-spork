/* eslint-disable no-unused-vars */
enum LLMEngineType {
  ChatGPT = 'gpt4-o',
  Gemini = 'gemini-pro',
  Ollama = 'code-gemma2:2b',
  Anthropic = 'claude',
  Mistral = 'mistral',
}

function getModelName(modelType: LLMEngineType): string {
  switch (modelType) {
    case LLMEngineType.ChatGPT:
      return 'ChatGPT';
    case LLMEngineType.Gemini:
      return 'Gemini';
    case LLMEngineType.Ollama:
      return 'Ollama';
    case LLMEngineType.Anthropic:
      return 'Anthropic';
    case LLMEngineType.Mistral:
      return 'Mistral';
  }
}

function getModelTypeFromName(modelName: string): LLMEngineType | null {
  switch (modelName) {
    case 'ChatGPT':
      return LLMEngineType.ChatGPT;
    case 'Gemini':
      return LLMEngineType.Gemini;
    case 'Ollama':
      return LLMEngineType.Ollama;
    case 'Mistral':
      return LLMEngineType.Mistral;
    case 'Anthropic':
      return LLMEngineType.Anthropic;
  }

  return null;
}

export default LLMEngineType;
export { getModelName, getModelTypeFromName };
