import LLMEngineType from '@utils/llmEngineTypes';

interface WeightedObject {
  source: LLMEngineType;
  weight: number;
  value: LLMResponse;
}

type FlattenedPair = [
  string,
  (
    | string
    | number
    | boolean
    | Date
    | MultiCorrectOrMultipleOption[]
    | MultiCorrectOrMultipleOption
    | LinearScaleResponse
    | RowColumn[]
    | RowColumnOption[]
  ),
];

function analyzeWeightedObjects(
  objects: WeightedObject[],
): Partial<LLMResponse> {
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
    {
      value:
        | string
        | number
        | boolean
        | Date
        | MultiCorrectOrMultipleOption[]
        | MultiCorrectOrMultipleOption
        | LinearScaleResponse
        | RowColumn[]
        | RowColumnOption[];
      score: number;
      index: number;
    }
  >();

  voteCounts.forEach((score, pairKey) => {
    const [key, value] = JSON.parse(pairKey) as [
      string,
      (
        | string
        | number
        | boolean
        | Date
        | MultiCorrectOrMultipleOption[]
        | MultiCorrectOrMultipleOption
        | LinearScaleResponse
        | RowColumn[]
        | RowColumnOption[]
      ),
    ];
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
  const result: Partial<LLMResponse> = {};
  maxScores.forEach((data, key) => {
    if (data.score > 0) {
      setNestedValue(result, key.split('.'), data.value);
    }
  });

  return result;
}

// Helper function to flatten nested objects
function flattenObject(obj: LLMResponse, prefix: string = ''): FlattenedPair[] {
  return Object.entries(obj).flatMap(([key, value]): FlattenedPair[] => {
    const newKey = prefix ? `${prefix}.${key}` : key;
    if (
      typeof value === 'object' &&
      value !== null &&
      !(value instanceof Date)
    ) {
      return flattenObject(value as LLMResponse, newKey);
    } else {
      return [
        [
          newKey,
          value as
            | string
            | number
            | boolean
            | Date
            | MultiCorrectOrMultipleOption[]
            | MultiCorrectOrMultipleOption
            | LinearScaleResponse
            | RowColumn[]
            | RowColumnOption[],
        ],
      ];
    }
  });
}

// Helper function to set nested value in an object
function setNestedValue(
  obj: Partial<LLMResponse>,
  path: string[],
  value:
    | string
    | number
    | boolean
    | Date
    | MultiCorrectOrMultipleOption[]
    | MultiCorrectOrMultipleOption
    | LinearScaleResponse
    | RowColumn[]
    | RowColumnOption[],
): void {
  const lastKey = path.pop()!;
  const lastObj = path.reduce(
    (acc: Record<string, unknown>, key) => {
      if (!acc[key]) {
        acc[key] = {};
      }
      return acc[key] as Record<string, unknown>;
    },
    obj as Record<string, unknown>,
  );
  lastObj[lastKey] = value;
}

export { analyzeWeightedObjects };
