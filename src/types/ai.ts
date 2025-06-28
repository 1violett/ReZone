export interface TransformerConfig {
  modelName: string;
  maxLength: number;
  temperature: number;
  topK: number;
  topP: number;
}

export interface UserEmbedding {
  userId: string;
  embedding: number[];
  lastUpdated: number;
  confidence: number;
}

export interface ItemEmbedding {
  itemId: string;
  embedding: number[];
  category: string;
  features: number[];
  lastUpdated: number;
}

export interface AIRecommendation {
  itemId: string;
  score: number;
  confidence: number;
  reasoning: string;
  embeddingSimilarity: number;
  contextualRelevance: number;
  noveltyScore: number;
  diversityScore: number;
}

export interface SemanticSearch {
  query: string;
  results: {
    itemId: string;
    similarity: number;
    relevance: number;
  }[];
}

export interface BehaviorPattern {
  userId: string;
  patterns: {
    timeOfDay: number[];
    dayOfWeek: number[];
    seasonal: number[];
    categoryPreferences: Record<string, number>;
    priceRanges: Record<string, number>;
  };
  predictedNextAction: string;
  confidence: number;
}