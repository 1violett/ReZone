import { User, Item, Rating, InventoryItem } from '../types';

export const sampleUsers: User[] = [
  {
    id: 'user1',
    name: 'Alice Johnson',
    preferences: { electronics: 0.8, books: 0.6, clothing: 0.4 },
    demographics: {
      age: 28,
      location: 'New York',
      interests: ['technology', 'reading', 'fitness']
    }
  },
  {
    id: 'user2',
    name: 'Bob Smith',
    preferences: { electronics: 0.9, sports: 0.7, books: 0.3 },
    demographics: {
      age: 35,
      location: 'California',
      interests: ['gaming', 'sports', 'music']
    }
  },
  {
    id: 'user3',
    name: 'Carol Davis',
    preferences: { clothing: 0.9, beauty: 0.8, books: 0.5 },
    demographics: {
      age: 24,
      location: 'Texas',
      interests: ['fashion', 'beauty', 'travel']
    }
  },
  {
    id: 'user4',
    name: 'David Wilson',
    preferences: { books: 0.9, electronics: 0.6, home: 0.7 },
    demographics: {
      age: 42,
      location: 'Florida',
      interests: ['reading', 'cooking', 'gardening']
    }
  }
];

export const sampleItems: Item[] = [
  {
    id: 'item1',
    name: 'Wireless Headphones',
    category: 'Electronics',
    subcategory: 'Audio',
    price: 199.99,
    features: { wireless: 1, noiseCanceling: 1, batteryLife: 0.8 },
    tags: ['wireless', 'bluetooth', 'premium'],
    brand: 'TechSound',
    ratings: { user1: 5, user2: 4 },
    averageRating: 4.5,
    reviewCount: 2
  },
  {
    id: 'item2',
    name: 'Programming Book',
    category: 'Books',
    subcategory: 'Technology',
    price: 49.99,
    features: { difficulty: 0.7, pages: 0.8, practical: 0.9 },
    tags: ['programming', 'javascript', 'beginner'],
    brand: 'TechBooks',
    ratings: { user1: 4, user4: 5 },
    averageRating: 4.5,
    reviewCount: 2
  },
  {
    id: 'item3',
    name: 'Designer Jacket',
    category: 'Clothing',
    subcategory: 'Outerwear',
    price: 299.99,
    features: { style: 0.9, comfort: 0.8, durability: 0.7 },
    tags: ['designer', 'winter', 'premium'],
    brand: 'FashionCo',
    ratings: { user3: 5 },
    averageRating: 5.0,
    reviewCount: 1
  },
  {
    id: 'item4',
    name: 'Smart Watch',
    category: 'Electronics',
    subcategory: 'Wearables',
    price: 399.99,
    features: { smart: 1, fitness: 0.9, battery: 0.7 },
    tags: ['smartwatch', 'fitness', 'ios'],
    brand: 'TechWear',
    ratings: { user1: 4, user2: 5 },
    averageRating: 4.5,
    reviewCount: 2
  },
  {
    id: 'item5',
    name: 'Cooking Essentials',
    category: 'Home',
    subcategory: 'Kitchen',
    price: 89.99,
    features: { quality: 0.8, versatility: 0.9, durability: 0.8 },
    tags: ['cooking', 'kitchen', 'essentials'],
    brand: 'HomeChef',
    ratings: { user4: 5 },
    averageRating: 5.0,
    reviewCount: 1
  }
];

export const sampleRatings: Rating[] = [
  { userId: 'user1', itemId: 'item1', rating: 5, timestamp: Date.now() - 86400000 },
  { userId: 'user1', itemId: 'item2', rating: 4, timestamp: Date.now() - 172800000 },
  { userId: 'user1', itemId: 'item4', rating: 4, timestamp: Date.now() - 259200000 },
  { userId: 'user2', itemId: 'item1', rating: 4, timestamp: Date.now() - 345600000 },
  { userId: 'user2', itemId: 'item4', rating: 5, timestamp: Date.now() - 432000000 },
  { userId: 'user3', itemId: 'item3', rating: 5, timestamp: Date.now() - 518400000 },
  { userId: 'user4', itemId: 'item2', rating: 5, timestamp: Date.now() - 604800000 },
  { userId: 'user4', itemId: 'item5', rating: 5, timestamp: Date.now() - 691200000 }
];

export const sampleInventoryData: InventoryItem[] = [
  {
    id: 'inv1',
    name: 'Wireless Headphones',
    category: 'Electronics',
    currentStock: 45,
    reorderPoint: 20,
    maxStock: 100,
    unitCost: 120,
    sellingPrice: 199.99,
    supplier: 'TechSound Inc.',
    leadTime: 7,
    demandHistory: [12, 15, 18, 22, 19, 25, 28, 24, 20, 16, 14, 18, 21, 26, 23],
    lastUpdated: Date.now()
  },
  {
    id: 'inv2',
    name: 'Programming Books',
    category: 'Books',
    currentStock: 78,
    reorderPoint: 30,
    maxStock: 150,
    unitCost: 25,
    sellingPrice: 49.99,
    supplier: 'BookWorld',
    leadTime: 3,
    demandHistory: [8, 12, 10, 15, 18, 14, 16, 20, 17, 13, 11, 14, 19, 22, 18],
    lastUpdated: Date.now()
  },
  {
    id: 'inv3',
    name: 'Designer Jackets',
    category: 'Clothing',
    currentStock: 15,
    reorderPoint: 10,
    maxStock: 50,
    unitCost: 180,
    sellingPrice: 299.99,
    supplier: 'Fashion Direct',
    leadTime: 14,
    demandHistory: [3, 5, 4, 7, 8, 6, 9, 11, 8, 5, 4, 6, 9, 12, 10],
    lastUpdated: Date.now()
  },
  {
    id: 'inv4',
    name: 'Smart Watches',
    category: 'Electronics',
    currentStock: 32,
    reorderPoint: 15,
    maxStock: 80,
    unitCost: 240,
    sellingPrice: 399.99,
    supplier: 'TechWear Ltd.',
    leadTime: 10,
    demandHistory: [6, 8, 10, 12, 14, 11, 13, 16, 14, 9, 7, 10, 13, 17, 15],
    lastUpdated: Date.now()
  }
];