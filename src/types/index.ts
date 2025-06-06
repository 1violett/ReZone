export interface User {
  id: string;
  name: string;
  preferences: Record<string, number>;
}

export interface Item {
  id: string;
  name: string;
  category: string;
  features: Record<string, number>;
  ratings: Record<string, number>;
}

export interface Rating {
  userId: string;
  itemId: string;
  rating: number;
  timestamp: number;
}

export interface Recommendation {
  itemId: string;
  score: number;
  reason: string;
}

export interface ForecastData {
  timestamp: number;
  value: number;
  predicted?: boolean;
}

export interface ARIMAParams {
  p: number;
  d: number;
  q: number;
}