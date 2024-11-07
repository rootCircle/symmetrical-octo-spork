import LLMEngineType, { getModelTypeFromName } from '@utils/llmEngineTypes';
import {
  getEnableConsensus,
  getLLMModel,
  getLLMWeights,
  getSleepDuration,
} from '@utils/getProperties';

const EMPTY_STRING: string = '';

class Settings {
  private static instance: Settings;
  private sleepDuration!: number;
  private currentLLMModel!: LLMEngineType;
  private enableConsensus!: boolean;
  private consensusWeights!: Map<LLMEngineType, number>;

  private constructor() {}

  public static getInstance(): Settings {
    if (!Settings.instance) {
      Settings.instance = new Settings();
    }

    return Settings.instance;
  }

  public async getSleepDuration(): Promise<number> {
    if (!this.sleepDuration) {
      this.sleepDuration = (await getSleepDuration()) || 2000;
    }
    return this.sleepDuration;
  }

  public async getCurrentLLMModel(): Promise<LLMEngineType> {
    if (!this.currentLLMModel) {
      this.currentLLMModel =
        getModelTypeFromName((await getLLMModel()) ?? EMPTY_STRING) ||
        LLMEngineType.Gemini;
    }
    return this.currentLLMModel;
  }

  public getDefaultLLMModel(): LLMEngineType {
    if (this.currentLLMModel) {
      return this.currentLLMModel;
    }
    return LLMEngineType.Gemini;
  }

  public async getEnableConsensus(): Promise<boolean> {
    if (!this.enableConsensus) {
      this.enableConsensus = (await getEnableConsensus()) || false;
    }
    return this.enableConsensus;
  }

  public async getConsensusWeights(): Promise<Map<LLMEngineType, number>> {
    if (!this.consensusWeights) {
      this.consensusWeights = new Map();
      if (await this.getEnableConsensus()) {
        const weights = await getLLMWeights();
        if (weights) {
          Object.entries(weights).forEach(([key, value]) => {
            const modelType = getModelTypeFromName(key);
            if (modelType && Number(value)) {
              this.consensusWeights.set(modelType, Number(value));
            }
          });
        } else {
          this.consensusWeights.set(LLMEngineType.Anthropic, 0.6);
          this.consensusWeights.set(LLMEngineType.ChatGPT, 0.4);
          this.consensusWeights.set(LLMEngineType.Gemini, 0.3);
          this.consensusWeights.set(LLMEngineType.Ollama, 0.15);
          this.consensusWeights.set(LLMEngineType.Mistral, 0.25);
        }
      }
    }
    return this.consensusWeights;
  }
}

export { EMPTY_STRING, Settings };
