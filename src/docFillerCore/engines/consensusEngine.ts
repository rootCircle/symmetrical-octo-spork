/* eslint-disable no-console */
import { LLMEngine } from '@docFillerCore/engines/gptEngine';
import { ValidatorEngine } from '@docFillerCore/engines/validatorEngine';
import { analyzeWeightedObjects } from '@utils/consensusUtil';
import { Settings } from '@utils/settings';
import LLMEngineType from '@utils/llmEngineTypes';
import { QType } from '@utils/questionTypes';

class ConsensusEngine {
  private static instance: ConsensusEngine;
  private validateEngine: ValidatorEngine;
  private static llmWeights: Map<LLMEngineType, number> = new Map();

  private constructor() {
    this.validateEngine = new ValidatorEngine();
  }

  public static async getInstance(): Promise<ConsensusEngine> {
    if (!ConsensusEngine.instance) {
      ConsensusEngine.instance = new ConsensusEngine();
      ConsensusEngine.llmWeights = new Map(
        await Settings.getInstance().getConsensusWeights(),
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

    const adjustment = (1 - currentSum) / ConsensusEngine.llmWeights.size;

    ConsensusEngine.llmWeights.forEach((value, key) => {
      ConsensusEngine.llmWeights.set(key, value + adjustment);
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
        const llm = LLMEngine.getInstance(llmType);
        const response = await llm.getResponse(promptString, fieldType);
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
        } else {
          console.log(response);
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
