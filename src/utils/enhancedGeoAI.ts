import { GeoLocation, UserGeoProfile, GeoCluster, RegionalTrend } from '../types/geo';
import { User, Item, Rating } from '../types';
import { GeoRegion } from '../data/geoSampleData';

export class EnhancedGeoAIEngine {
  private users: User[];
  private items: Item[];
  private ratings: Rating[];
  private geoProfiles: Map<string, UserGeoProfile> = new Map();
  private selectedRegion: GeoRegion | null = null;

  constructor(users: User[], items: Item[], ratings: Rating[]) {
    this.users = users;
    this.items = items;
    this.ratings = ratings;
  }

  public setRegion(region: GeoRegion): void {
    this.selectedRegion = region;
  }

  public setGeoProfiles(profiles: UserGeoProfile[]): void {
    this.geoProfiles.clear();
    profiles.forEach(profile => {
      this.geoProfiles.set(profile.userId, profile);
    });
  }

  public clusterUsersByLocation(): GeoCluster[] {
    if (!this.selectedRegion) return [];

    const clusters: GeoCluster[] = [];
    const numClusters = Math.min(6, Math.max(3, Math.floor(this.users.length / 8)));

    // Create clusters based on the selected region's characteristics
    for (let i = 0; i < numClusters; i++) {
      const clusterCenter = this.generateClusterCenter(i, numClusters);
      
      const cluster: GeoCluster = {
        id: `${this.selectedRegion.id}_cluster_${i}`,
        centroid: clusterCenter,
        radius: 2000 + Math.random() * 3000, // 2-5km radius
        userCount: Math.floor(this.users.length / numClusters) + Math.floor(Math.random() * 5),
        dominantCategories: this.getDominantCategoriesForCluster(i),
        averageSpending: this.selectedRegion.businessData.avgSpending * (0.8 + Math.random() * 0.4),
        popularProducts: this.getPopularProductsForCluster(i),
        demographics: {
          ageGroups: this.generateClusterDemographics(),
          interests: this.generateClusterInterests(i)
        }
      };

      clusters.push(cluster);
    }

    return clusters;
  }

  private generateClusterCenter(clusterIndex: number, totalClusters: number): GeoLocation {
    if (!this.selectedRegion) {
      return { latitude: 0, longitude: 0, timestamp: Date.now() };
    }

    const bounds = this.selectedRegion.coordinates.bounds;
    const centerLat = this.selectedRegion.coordinates.center.latitude;
    const centerLng = this.selectedRegion.coordinates.center.longitude;

    // Distribute clusters around the region center
    const angle = (clusterIndex / totalClusters) * 2 * Math.PI;
    const radius = 0.01 + Math.random() * 0.02; // Vary distance from center

    return {
      latitude: centerLat + Math.cos(angle) * radius,
      longitude: centerLng + Math.sin(angle) * radius,
      timestamp: Date.now()
    };
  }

  private getDominantCategoriesForCluster(clusterIndex: number): string[] {
    if (!this.selectedRegion) return ['Electronics'];

    const categories = [...this.selectedRegion.businessData.popularCategories];
    const numCategories = Math.min(3, Math.max(1, Math.floor(Math.random() * categories.length)));
    
    // Shuffle and take random categories
    for (let i = categories.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [categories[i], categories[j]] = [categories[j], categories[i]];
    }
    
    return categories.slice(0, numCategories);
  }

  private getPopularProductsForCluster(clusterIndex: number): string[] {
    return this.items
      .filter(() => Math.random() > 0.7) // Random selection
      .slice(0, Math.floor(Math.random() * 4) + 2)
      .map(item => item.id);
  }

  private generateClusterDemographics(): Record<string, number> {
    if (!this.selectedRegion) {
      return { '18-25': 0.2, '26-35': 0.3, '36-45': 0.3, '46-60': 0.15, '60+': 0.05 };
    }

    // Vary demographics slightly from region baseline
    const baseDemographics = this.selectedRegion.demographics.ageDistribution;
    const demographics: Record<string, number> = {};

    Object.entries(baseDemographics).forEach(([ageGroup, percentage]) => {
      // Add some variation (±20%)
      const variation = (Math.random() - 0.5) * 0.4;
      demographics[ageGroup] = Math.max(0, Math.min(1, percentage + variation));
    });

    // Normalize to ensure they sum to 1
    const total = Object.values(demographics).reduce((sum, val) => sum + val, 0);
    Object.keys(demographics).forEach(key => {
      demographics[key] /= total;
    });

    return demographics;
  }

  private generateClusterInterests(clusterIndex: number): Record<string, number> {
    if (!this.selectedRegion) {
      return { technology: 0.5, fashion: 0.3, sports: 0.4 };
    }

    const baseInterests = this.selectedRegion.demographics.interests;
    const interests: Record<string, number> = {};

    Object.entries(baseInterests).forEach(([interest, score]) => {
      // Add cluster-specific variation
      const variation = (Math.random() - 0.5) * 0.3;
      interests[interest] = Math.max(0, Math.min(1, score + variation));
    });

    return interests;
  }

  public analyzeRegionalTrends(): RegionalTrend[] {
    if (!this.selectedRegion) return [];

    const trends: RegionalTrend[] = [];
    const categories = this.selectedRegion.businessData.popularCategories;

    categories.forEach(category => {
      // Generate seasonal patterns based on category
      const seasonality = this.generateSeasonalityForCategory(category);
      const popularTimes = this.selectedRegion!.businessData.peakHours.map(hour => {
        const baseValue = 0.3;
        const peakBonus = this.selectedRegion!.businessData.peakHours.includes(hour) ? 0.7 : 0;
        return baseValue + peakBonus + (Math.random() - 0.5) * 0.2;
      });

      // Fill remaining hours
      while (popularTimes.length < 24) {
        popularTimes.push(0.1 + Math.random() * 0.3);
      }

      trends.push({
        region: this.selectedRegion.name,
        category,
        trendScore: 60 + Math.random() * 40, // 60-100
        growthRate: (Math.random() - 0.3) * 0.4, // -12% to +28%
        seasonality,
        popularTimes
      });
    });

    return trends;
  }

  private generateSeasonalityForCategory(category: string): number[] {
    const seasonality = Array(12).fill(0);
    
    // Different categories have different seasonal patterns
    switch (category.toLowerCase()) {
      case 'electronics':
        // Higher in Nov-Dec (holidays), lower in summer
        seasonality.forEach((_, month) => {
          if (month >= 10) seasonality[month] = 0.8 + Math.random() * 0.2; // Nov-Dec
          else if (month >= 5 && month <= 7) seasonality[month] = 0.3 + Math.random() * 0.2; // Summer
          else seasonality[month] = 0.5 + Math.random() * 0.3;
        });
        break;
      
      case 'fashion':
        // Higher in spring/fall, lower in winter
        seasonality.forEach((_, month) => {
          if (month >= 2 && month <= 4) seasonality[month] = 0.7 + Math.random() * 0.2; // Spring
          else if (month >= 8 && month <= 10) seasonality[month] = 0.8 + Math.random() * 0.2; // Fall
          else seasonality[month] = 0.4 + Math.random() * 0.3;
        });
        break;
      
      case 'sports':
      case 'outdoor':
        // Higher in spring/summer
        seasonality.forEach((_, month) => {
          if (month >= 3 && month <= 8) seasonality[month] = 0.7 + Math.random() * 0.3; // Spring/Summer
          else seasonality[month] = 0.3 + Math.random() * 0.2;
        });
        break;
      
      default:
        // Relatively stable throughout the year
        seasonality.forEach((_, month) => {
          seasonality[month] = 0.5 + Math.random() * 0.3;
        });
    }
    
    return seasonality;
  }

  public getUserGeoProfile(userId: string): UserGeoProfile | undefined {
    return this.geoProfiles.get(userId);
  }

  public getRegionInsights(): any {
    if (!this.selectedRegion) return null;

    return {
      region: this.selectedRegion,
      userCount: this.users.length,
      totalSpending: this.users.length * this.selectedRegion.businessData.avgSpending,
      topCategories: this.selectedRegion.businessData.popularCategories,
      peakHours: this.selectedRegion.businessData.peakHours,
      demographics: this.selectedRegion.demographics
    };
  }
}