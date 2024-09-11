import LLMEngineType from '@utils/llmEngineTypes';

interface WeightedObject {
  source: LLMEngineType;
  weight: number;
  value: Record<string, any>;
}

function analyzeWeightedObjects(
  objects: WeightedObject[]
): Record<string, any> {
  // Step 1: Count Weighted Votes
  const voteCounts = new Map<string, number>();
  const firstAppearance = new Map<string, number>();

  objects.forEach((obj, index) => {
    const flattenedPairs = flattenObject(obj.value);
    flattenedPairs.forEach(([key, value]) => {
      const pairKey = JSON.stringify([key, value]);
      if (!voteCounts.has(pairKey)) {
        voteCounts.set(pairKey, 0);
        firstAppearance.set(pairKey, index);
      }
      voteCounts.set(pairKey, (voteCounts.get(pairKey) || 0) + obj.weight);
    });
  });

  // Step 2 & 3: Aggregate Scores and Determine Maximum Scores
  const maxScores = new Map<
    string,
    { value: any; score: number; index: number }
  >();

  voteCounts.forEach((score, pairKey) => {
    const [key, value] = JSON.parse(pairKey);
    if (
      !maxScores.has(key) ||
      score > maxScores.get(key)!.score ||
      (score === maxScores.get(key)!.score &&
        firstAppearance.get(pairKey)! < maxScores.get(key)!.index)
    ) {
      maxScores.set(key, {
        value,
        score,
        index: firstAppearance.get(pairKey)!,
      });
    }
  });

  // Step 4: Construct and Format Result
  const result: Record<string, any> = {};
  maxScores.forEach((data, key) => {
    if (data.score > 0) {
      setNestedValue(result, key.split('.'), data.value);
    }
  });

  return result;
}

// Helper function to flatten nested objects
function flattenObject(
  obj: Record<string, any>,
  prefix: string = ''
): FlattenedPair[] {
  return Object.entries(obj).flatMap(([key, value]): FlattenedPair[] => {
    const newKey = prefix ? `${prefix}.${key}` : key;
    return typeof value === 'object' && value !== null
      ? flattenObject(value, newKey)
      : [[newKey, value]];
  });
}

// Helper function to set nested value in an object
function setNestedValue(
  obj: Record<string, any>,
  path: string[],
  value: any
): void {
  const lastKey = path.pop()!;
  const lastObj = path.reduce((acc, key) => {
    if (!acc[key]) acc[key] = {};
    return acc[key];
  }, obj);
  lastObj[lastKey] = value;
}

export { analyzeWeightedObjects };
