export interface User {
  id: string;
  name: string;
  preferences: Record<string, number>;
  demographics?: {
    age?: number;
    location?: string;
    interests?: string[];
  };
}

export interface Item {
  id: string;
  name: string;
  category: string;
  subcategory?: string;
  price: number;
  features: Record<string, number>;
  tags: string[];
  description?: string;
  brand?: string;
  ratings: Record<string, number>;
  averageRating?: number;
  reviewCount?: number;
}

export interface Rating {
  userId: string;
  itemId: string;
  rating: number;
  timestamp: number;
  review?: string;
}

export interface Recommendation {
  itemId: string;
  score: number;
  reason: string;
}

export interface RecommendationConfig {
  collaborativeWeight: number;
  contentWeight: number;
  popularityWeight: number;
  minSimilarity: number;
  maxRecommendations: number;
}

export interface SimilarityMatrix {
  [key: string]: Record<string, number>;
}

export interface UserProfile {
  userId: string;
  preferences: Record<string, number>;
  categoryPreferences: Record<string, number>;
  brandPreferences: Record<string, number>;
  priceRange: { min: number; max: number };
  averageRating: number;
  totalRatings: number;
}

// Inventory and forecasting types
export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  currentStock: number;
  reorderPoint: number;
  maxStock: number;
  unitCost: number;
  sellingPrice: number;
  supplier: string;
  leadTime: number;
  demandHistory: number[];
  lastUpdated: number;
}

export interface ForecastData {
  timestamp: number;
  value: number;
  predicted?: boolean;
  confidence?: number;
}

export interface ARIMAParams {
  p: number;
  d: number;
  q: number;
}

export interface DemandForecast {
  productId: string;
  forecastedDemand: number[];
  confidence: number;
  seasonality: number;
  trend: number;
  accuracy: number;
}