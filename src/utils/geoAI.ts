import { GeoLocation, UserGeoProfile, GeoCluster, RegionalTrend, LocationContext } from '../types/geo';
import { User, Item, Rating } from '../types';
import * as turf from 'turf';

export class GeoAIEngine {
  private users: User[];
  private items: Item[];
  private ratings: Rating[];
  private geoProfiles: Map<string, UserGeoProfile> = new Map();
  private clusters: GeoCluster[] = [];

  constructor(users: User[], items: Item[], ratings: Rating[]) {
    this.users = users;
    this.items = items;
    this.ratings = ratings;
    this.initializeGeoProfiles();
  }

  private initializeGeoProfiles(): void {
    // Generate sample geo profiles for demonstration
    this.users.forEach(user => {
      const profile: UserGeoProfile = {
        userId: user.id,
        locations: this.generateSampleLocations(),
        homeLocation: this.generateRandomLocation(),
        workLocation: this.generateRandomLocation(),
        frequentAreas: [],
        mobilityPattern: this.determineMobilityPattern(),
        timeZone: 'UTC-5',
        country: 'USA',
        region: this.getRandomRegion(),
        city: this.getRandomCity()
      };
      this.geoProfiles.set(user.id, profile);
    });
  }

  private generateSampleLocations(): GeoLocation[] {
    const locations: GeoLocation[] = [];
    const baseLatitude = 40.7128 + (Math.random() - 0.5) * 0.1; // Around NYC
    const baseLongitude = -74.0060 + (Math.random() - 0.5) * 0.1;

    for (let i = 0; i < 20; i++) {
      locations.push({
        latitude: baseLatitude + (Math.random() - 0.5) * 0.05,
        longitude: baseLongitude + (Math.random() - 0.5) * 0.05,
        accuracy: Math.random() * 100 + 10,
        timestamp: Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000
      });
    }
    return locations;
  }

  private generateRandomLocation(): GeoLocation {
    return {
      latitude: 40.7128 + (Math.random() - 0.5) * 0.1,
      longitude: -74.0060 + (Math.random() - 0.5) * 0.1,
      accuracy: 50,
      timestamp: Date.now()
    };
  }

  private determineMobilityPattern(): 'local' | 'commuter' | 'traveler' | 'nomad' {
    const patterns = ['local', 'commuter', 'traveler', 'nomad'] as const;
    return patterns[Math.floor(Math.random() * patterns.length)];
  }

  private getRandomRegion(): string {
    const regions = ['Northeast', 'Southeast', 'Midwest', 'Southwest', 'West'];
    return regions[Math.floor(Math.random() * regions.length)];
  }

  private getRandomCity(): string {
    const cities = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia'];
    return cities[Math.floor(Math.random() * cities.length)];
  }

  public clusterUsersByLocation(): GeoCluster[] {
    const allLocations: Array<{ userId: string; location: GeoLocation }> = [];
    
    this.geoProfiles.forEach((profile, userId) => {
      profile.locations.forEach(location => {
        allLocations.push({ userId, location });
      });
    });

    // Simple clustering algorithm (k-means-like)
    const clusters: GeoCluster[] = [];
    const numClusters = Math.min(5, Math.floor(allLocations.length / 10));

    for (let i = 0; i < numClusters; i++) {
      const randomLocation = allLocations[Math.floor(Math.random() * allLocations.length)];
      
      const cluster: GeoCluster = {
        id: `cluster_${i}`,
        centroid: randomLocation.location,
        radius: 5000, // 5km radius
        userCount: 0,
        dominantCategories: this.getDominantCategories(),
        averageSpending: Math.random() * 500 + 100,
        popularProducts: this.getPopularProducts(),
        demographics: {
          ageGroups: {
            '18-25': Math.random() * 0.3,
            '26-35': Math.random() * 0.4,
            '36-45': Math.random() * 0.3,
            '46+': Math.random() * 0.2
          },
          interests: {
            'technology': Math.random(),
            'fashion': Math.random(),
            'sports': Math.random(),
            'travel': Math.random()
          }
        }
      };

      // Count users in this cluster
      allLocations.forEach(({ userId, location }) => {
        const distance = this.calculateDistance(cluster.centroid, location);
        if (distance <= cluster.radius) {
          cluster.userCount++;
        }
      });

      clusters.push(cluster);
    }

    this.clusters = clusters;
    return clusters;
  }

  private calculateDistance(loc1: GeoLocation, loc2: GeoLocation): number {
    const R = 6371000; // Earth's radius in meters
    const dLat = (loc2.latitude - loc1.latitude) * Math.PI / 180;
    const dLon = (loc2.longitude - loc1.longitude) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(loc1.latitude * Math.PI / 180) * Math.cos(loc2.latitude * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  private getDominantCategories(): string[] {
    const categories = ['Electronics', 'Clothing', 'Books', 'Home', 'Sports'];
    return categories.slice(0, Math.floor(Math.random() * 3) + 1);
  }

  private getPopularProducts(): string[] {
    return this.items.slice(0, Math.floor(Math.random() * 3) + 1).map(item => item.id);
  }

  public analyzeRegionalTrends(): RegionalTrend[] {
    const regions = ['Northeast', 'Southeast', 'Midwest', 'Southwest', 'West'];
    const categories = ['Electronics', 'Clothing', 'Books', 'Home', 'Sports'];
    const trends: RegionalTrend[] = [];

    regions.forEach(region => {
      categories.forEach(category => {
        trends.push({
          region,
          category,
          trendScore: Math.random() * 100,
          growthRate: (Math.random() - 0.5) * 0.4, // -20% to +20%
          seasonality: Array.from({ length: 12 }, () => Math.random()),
          popularTimes: Array.from({ length: 24 }, () => Math.random())
        });
      });
    });

    return trends;
  }

  public getLocationContext(location: GeoLocation): LocationContext {
    // Simulate location context analysis
    const types: Array<'home' | 'work' | 'travel' | 'shopping' | 'leisure'> = 
      ['home', 'work', 'travel', 'shopping', 'leisure'];
    
    return {
      type: types[Math.floor(Math.random() * types.length)],
      confidence: Math.random() * 0.4 + 0.6, // 60-100%
      nearbyPOIs: ['Mall', 'Restaurant', 'Park', 'Office Building'],
      localBusinesses: ['Starbucks', 'Target', 'Best Buy', 'Local Cafe'],
      demographics: {
        averageIncome: Math.random() * 50000 + 30000,
        educationLevel: 'College',
        familySize: Math.floor(Math.random() * 4) + 1
      }
    };
  }

  public getUserGeoProfile(userId: string): UserGeoProfile | undefined {
    return this.geoProfiles.get(userId);
  }

  public getClusters(): GeoCluster[] {
    return this.clusters;
  }
}