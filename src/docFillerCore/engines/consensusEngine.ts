import { LLMEngine } from '@docFillerCore/engines/gptEngine';
import { ValidatorEngine } from '@docFillerCore/engines/validatorEngine';
import { analyzeWeightedObjects } from '@utils/consensusUtil';
import LLMEngineType from '@utils/llmEngineTypes';
import { QType } from '@utils/questionTypes';

class ConsensusEngine {
  private validateEngine: ValidatorEngine;
  private llmWeights: Map<LLMEngineType, number> = new Map();

  constructor() {
    this.validateEngine = new ValidatorEngine();

    this.llmWeights.set(LLMEngineType.ChatGPT, 0.42);
    this.llmWeights.set(LLMEngineType.Gemini, 0.42);
    this.llmWeights.set(LLMEngineType.Ollama, 0.16);
    this.distributeWeights();
  }

  private distributeWeights() {
    const totalWeights = Array.from(this.llmWeights.values()).reduce(
      (sum, weight) => sum + weight,
      0
    );
    const numLLMs = this.llmWeights.size;
    const equalWeight = totalWeights / numLLMs;

    if (totalWeights !== 1) {
      const remainingWeight = 1 - totalWeights;
      const additionalWeight = remainingWeight / numLLMs;

      for (const [llmType, weight] of this.llmWeights.entries()) {
        if (weight <= 0) {
          this.llmWeights.set(llmType, equalWeight + additionalWeight);
        }
      }
    }
  }

  async generateAndValidate(
    promptString: string,
    extractedValue: ExtractedValue,
    fieldType: QType
  ): Promise<object | null> {
    const responses = [];
    for (const [llmType, weight] of this.llmWeights.entries()) {
      const llm = LLMEngine.getInstance(llmType);
      const response = await llm.getResponse(promptString, fieldType);
      const parsedResponse = this.validateEngine.validate(
        fieldType,
        extractedValue,
        response
      );
      if (parsedResponse === true) {
        responses.push({
          source: llmType,
          weight: weight,
          value: response ?? {},
        });
      }
    }

    return analyzeWeightedObjects(responses);
  }
}

export { ConsensusEngine };
