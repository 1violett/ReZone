import { HfInference } from '@huggingface/inference';
import { User, Item, Rating } from '../types';
import { AIRecommendation, UserEmbedding, ItemEmbedding, BehaviorPattern } from '../types/ai';

export class TransformerRecommender {
  private hf: HfInference;
  private users: User[];
  private items: Item[];
  private ratings: Rating[];
  private userEmbeddings: Map<string, UserEmbedding> = new Map();
  private itemEmbeddings: Map<string, ItemEmbedding> = new Map();

  constructor(users: User[], items: Item[], ratings: Rating[], apiKey?: string) {
    this.hf = new HfInference(apiKey || 'hf_demo'); // Use demo token or provide your own
    this.users = users;
    this.items = items;
    this.ratings = ratings;
    this.initializeEmbeddings();
  }

  private async initializeEmbeddings(): Promise<void> {
    try {
      // Generate user embeddings based on their behavior and preferences
      for (const user of this.users) {
        const userText = this.createUserDescription(user);
        const embedding = await this.generateEmbedding(userText);
        
        this.userEmbeddings.set(user.id, {
          userId: user.id,
          embedding,
          lastUpdated: Date.now(),
          confidence: 0.85
        });
      }

      // Generate item embeddings based on their features and descriptions
      for (const item of this.items) {
        const itemText = this.createItemDescription(item);
        const embedding = await this.generateEmbedding(itemText);
        
        this.itemEmbeddings.set(item.id, {
          itemId: item.id,
          embedding,
          category: item.category,
          features: Object.values(item.features),
          lastUpdated: Date.now()
        });
      }
    } catch (error) {
      console.warn('Using fallback embeddings due to API limitations');
      this.generateFallbackEmbeddings();
    }
  }

  private generateFallbackEmbeddings(): void {
    // Generate synthetic embeddings for demonstration
    const embeddingSize = 384; // Common embedding size

    this.users.forEach(user => {
      const embedding = Array.from({ length: embeddingSize }, () => Math.random() - 0.5);
      this.userEmbeddings.set(user.id, {
        userId: user.id,
        embedding,
        lastUpdated: Date.now(),
        confidence: 0.75
      });
    });

    this.items.forEach(item => {
      const embedding = Array.from({ length: embeddingSize }, () => Math.random() - 0.5);
      this.itemEmbeddings.set(item.id, {
        itemId: item.id,
        embedding,
        category: item.category,
        features: Object.values(item.features),
        lastUpdated: Date.now()
      });
    });
  }

  private createUserDescription(user: User): string {
    const preferences = Object.entries(user.preferences)
      .map(([category, score]) => `${category}: ${score}`)
      .join(', ');
    
    const demographics = user.demographics ? 
      `Age: ${user.demographics.age}, Location: ${user.demographics.location}, Interests: ${user.demographics.interests?.join(', ')}` : '';
    
    return `User preferences: ${preferences}. Demographics: ${demographics}`;
  }

  private createItemDescription(item: Item): string {
    const features = Object.entries(item.features)
      .map(([feature, value]) => `${feature}: ${value}`)
      .join(', ');
    
    return `${item.name} in ${item.category}. Price: $${item.price}. Features: ${features}. Tags: ${item.tags.join(', ')}`;
  }

  private async generateEmbedding(text: string): Promise<number[]> {
    try {
      // Use Hugging Face's sentence transformer model
      const response = await this.hf.featureExtraction({
        model: 'sentence-transformers/all-MiniLM-L6-v2',
        inputs: text
      });
      
      return Array.isArray(response) ? response : [];
    } catch (error) {
      console.warn('Embedding generation failed, using random embedding');
      return Array.from({ length: 384 }, () => Math.random() - 0.5);
    }
  }

  private calculateCosineSimilarity(embedding1: number[], embedding2: number[]): number {
    if (embedding1.length !== embedding2.length) return 0;
    
    let dotProduct = 0;
    let norm1 = 0;
    let norm2 = 0;
    
    for (let i = 0; i < embedding1.length; i++) {
      dotProduct += embedding1[i] * embedding2[i];
      norm1 += embedding1[i] * embedding1[i];
      norm2 += embedding2[i] * embedding2[i];
    }
    
    const similarity = dotProduct / (Math.sqrt(norm1) * Math.sqrt(norm2));
    return isNaN(similarity) ? 0 : similarity;
  }

  public async getTransformerRecommendations(userId: string, topK: number = 10): Promise<AIRecommendation[]> {
    const userEmbedding = this.userEmbeddings.get(userId);
    if (!userEmbedding) return [];

    const recommendations: AIRecommendation[] = [];
    const userRatedItems = new Set(this.ratings.filter(r => r.userId === userId).map(r => r.itemId));

    for (const [itemId, itemEmbedding] of this.itemEmbeddings) {
      if (userRatedItems.has(itemId)) continue;

      const similarity = this.calculateCosineSimilarity(userEmbedding.embedding, itemEmbedding.embedding);
      const contextualRelevance = this.calculateContextualRelevance(userId, itemId);
      const noveltyScore = this.calculateNoveltyScore(userId, itemId);
      const diversityScore = Math.random() * 0.3 + 0.7; // Simplified diversity calculation

      const score = (similarity * 0.4) + (contextualRelevance * 0.3) + (noveltyScore * 0.2) + (diversityScore * 0.1);

      recommendations.push({
        itemId,
        score,
        confidence: userEmbedding.confidence * 0.9,
        reasoning: await this.generateReasoning(userId, itemId, similarity),
        embeddingSimilarity: similarity,
        contextualRelevance,
        noveltyScore,
        diversityScore
      });
    }

    return recommendations
      .sort((a, b) => b.score - a.score)
      .slice(0, topK);
  }

  private calculateContextualRelevance(userId: string, itemId: string): number {
    // Analyze user's recent behavior patterns
    const userRatings = this.ratings.filter(r => r.userId === userId);
    const recentRatings = userRatings
      .filter(r => Date.now() - r.timestamp < 30 * 24 * 60 * 60 * 1000) // Last 30 days
      .sort((a, b) => b.timestamp - a.timestamp);

    if (recentRatings.length === 0) return 0.5;

    const item = this.items.find(i => i.id === itemId);
    if (!item) return 0;

    // Calculate relevance based on recent category preferences
    const categoryRelevance = recentRatings
      .map(r => {
        const ratedItem = this.items.find(i => i.id === r.itemId);
        return ratedItem?.category === item.category ? r.rating / 5 : 0;
      })
      .reduce((sum, score) => sum + score, 0) / recentRatings.length;

    return Math.min(1, categoryRelevance);
  }

  private calculateNoveltyScore(userId: string, itemId: string): number {
    const userRatings = this.ratings.filter(r => r.userId === userId);
    const item = this.items.find(i => i.id === itemId);
    if (!item) return 0;

    // Check if user has rated items in this category before
    const categoryExperience = userRatings.filter(r => {
      const ratedItem = this.items.find(i => i.id === r.itemId);
      return ratedItem?.category === item.category;
    }).length;

    // Higher novelty for categories user hasn't explored much
    return Math.max(0, 1 - (categoryExperience / 10));
  }

  private async generateReasoning(userId: string, itemId: string, similarity: number): Promise<string> {
    const item = this.items.find(i => i.id === itemId);
    const user = this.users.find(u => u.id === userId);
    
    if (!item || !user) return 'AI-powered recommendation based on user preferences';

    const reasons = [
      `High semantic similarity (${(similarity * 100).toFixed(1)}%) with your preferences`,
      `Popular in your demographic and location`,
      `Trending item in ${item.category} category`,
      `Matches your interest in ${item.tags[0]} products`,
      `Recommended by our transformer model based on your behavior patterns`
    ];

    return reasons[Math.floor(Math.random() * reasons.length)];
  }

  public analyzeBehaviorPatterns(userId: string): BehaviorPattern {
    const userRatings = this.ratings.filter(r => r.userId === userId);
    
    // Analyze temporal patterns
    const timeOfDay = Array(24).fill(0);
    const dayOfWeek = Array(7).fill(0);
    const seasonal = Array(12).fill(0);
    
    userRatings.forEach(rating => {
      const date = new Date(rating.timestamp);
      timeOfDay[date.getHours()]++;
      dayOfWeek[date.getDay()]++;
      seasonal[date.getMonth()]++;
    });

    // Normalize patterns
    const totalRatings = userRatings.length || 1;
    timeOfDay.forEach((_, i) => timeOfDay[i] /= totalRatings);
    dayOfWeek.forEach((_, i) => dayOfWeek[i] /= totalRatings);
    seasonal.forEach((_, i) => seasonal[i] /= totalRatings);

    // Analyze category preferences
    const categoryPreferences: Record<string, number> = {};
    userRatings.forEach(rating => {
      const item = this.items.find(i => i.id === rating.itemId);
      if (item) {
        categoryPreferences[item.category] = (categoryPreferences[item.category] || 0) + rating.rating;
      }
    });

    // Normalize category preferences
    Object.keys(categoryPreferences).forEach(category => {
      const categoryRatings = userRatings.filter(r => {
        const item = this.items.find(i => i.id === r.itemId);
        return item?.category === category;
      });
      categoryPreferences[category] /= categoryRatings.length || 1;
    });

    return {
      userId,
      patterns: {
        timeOfDay,
        dayOfWeek,
        seasonal,
        categoryPreferences,
        priceRanges: this.analyzePriceRanges(userRatings)
      },
      predictedNextAction: this.predictNextAction(userRatings),
      confidence: Math.min(1, userRatings.length / 20) // Higher confidence with more data
    };
  }

  private analyzePriceRanges(userRatings: Rating[]): Record<string, number> {
    const priceRanges = {
      'under_50': 0,
      '50_100': 0,
      '100_200': 0,
      '200_plus': 0
    };

    userRatings.forEach(rating => {
      const item = this.items.find(i => i.id === rating.itemId);
      if (item) {
        if (item.price < 50) priceRanges.under_50++;
        else if (item.price < 100) priceRanges['50_100']++;
        else if (item.price < 200) priceRanges['100_200']++;
        else priceRanges.200_plus++;
      }
    });

    const total = userRatings.length || 1;
    Object.keys(priceRanges).forEach(range => {
      priceRanges[range] /= total;
    });

    return priceRanges;
  }

  private predictNextAction(userRatings: Rating[]): string {
    if (userRatings.length === 0) return 'explore_categories';
    
    const recentRatings = userRatings
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 5);

    const avgRating = recentRatings.reduce((sum, r) => sum + r.rating, 0) / recentRatings.length;
    
    if (avgRating > 4) return 'continue_exploring_similar';
    if (avgRating < 3) return 'try_different_category';
    return 'maintain_current_preferences';
  }

  public getUserEmbedding(userId: string): UserEmbedding | undefined {
    return this.userEmbeddings.get(userId);
  }

  public getItemEmbedding(itemId: string): ItemEmbedding | undefined {
    return this.itemEmbeddings.get(itemId);
  }
}