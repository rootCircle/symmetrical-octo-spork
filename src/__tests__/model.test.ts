import { test, expect } from '@jest/globals';
import { getModelName, LLMEngineType } from '@utils/llmEngineTypes';

test('is model anthropic', () => {
  expect(getModelName(LLMEngineType.Anthropic)).toBe('Anthropic');
});
