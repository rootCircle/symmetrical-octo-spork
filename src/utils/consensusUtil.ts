/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */

import LLMEngineType from '@utils/llmEngineTypes';

interface WeightedObject {
  source: LLMEngineType;
  weight: number;
  value: LLMResponse;
}

type LLMResponseValue = LLMResponse[keyof LLMResponse];
type FlattenedLLMResponse = { [key: string]: LLMResponseValue };

function createWeightedObjectAnalyzer() {
  return function analyzeWeightedObjects(
    objects: WeightedObject[],
  ): LLMResponse {
    if (objects.length === 0) {
      return {};
    }

    return analyzeObjects(objects);
  };
}

function analyzeObjects(objects: WeightedObject[]): LLMResponse {
  const flattenedObjects: {
    [key: string]: { value: LLMResponseValue; totalWeight: number };
  } = {};

  // Flatten and aggregate weights
  for (const obj of objects) {
    const flattened = flattenObject(obj.value);
    for (const [key, value] of Object.entries(flattened)) {
      if (
        !flattenedObjects[key] ||
        obj.weight > flattenedObjects[key].totalWeight
      ) {
        flattenedObjects[key] = { value, totalWeight: obj.weight };
      }
    }
  }

  // Reconstruct the nested object
  return unflattenObject(
    Object.fromEntries(
      Object.entries(flattenedObjects).map(([key, { value }]) => [key, value]),
    ),
  );
}

function flattenObject(obj: LLMResponse, prefix = ''): FlattenedLLMResponse {
  return Object.entries(obj).reduce(
    (acc: FlattenedLLMResponse, [key, value]) => {
      const propKey = prefix ? `${prefix}.${key}` : key;
      if (
        Array.isArray(value) ||
        value instanceof Date ||
        typeof value !== 'object' ||
        value === null
      ) {
        acc[propKey] = value as LLMResponseValue;
      } else {
        Object.assign(acc, flattenObject(value as LLMResponse, propKey));
      }
      return acc;
    },
    {},
  );
}

function unflattenObject(obj: FlattenedLLMResponse): LLMResponse {
  const result = {} as LLMResponse;
  for (const [key, value] of Object.entries(obj)) {
    const keys = key.split('.');
    let current: any = result;
    if (typeof current !== 'object') {
      continue;
    }
    for (let i = 0; i < keys.length; i++) {
      const iteratedKey = keys[i];
      if (!iteratedKey) {
        continue;
      }
      if (i === keys.length - 1) {
        current[iteratedKey] = value;
      } else {
        current[iteratedKey] = current[iteratedKey] || {};
        current = current[iteratedKey];
      }
    }
  }
  return result;
}

const analyzeWeightedObjects = createWeightedObjectAnalyzer();

export { analyzeWeightedObjects };
