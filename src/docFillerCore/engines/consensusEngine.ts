/* eslint-disable no-console */
import { LLMEngine } from '@docFillerCore/engines/gptEngine';
import { ValidatorEngine } from '@docFillerCore/engines/validatorEngine';
import { analyzeWeightedObjects } from '@utils/consensusUtil';
import { Settings } from '@utils/settings';
import LLMEngineType from '@utils/llmEngineTypes';
import { QType } from '@utils/questionTypes';
import { DEFAULT_PROPERTIES } from '@utils/defaultProperties';

class ConsensusEngine {
  private static instance: ConsensusEngine;
  private validateEngine: ValidatorEngine;
  private static llmWeights: Map<LLMEngineType, number> = new Map<
    LLMEngineType,
    number
  >(Object.entries(DEFAULT_PROPERTIES.llmWeights) as [LLMEngineType, number][]);

  private constructor() {
    this.validateEngine = new ValidatorEngine();
  }

  public static async getInstance(): Promise<ConsensusEngine> {
    if (!ConsensusEngine.instance) {
      ConsensusEngine.instance = new ConsensusEngine();
      ConsensusEngine.llmWeights = new Map<LLMEngineType, number>(
        Object.entries(await Settings.getInstance().getConsensusWeights()) as [
          LLMEngineType,
          number,
        ][],
      );
      ConsensusEngine.distributeWeights();
    }

    return ConsensusEngine.instance;
  }

  private static distributeWeights() {
    const currentSum = Array.from(ConsensusEngine.llmWeights.values()).reduce(
      (sum, weight) => sum + weight,
      0,
    );

    if (currentSum === 1) {
      return;
    }

    const nonZeroCount = Array.from(ConsensusEngine.llmWeights.values()).filter(
      (w) => w > 0,
    ).length;
    const adjustment =
      (1 - currentSum) / (nonZeroCount ?? ConsensusEngine.llmWeights.size);
    ConsensusEngine.llmWeights.forEach((value, key) => {
      if (value > 0) {
        ConsensusEngine.llmWeights.set(key, value + adjustment);
      }
    });
  }

  async generateAndValidate(
    promptString: string,
    extractedValue: ExtractedValue,
    fieldType: QType,
  ): Promise<LLMResponse | null> {
    const responses = [];
    const entries = Array.from(ConsensusEngine.llmWeights.entries());
    for (let i = 0; i < entries.length; i++) {
      const [llmType, weight] = entries[i] as [LLMEngineType, number];
      try {
        if (weight === 0) {
          continue;
        }
        const llm = new LLMEngine(llmType);
        const response = await llm.getResponse(
          promptString,
          fieldType,
          llmType,
        );
        if (response !== null) {
          const parsedResponse = this.validateEngine.validate(
            fieldType,
            extractedValue,
            response,
          );
          if (parsedResponse === true) {
            responses.push({
              source: llmType,
              weight,
              value: response ?? {},
            });
          }
        }
      } catch (error) {
        console.error(error);
        continue;
      }
    }

    return analyzeWeightedObjects(responses);
  }
}

export { ConsensusEngine };
