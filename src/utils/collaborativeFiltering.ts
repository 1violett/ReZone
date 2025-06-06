import { Matrix } from 'ml-matrix';
import { User, Item, Rating, Recommendation } from '../types';

export class HybridCollaborativeFiltering {
  private userItemMatrix: Matrix;
  private users: User[];
  private items: Item[];
  private ratings: Rating[];

  constructor(users: User[], items: Item[], ratings: Rating[]) {
    this.users = users;
    this.items = items;
    this.ratings = ratings;
    this.userItemMatrix = this.buildUserItemMatrix();
  }

  private buildUserItemMatrix(): Matrix {
    const userIds = this.users.map(u => u.id);
    const itemIds = this.items.map(i => i.id);
    
    const matrix = new Matrix(userIds.length, itemIds.length);
    
    this.ratings.forEach(rating => {
      const userIndex = userIds.indexOf(rating.userId);
      const itemIndex = itemIds.indexOf(rating.itemId);
      if (userIndex !== -1 && itemIndex !== -1) {
        matrix.set(userIndex, itemIndex, rating.rating);
      }
    });
    
    return matrix;
  }

  private calculateUserSimilarity(user1Index: number, user2Index: number): number {
    const user1Ratings = this.userItemMatrix.getRow(user1Index);
    const user2Ratings = this.userItemMatrix.getRow(user2Index);
    
    let dotProduct = 0;
    let norm1 = 0;
    let norm2 = 0;
    let commonItems = 0;
    
    for (let i = 0; i < user1Ratings.length; i++) {
      if (user1Ratings[i] !== 0 && user2Ratings[i] !== 0) {
        dotProduct += user1Ratings[i] * user2Ratings[i];
        norm1 += user1Ratings[i] * user1Ratings[i];
        norm2 += user2Ratings[i] * user2Ratings[i];
        commonItems++;
      }
    }
    
    if (commonItems === 0) return 0;
    
    const similarity = dotProduct / (Math.sqrt(norm1) * Math.sqrt(norm2));
    return isNaN(similarity) ? 0 : similarity;
  }

  private calculateItemSimilarity(item1Index: number, item2Index: number): number {
    const item1 = this.items[item1Index];
    const item2 = this.items[item2Index];
    
    // Content-based similarity using item features
    const features1 = Object.values(item1.features);
    const features2 = Object.values(item2.features);
    
    let dotProduct = 0;
    let norm1 = 0;
    let norm2 = 0;
    
    for (let i = 0; i < Math.min(features1.length, features2.length); i++) {
      dotProduct += features1[i] * features2[i];
      norm1 += features1[i] * features1[i];
      norm2 += features2[i] * features2[i];
    }
    
    const similarity = dotProduct / (Math.sqrt(norm1) * Math.sqrt(norm2));
    return isNaN(similarity) ? 0 : similarity;
  }

  public getUserBasedRecommendations(userId: string, topK: number = 10): Recommendation[] {
    const userIndex = this.users.findIndex(u => u.id === userId);
    if (userIndex === -1) return [];
    
    const similarities: { userIndex: number; similarity: number }[] = [];
    
    for (let i = 0; i < this.users.length; i++) {
      if (i !== userIndex) {
        const similarity = this.calculateUserSimilarity(userIndex, i);
        similarities.push({ userIndex: i, similarity });
      }
    }
    
    similarities.sort((a, b) => b.similarity - a.similarity);
    const topSimilarUsers = similarities.slice(0, Math.min(5, similarities.length));
    
    const recommendations: Map<string, number> = new Map();
    
    topSimilarUsers.forEach(({ userIndex: similarUserIndex, similarity }) => {
      const similarUserRatings = this.userItemMatrix.getRow(similarUserIndex);
      const currentUserRatings = this.userItemMatrix.getRow(userIndex);
      
      for (let itemIndex = 0; itemIndex < similarUserRatings.length; itemIndex++) {
        if (currentUserRatings[itemIndex] === 0 && similarUserRatings[itemIndex] > 0) {
          const itemId = this.items[itemIndex].id;
          const score = similarity * similarUserRatings[itemIndex];
          recommendations.set(itemId, (recommendations.get(itemId) || 0) + score);
        }
      }
    });
    
    return Array.from(recommendations.entries())
      .map(([itemId, score]) => ({
        itemId,
        score,
        reason: 'User-based collaborative filtering'
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, topK);
  }

  public getItemBasedRecommendations(userId: string, topK: number = 10): Recommendation[] {
    const userIndex = this.users.findIndex(u => u.id === userId);
    if (userIndex === -1) return [];
    
    const userRatings = this.userItemMatrix.getRow(userIndex);
    const recommendations: Map<string, number> = new Map();
    
    for (let ratedItemIndex = 0; ratedItemIndex < userRatings.length; ratedItemIndex++) {
      if (userRatings[ratedItemIndex] > 0) {
        for (let itemIndex = 0; itemIndex < this.items.length; itemIndex++) {
          if (userRatings[itemIndex] === 0) {
            const similarity = this.calculateItemSimilarity(ratedItemIndex, itemIndex);
            const itemId = this.items[itemIndex].id;
            const score = similarity * userRatings[ratedItemIndex];
            recommendations.set(itemId, (recommendations.get(itemId) || 0) + score);
          }
        }
      }
    }
    
    return Array.from(recommendations.entries())
      .map(([itemId, score]) => ({
        itemId,
        score,
        reason: 'Item-based collaborative filtering'
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, topK);
  }

  public getHybridRecommendations(userId: string, topK: number = 10): Recommendation[] {
    const userBased = this.getUserBasedRecommendations(userId, topK);
    const itemBased = this.getItemBasedRecommendations(userId, topK);
    
    const hybridScores: Map<string, number> = new Map();
    
    userBased.forEach(rec => {
      hybridScores.set(rec.itemId, (hybridScores.get(rec.itemId) || 0) + rec.score * 0.6);
    });
    
    itemBased.forEach(rec => {
      hybridScores.set(rec.itemId, (hybridScores.get(rec.itemId) || 0) + rec.score * 0.4);
    });
    
    return Array.from(hybridScores.entries())
      .map(([itemId, score]) => ({
        itemId,
        score,
        reason: 'Hybrid collaborative filtering'
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, topK);
  }
}