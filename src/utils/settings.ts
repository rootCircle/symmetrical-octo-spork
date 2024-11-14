import LLMEngineType, { getModelTypeFromName } from '@utils/llmEngineTypes';
import {
  getEnableConsensus,
  getLLMModel,
  getLLMWeights,
  getSleepDuration,
} from '@utils/getProperties';

import { DEFAULT_PROPERTIES } from './defaultProperties';

const EMPTY_STRING: string = '';

class Settings {
  private static instance: Settings;
  private sleepDuration!: number;
  private currentLLMModel!: LLMEngineType;
  private enableConsensus!: boolean;
  private consensusWeights!: Record<LLMEngineType, number>;

  private constructor() {}

  public static getInstance(): Settings {
    if (!Settings.instance) {
      Settings.instance = new Settings();
    }

    return Settings.instance;
  }

  public async getSleepDuration(): Promise<number> {
    if (!this.sleepDuration) {
      this.sleepDuration =
        (await getSleepDuration()) || DEFAULT_PROPERTIES.sleep_duration;
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
    return DEFAULT_PROPERTIES.model;
  }

  public async getEnableConsensus(): Promise<boolean> {
    if (!this.enableConsensus) {
      this.enableConsensus =
        (await getEnableConsensus()) || DEFAULT_PROPERTIES.enableConsensus;
    }
    return this.enableConsensus;
  }

  public async getConsensusWeights(): Promise<Record<LLMEngineType, number>> {
    if (!this.consensusWeights) {
      if (await this.getEnableConsensus()) {
        const weights = await getLLMWeights();
        if (weights) {
          this.consensusWeights = weights;
        } else {
          this.consensusWeights = DEFAULT_PROPERTIES.llmWeights;
        }
      }
    }
    return this.consensusWeights;
  }
}

export { EMPTY_STRING, Settings };
