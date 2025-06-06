import { User, Item, Rating } from '../types';

export const sampleUsers: User[] = [
  {
    id: 'user1',
    name: 'Alice Johnson',
    preferences: { action: 0.8, comedy: 0.6, drama: 0.4, sci_fi: 0.9 }
  },
  {
    id: 'user2',
    name: 'Bob Smith',
    preferences: { action: 0.7, comedy: 0.9, drama: 0.3, sci_fi: 0.5 }
  },
  {
    id: 'user3',
    name: 'Carol Davis',
    preferences: { action: 0.3, comedy: 0.4, drama: 0.9, sci_fi: 0.6 }
  },
  {
    id: 'user4',
    name: 'David Wilson',
    preferences: { action: 0.9, comedy: 0.2, drama: 0.5, sci_fi: 0.8 }
  },
  {
    id: 'user5',
    name: 'Eva Brown',
    preferences: { action: 0.4, comedy: 0.8, drama: 0.7, sci_fi: 0.3 }
  }
];

export const sampleItems: Item[] = [
  {
    id: 'item1',
    name: 'The Matrix',
    category: 'Movie',
    features: { action: 0.9, comedy: 0.2, drama: 0.6, sci_fi: 1.0 },
    ratings: {}
  },
  {
    id: 'item2',
    name: 'The Hangover',
    category: 'Movie',
    features: { action: 0.3, comedy: 1.0, drama: 0.2, sci_fi: 0.1 },
    ratings: {}
  },
  {
    id: 'item3',
    name: 'Titanic',
    category: 'Movie',
    features: { action: 0.4, comedy: 0.1, drama: 1.0, sci_fi: 0.0 },
    ratings: {}
  },
  {
    id: 'item4',
    name: 'Avengers: Endgame',
    category: 'Movie',
    features: { action: 1.0, comedy: 0.4, drama: 0.7, sci_fi: 0.8 },
    ratings: {}
  },
  {
    id: 'item5',
    name: 'Blade Runner 2049',
    category: 'Movie',
    features: { action: 0.7, comedy: 0.1, drama: 0.8, sci_fi: 1.0 },
    ratings: {}
  },
  {
    id: 'item6',
    name: 'Superbad',
    category: 'Movie',
    features: { action: 0.2, comedy: 0.9, drama: 0.3, sci_fi: 0.0 },
    ratings: {}
  },
  {
    id: 'item7',
    name: 'The Shawshank Redemption',
    category: 'Movie',
    features: { action: 0.3, comedy: 0.2, drama: 1.0, sci_fi: 0.0 },
    ratings: {}
  },
  {
    id: 'item8',
    name: 'Interstellar',
    category: 'Movie',
    features: { action: 0.5, comedy: 0.1, drama: 0.9, sci_fi: 1.0 },
    ratings: {}
  }
];

export const sampleRatings: Rating[] = [
  { userId: 'user1', itemId: 'item1', rating: 5, timestamp: Date.now() - 86400000 },
  { userId: 'user1', itemId: 'item4', rating: 4, timestamp: Date.now() - 172800000 },
  { userId: 'user1', itemId: 'item8', rating: 5, timestamp: Date.now() - 259200000 },
  { userId: 'user2', itemId: 'item2', rating: 5, timestamp: Date.now() - 86400000 },
  { userId: 'user2', itemId: 'item6', rating: 4, timestamp: Date.now() - 172800000 },
  { userId: 'user2', itemId: 'item4', rating: 3, timestamp: Date.now() - 259200000 },
  { userId: 'user3', itemId: 'item3', rating: 5, timestamp: Date.now() - 86400000 },
  { userId: 'user3', itemId: 'item7', rating: 5, timestamp: Date.now() - 172800000 },
  { userId: 'user3', itemId: 'item8', rating: 4, timestamp: Date.now() - 259200000 },
  { userId: 'user4', itemId: 'item1', rating: 4, timestamp: Date.now() - 86400000 },
  { userId: 'user4', itemId: 'item4', rating: 5, timestamp: Date.now() - 172800000 },
  { userId: 'user4', itemId: 'item5', rating: 4, timestamp: Date.now() - 259200000 },
  { userId: 'user5', itemId: 'item2', rating: 4, timestamp: Date.now() - 86400000 },
  { userId: 'user5', itemId: 'item3', rating: 3, timestamp: Date.now() - 172800000 },
  { userId: 'user5', itemId: 'item6', rating: 5, timestamp: Date.now() - 259200000 }
];

export const sampleTimeSeriesData = [
  45, 52, 48, 61, 55, 67, 71, 63, 58, 72, 
  68, 75, 82, 79, 85, 91, 88, 94, 97, 103,
  99, 106, 112, 108, 115, 121, 118, 125, 131, 128
];