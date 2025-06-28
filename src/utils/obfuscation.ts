/**
 * ReZone Analytics - Code Obfuscation Utilities
 * Copyright (c) 2024 ReZone Analytics. All Rights Reserved.
 * 
 * TRADE SECRET: Advanced algorithms for data protection
 */

export class DataObfuscator {
  private static readonly SALT = 'RZ_2024_PROPRIETARY';
  
  public static obfuscateAlgorithm(data: any): string {
    // Proprietary obfuscation algorithm
    const jsonString = JSON.stringify(data);
    const encoded = btoa(jsonString);
    const salted = this.applySalt(encoded);
    return this.scramble(salted);
  }

  public static deobfuscateAlgorithm(obfuscated: string): any {
    try {
      const unscrambled = this.unscramble(obfuscated);
      const unsalted = this.removeSalt(unscrambled);
      const decoded = atob(unsalted);
      return JSON.parse(decoded);
    } catch {
      throw new Error('Invalid or tampered data detected');
    }
  }

  private static applySalt(data: string): string {
    return data.split('').map((char, index) => {
      const saltChar = this.SALT[index % this.SALT.length];
      return String.fromCharCode(char.charCodeAt(0) ^ saltChar.charCodeAt(0));
    }).join('');
  }

  private static removeSalt(data: string): string {
    return data.split('').map((char, index) => {
      const saltChar = this.SALT[index % this.SALT.length];
      return String.fromCharCode(char.charCodeAt(0) ^ saltChar.charCodeAt(0));
    }).join('');
  }

  private static scramble(data: string): string {
    const chars = data.split('');
    for (let i = chars.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [chars[i], chars[j]] = [chars[j], chars[i]];
    }
    return chars.join('');
  }

  private static unscramble(data: string): string {
    // Reverse scrambling process
    return data; // Simplified for demo
  }
}

// Protect critical constants
export const PROTECTED_CONSTANTS = {
  API_ENDPOINTS: DataObfuscator.obfuscateAlgorithm({
    huggingface: 'https://api-inference.huggingface.co',
    analytics: 'https://api.rezone-analytics.com'
  }),
  
  MODEL_CONFIGS: DataObfuscator.obfuscateAlgorithm({
    transformer: 'sentence-transformers/all-MiniLM-L6-v2',
    embedding_size: 384,
    confidence_threshold: 0.7
  })
};