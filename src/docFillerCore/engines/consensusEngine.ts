import { LLMEngine } from '@docFillerCore/engines/gptEngine';
import { ValidatorEngine } from '@docFillerCore/engines/validatorEngine';
import { analyzeWeightedObjects } from '@utils/consensusUtil';
import LLMEngineType from '@utils/llmEngineTypes';
import { QType } from '@utils/questionTypes';

class ConsensusEngine {
  private static instance: ConsensusEngine;
  private validateEngine: ValidatorEngine;
  private llmWeights: Map<LLMEngineType, number> = new Map();

  private constructor() {
    this.validateEngine = new ValidatorEngine();

    // this.llmWeights.set(LLMEngineType.ChatGPT, 0.42);
    this.llmWeights.set(LLMEngineType.Gemini, 0.42);
    this.llmWeights.set(LLMEngineType.Ollama, 0.16);
    this.distributeWeights();
  }

  public static getInstance(): ConsensusEngine {
    if (!ConsensusEngine.instance) {
      ConsensusEngine.instance = new ConsensusEngine();
    }

    return ConsensusEngine.instance;
  }

  private distributeWeights() {
    const currentSum = Array.from(this.llmWeights.values()).reduce(
      (sum, weight) => sum + weight,
      0,
    );

    if (currentSum === 1) {
      return;
    }

    const adjustment = (1 - currentSum) / this.llmWeights.size;

    this.llmWeights.forEach((value, key) => {
      this.llmWeights.set(key, value + adjustment);
    });
  }

  async generateAndValidate(
    promptString: string,
    extractedValue: ExtractedValue,
    fieldType: QType,
  ): Promise<LLMResponse | null> {
    const responses = [];
    for (const [llmType, weight] of this.llmWeights.entries()) {
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
      }
    }

    return analyzeWeightedObjects(responses);
  }
}

export { ConsensusEngine };
