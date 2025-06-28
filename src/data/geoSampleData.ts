import { GeoLocation, UserGeoProfile } from '../types/geo';
import { User } from '../types';

export interface GeoRegion {
  id: string;
  name: string;
  country: string;
  coordinates: {
    center: GeoLocation;
    bounds: {
      north: number;
      south: number;
      east: number;
      west: number;
    };
  };
  demographics: {
    population: number;
    averageIncome: number;
    ageDistribution: Record<string, number>;
    interests: Record<string, number>;
  };
  businessData: {
    retailDensity: number;
    avgSpending: number;
    popularCategories: string[];
    peakHours: number[];
  };
}

export const geoRegions: GeoRegion[] = [
  {
    id: 'nyc_manhattan',
    name: 'Manhattan, New York',
    country: 'USA',
    coordinates: {
      center: { latitude: 40.7831, longitude: -73.9712, timestamp: Date.now() },
      bounds: { north: 40.8176, south: 40.7489, east: -73.9441, west: -73.9903 }
    },
    demographics: {
      population: 1694251,
      averageIncome: 85000,
      ageDistribution: { '18-25': 0.15, '26-35': 0.35, '36-45': 0.25, '46-60': 0.20, '60+': 0.05 },
      interests: { technology: 0.8, fashion: 0.7, finance: 0.9, arts: 0.6, dining: 0.8 }
    },
    businessData: {
      retailDensity: 0.9,
      avgSpending: 450,
      popularCategories: ['Electronics', 'Fashion', 'Books', 'Home'],
      peakHours: [12, 13, 18, 19, 20]
    }
  },
  {
    id: 'sf_downtown',
    name: 'Downtown San Francisco',
    country: 'USA',
    coordinates: {
      center: { latitude: 37.7749, longitude: -122.4194, timestamp: Date.now() },
      bounds: { north: 37.8085, south: 37.7413, east: -122.3863, west: -122.4525 }
    },
    demographics: {
      population: 883305,
      averageIncome: 112000,
      ageDistribution: { '18-25': 0.20, '26-35': 0.40, '36-45': 0.25, '46-60': 0.12, '60+': 0.03 },
      interests: { technology: 0.95, startups: 0.8, sustainability: 0.7, fitness: 0.6, coffee: 0.9 }
    },
    businessData: {
      retailDensity: 0.8,
      avgSpending: 520,
      popularCategories: ['Electronics', 'Books', 'Health', 'Sustainable Products'],
      peakHours: [11, 12, 17, 18, 19]
    }
  },
  {
    id: 'london_central',
    name: 'Central London',
    country: 'UK',
    coordinates: {
      center: { latitude: 51.5074, longitude: -0.1278, timestamp: Date.now() },
      bounds: { north: 51.5355, south: 51.4793, east: -0.0759, west: -0.1797 }
    },
    demographics: {
      population: 9648110,
      averageIncome: 65000,
      ageDistribution: { '18-25': 0.18, '26-35': 0.32, '36-45': 0.28, '46-60': 0.18, '60+': 0.04 },
      interests: { culture: 0.8, fashion: 0.7, finance: 0.8, history: 0.6, tea: 0.9 }
    },
    businessData: {
      retailDensity: 0.85,
      avgSpending: 380,
      popularCategories: ['Fashion', 'Books', 'Home', 'Culture'],
      peakHours: [13, 14, 17, 18, 19]
    }
  },
  {
    id: 'tokyo_shibuya',
    name: 'Shibuya, Tokyo',
    country: 'Japan',
    coordinates: {
      center: { latitude: 35.6598, longitude: 139.7006, timestamp: Date.now() },
      bounds: { north: 35.6762, south: 35.6434, east: 139.7170, west: 139.6842 }
    },
    demographics: {
      population: 13960000,
      averageIncome: 58000,
      ageDistribution: { '18-25': 0.22, '26-35': 0.35, '36-45': 0.25, '46-60': 0.15, '60+': 0.03 },
      interests: { technology: 0.9, anime: 0.7, gaming: 0.8, fashion: 0.8, food: 0.9 }
    },
    businessData: {
      retailDensity: 0.95,
      avgSpending: 320,
      popularCategories: ['Electronics', 'Gaming', 'Fashion', 'Entertainment'],
      peakHours: [12, 13, 19, 20, 21]
    }
  },
  {
    id: 'sydney_cbd',
    name: 'Sydney CBD',
    country: 'Australia',
    coordinates: {
      center: { latitude: -33.8688, longitude: 151.2093, timestamp: Date.now() },
      bounds: { north: -33.8559, south: -33.8817, east: 151.2222, west: 151.1964 }
    },
    demographics: {
      population: 5312163,
      averageIncome: 72000,
      ageDistribution: { '18-25': 0.19, '26-35': 0.33, '36-45': 0.26, '46-60': 0.17, '60+': 0.05 },
      interests: { outdoors: 0.8, beach: 0.9, fitness: 0.7, coffee: 0.8, travel: 0.7 }
    },
    businessData: {
      retailDensity: 0.7,
      avgSpending: 410,
      popularCategories: ['Sports', 'Fashion', 'Electronics', 'Outdoor'],
      peakHours: [11, 12, 17, 18]
    }
  },
  {
    id: 'toronto_downtown',
    name: 'Downtown Toronto',
    country: 'Canada',
    coordinates: {
      center: { latitude: 43.6532, longitude: -79.3832, timestamp: Date.now() },
      bounds: { north: 43.6753, south: 43.6311, east: -79.3611, west: -79.4053 }
    },
    demographics: {
      population: 2930000,
      averageIncome: 68000,
      ageDistribution: { '18-25': 0.17, '26-35': 0.31, '36-45': 0.27, '46-60': 0.20, '60+': 0.05 },
      interests: { multiculturalism: 0.9, hockey: 0.7, technology: 0.6, arts: 0.6, food: 0.8 }
    },
    businessData: {
      retailDensity: 0.75,
      avgSpending: 390,
      popularCategories: ['Electronics', 'Books', 'Sports', 'Home'],
      peakHours: [12, 13, 17, 18, 19]
    }
  }
];

export const generateUserProfilesForRegion = (region: GeoRegion, userCount: number = 20): UserGeoProfile[] => {
  const profiles: UserGeoProfile[] = [];
  
  for (let i = 0; i < userCount; i++) {
    const userId = `${region.id}_user_${i + 1}`;
    
    // Generate locations within the region bounds
    const locations: GeoLocation[] = [];
    for (let j = 0; j < 15; j++) {
      locations.push({
        latitude: region.coordinates.bounds.south + 
          Math.random() * (region.coordinates.bounds.north - region.coordinates.bounds.south),
        longitude: region.coordinates.bounds.west + 
          Math.random() * (region.coordinates.bounds.east - region.coordinates.bounds.west),
        accuracy: Math.random() * 50 + 10,
        timestamp: Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000
      });
    }

    // Generate home and work locations
    const homeLocation: GeoLocation = {
      latitude: region.coordinates.bounds.south + 
        Math.random() * (region.coordinates.bounds.north - region.coordinates.bounds.south),
      longitude: region.coordinates.bounds.west + 
        Math.random() * (region.coordinates.bounds.east - region.coordinates.bounds.west),
      accuracy: 20,
      timestamp: Date.now()
    };

    const workLocation: GeoLocation = {
      latitude: region.coordinates.center.latitude + (Math.random() - 0.5) * 0.02,
      longitude: region.coordinates.center.longitude + (Math.random() - 0.5) * 0.02,
      accuracy: 25,
      timestamp: Date.now()
    };

    const mobilityPatterns: Array<'local' | 'commuter' | 'traveler' | 'nomad'> = 
      ['local', 'commuter', 'traveler', 'nomad'];
    
    profiles.push({
      userId,
      locations,
      homeLocation,
      workLocation,
      frequentAreas: [],
      mobilityPattern: mobilityPatterns[Math.floor(Math.random() * mobilityPatterns.length)],
      timeZone: getTimeZoneForRegion(region.id),
      country: region.country,
      region: region.name,
      city: region.name.split(',')[0]
    });
  }
  
  return profiles;
};

export const generateUsersForRegion = (region: GeoRegion, userCount: number = 20): User[] => {
  const users: User[] = [];
  const interests = Object.keys(region.demographics.interests);
  
  for (let i = 0; i < userCount; i++) {
    const userId = `${region.id}_user_${i + 1}`;
    const age = generateAgeFromDistribution(region.demographics.ageDistribution);
    
    // Generate preferences based on region's business data
    const preferences: Record<string, number> = {};
    region.businessData.popularCategories.forEach(category => {
      preferences[category.toLowerCase()] = Math.random() * 0.4 + 0.6; // 0.6 to 1.0
    });
    
    users.push({
      id: userId,
      name: generateRandomName(),
      preferences,
      demographics: {
        age,
        location: region.name,
        interests: interests.slice(0, Math.floor(Math.random() * 3) + 2)
      }
    });
  }
  
  return users;
};

const getTimeZoneForRegion = (regionId: string): string => {
  const timeZones: Record<string, string> = {
    'nyc_manhattan': 'America/New_York',
    'sf_downtown': 'America/Los_Angeles',
    'london_central': 'Europe/London',
    'tokyo_shibuya': 'Asia/Tokyo',
    'sydney_cbd': 'Australia/Sydney',
    'toronto_downtown': 'America/Toronto'
  };
  return timeZones[regionId] || 'UTC';
};

const generateAgeFromDistribution = (distribution: Record<string, number>): number => {
  const rand = Math.random();
  let cumulative = 0;
  
  for (const [ageRange, probability] of Object.entries(distribution)) {
    cumulative += probability;
    if (rand <= cumulative) {
      const [min, max] = ageRange.includes('+') 
        ? [60, 80] 
        : ageRange.split('-').map(Number);
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }
  }
  
  return 30; // fallback
};

const generateRandomName = (): string => {
  const firstNames = [
    'Alex', 'Jordan', 'Taylor', 'Casey', 'Morgan', 'Riley', 'Avery', 'Quinn',
    'Sage', 'River', 'Phoenix', 'Rowan', 'Skylar', 'Cameron', 'Dakota', 'Emery'
  ];
  const lastNames = [
    'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis',
    'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas'
  ];
  
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  
  return `${firstName} ${lastName}`;
};