import React, { useState, useEffect } from 'react';
import { Brain, Zap, Target, TrendingUp, Star, Lightbulb } from 'lucide-react';
import { TransformerRecommender } from '../utils/transformerRecommender';
import { AIRecommendation, BehaviorPattern } from '../types/ai';
import { User, Item, Rating } from '../types';

interface AIRecommendationPanelProps {
  users: User[];
  items: Item[];
  ratings: Rating[];
  selectedUserId: string;
}

export const AIRecommendationPanel: React.FC<AIRecommendationPanelProps> = ({
  users,
  items,
  ratings,
  selectedUserId
}) => {
  const [recommender] = useState(() => new TransformerRecommender(users, items, ratings));
  const [aiRecommendations, setAiRecommendations] = useState<AIRecommendation[]>([]);
  const [behaviorPattern, setBehaviorPattern] = useState<BehaviorPattern | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'recommendations' | 'patterns' | 'insights'>('recommendations');

  useEffect(() => {
    loadAIRecommendations();
  }, [selectedUserId]);

  const loadAIRecommendations = async () => {
    setIsLoading(true);
    try {
      const recommendations = await recommender.getTransformerRecommendations(selectedUserId, 8);
      const patterns = recommender.analyzeBehaviorPatterns(selectedUserId);
      
      setAiRecommendations(recommendations);
      setBehaviorPattern(patterns);
    } catch (error) {
      console.error('Error loading AI recommendations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getItemName = (itemId: string) => {
    const item = items.find(i => i.id === itemId);
    return item ? item.name : 'Unknown Item';
  };

  const getItemCategory = (itemId: string) => {
    const item = items.find(i => i.id === itemId);
    return item ? item.category : 'Unknown';
  };

  const getItemPrice = (itemId: string) => {
    const item = items.find(i => i.id === itemId);
    return item ? item.price : 0;
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600 bg-green-100';
    if (confidence >= 0.6) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const tabs = [
    { id: 'recommendations', label: 'AI Recommendations', icon: Brain },
    { id: 'patterns', label: 'Behavior Patterns', icon: TrendingUp },
    { id: 'insights', label: 'AI Insights', icon: Lightbulb }
  ] as const;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-gray-900 flex items-center">
            <Brain className="w-6 h-6 mr-2 text-purple-500" />
            AI-Powered Recommendations
          </h3>
          <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all ${
                    activeTab === tab.id
                      ? 'bg-purple-500 text-white shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* AI Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">AI Confidence</p>
              <p className="text-2xl font-bold text-purple-600">
                {behaviorPattern ? (behaviorPattern.confidence * 100).toFixed(0) : 0}%
              </p>
            </div>
            <Zap className="w-8 h-8 text-purple-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Recommendations</p>
              <p className="text-2xl font-bold text-blue-600">{aiRecommendations.length}</p>
            </div>
            <Target className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Score</p>
              <p className="text-2xl font-bold text-green-600">
                {aiRecommendations.length > 0 
                  ? (aiRecommendations.reduce((sum, r) => sum + r.score, 0) / aiRecommendations.length).toFixed(2)
                  : '0.00'
                }
              </p>
            </div>
            <Star className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Next Action</p>
              <p className="text-sm font-bold text-orange-600">
                {behaviorPattern?.predictedNextAction.replace(/_/g, ' ') || 'Analyzing...'}
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-orange-500" />
          </div>
        </div>
      </div>

      {/* Content based on active tab */}
      {activeTab === 'recommendations' && (
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-lg font-semibold text-gray-900">Transformer-Based Recommendations</h4>
            <button
              onClick={loadAIRecommendations}
              disabled={isLoading}
              className="flex items-center space-x-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Brain className="w-4 h-4" />
              )}
              <span>{isLoading ? 'Processing...' : 'Refresh AI'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {aiRecommendations.map((rec, index) => (
              <div
                key={rec.itemId}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h5 className="font-semibold text-gray-900">{getItemName(rec.itemId)}</h5>
                    <p className="text-sm text-gray-600">{getItemCategory(rec.itemId)}</p>
                    <p className="text-sm font-medium text-green-600">${getItemPrice(rec.itemId)}</p>
                  </div>
                  <div className="flex flex-col items-end space-y-1">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getConfidenceColor(rec.confidence)}`}>
                      {(rec.confidence * 100).toFixed(0)}%
                    </span>
                    <div className="text-xs text-gray-500">#{index + 1}</div>
                  </div>
                </div>

                <div className="space-y-2 mb-3">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-600">AI Score:</span>
                    <span className="font-medium">{rec.score.toFixed(3)}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-600">Similarity:</span>
                    <span className="font-medium">{(rec.embeddingSimilarity * 100).toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-600">Novelty:</span>
                    <span className="font-medium">{(rec.noveltyScore * 100).toFixed(1)}%</span>
                  </div>
                </div>

                <p className="text-xs text-gray-700 bg-gray-50 p-2 rounded">
                  {rec.reasoning}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'patterns' && behaviorPattern && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Category Preferences */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Category Preferences</h4>
            <div className="space-y-3">
              {Object.entries(behaviorPattern.patterns.categoryPreferences)
                .sort(([,a], [,b]) => b - a)
                .map(([category, score]) => (
                  <div key={category} className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">{category}</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-purple-500 h-2 rounded-full"
                          style={{ width: `${(score / 5) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-600">{score.toFixed(1)}</span>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Price Range Preferences */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Price Range Preferences</h4>
            <div className="space-y-3">
              {Object.entries(behaviorPattern.patterns.priceRanges).map(([range, percentage]) => (
                <div key={range} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">
                    {range.replace('_', ' ').replace('plus', '+')}
                  </span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: `${percentage * 100}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-600">{(percentage * 100).toFixed(0)}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'insights' && (
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
          <h4 className="text-lg font-semibold text-gray-900 mb-6">AI-Generated Insights</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h5 className="font-medium text-blue-900 mb-2 flex items-center">
                  <Brain className="w-4 h-4 mr-2" />
                  Behavioral Analysis
                </h5>
                <p className="text-sm text-blue-700">
                  Based on transformer analysis, this user shows strong preference for {
                    behaviorPattern ? 
                    Object.entries(behaviorPattern.patterns.categoryPreferences)
                      .sort(([,a], [,b]) => b - a)[0]?.[0] || 'various categories'
                    : 'various categories'
                  } with consistent purchasing patterns.
                </p>
              </div>

              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <h5 className="font-medium text-green-900 mb-2 flex items-center">
                  <Target className="w-4 h-4 mr-2" />
                  Recommendation Strategy
                </h5>
                <p className="text-sm text-green-700">
                  AI recommends focusing on high-similarity items with moderate novelty to balance 
                  user satisfaction with discovery. Confidence level is {
                    behaviorPattern ? (behaviorPattern.confidence * 100).toFixed(0) : '0'
                  }%.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                <h5 className="font-medium text-purple-900 mb-2 flex items-center">
                  <Zap className="w-4 h-4 mr-2" />
                  Optimization Opportunities
                </h5>
                <p className="text-sm text-purple-700">
                  Transformer embeddings suggest exploring cross-category recommendations 
                  to increase diversity while maintaining relevance scores above 0.7.
                </p>
              </div>

              <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                <h5 className="font-medium text-orange-900 mb-2 flex items-center">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Predicted Behavior
                </h5>
                <p className="text-sm text-orange-700">
                  Next predicted action: {
                    behaviorPattern?.predictedNextAction.replace(/_/g, ' ') || 'continue exploring'
                  }. This suggests the user is in a {
                    behaviorPattern?.predictedNextAction.includes('explore') ? 'discovery' : 'focused'
                  } phase.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};