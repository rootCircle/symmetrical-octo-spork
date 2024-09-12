/* eslint-disable no-unused-vars */
enum LLMEngineType {
  ChatGPT = 'gpt4-o',
  Gemini = 'gemini-pro',
  Ollama = 'code-gemma2:2b',
}

function getModelName(modelType: LLMEngineType): string {
  switch (modelType) {
    case LLMEngineType.ChatGPT:
      return 'ChatGPT';
    case LLMEngineType.Gemini:
      return 'Gemini';
    case LLMEngineType.Ollama:
      return 'Ollama';
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
  }

  return null;
}

export default LLMEngineType;
export { getModelName, getModelTypeFromName };
