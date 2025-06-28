export interface GeoLocation {
  latitude: number;
  longitude: number;
  accuracy?: number;
  timestamp: number;
}

export interface UserGeoProfile {
  userId: string;
  locations: GeoLocation[];
  homeLocation?: GeoLocation;
  workLocation?: GeoLocation;
  frequentAreas: GeoCluster[];
  mobilityPattern: 'local' | 'commuter' | 'traveler' | 'nomad';
  timeZone: string;
  country: string;
  region: string;
  city: string;
}

export interface GeoCluster {
  id: string;
  centroid: GeoLocation;
  radius: number;
  userCount: number;
  dominantCategories: string[];
  averageSpending: number;
  popularProducts: string[];
  demographics: {
    ageGroups: Record<string, number>;
    interests: Record<string, number>;
  };
}

export interface RegionalTrend {
  region: string;
  category: string;
  trendScore: number;
  growthRate: number;
  seasonality: number[];
  popularTimes: number[];
}

export interface GeoRecommendation {
  itemId: string;
  score: number;
  reason: string;
  geoRelevance: number;
  localPopularity: number;
  distanceScore: number;
  culturalFit: number;
}

export interface LocationContext {
  type: 'home' | 'work' | 'travel' | 'shopping' | 'leisure';
  confidence: number;
  nearbyPOIs: string[];
  localBusinesses: string[];
  demographics: any;
}