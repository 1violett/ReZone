import React, { useState, useEffect } from 'react';
import { User, Item, Recommendation } from '../types';
import { HybridCollaborativeFiltering } from '../utils/collaborativeFiltering';
import { Star, TrendingUp, Users, Target } from 'lucide-react';

interface RecommendationPanelProps {
  users: User[];
  items: Item[];
  ratings: any[];
  selectedUserId: string;
}

export const RecommendationPanel: React.FC<RecommendationPanelProps> = ({
  users,
  items,
  ratings,
  selectedUserId
}) => {
  const [recommendations, setRecommendations] = useState<{
    userBased: Recommendation[];
    itemBased: Recommendation[];
    hybrid: Recommendation[];
  }>({
    userBased: [],
    itemBased: [],
    hybrid: []
  });
  
  const [activeTab, setActiveTab] = useState<'user' | 'item' | 'hybrid'>('hybrid');

  useEffect(() => {
    if (selectedUserId && users.length > 0 && items.length > 0) {
      const cf = new HybridCollaborativeFiltering(users, items, ratings);
      
      setRecommendations({
        userBased: cf.getUserBasedRecommendations(selectedUserId, 5),
        itemBased: cf.getItemBasedRecommendations(selectedUserId, 5),
        hybrid: cf.getHybridRecommendations(selectedUserId, 5)
      });
    }
  }, [selectedUserId, users, items, ratings]);

  const getItemName = (itemId: string) => {
    const item = items.find(i => i.id === itemId);
    return item ? item.name : 'Unknown Item';
  };

  const getItemCategory = (itemId: string) => {
    const item = items.find(i => i.id === itemId);
    return item ? item.category : 'Unknown';
  };

  const renderRecommendations = (recs: Recommendation[]) => (
    <div className="space-y-3">
      {recs.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <Target className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No recommendations available</p>
        </div>
      ) : (
        recs.map((rec, index) => (
          <div
            key={rec.itemId}
            className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900">{getItemName(rec.itemId)}</h4>
                <p className="text-sm text-gray-600">{getItemCategory(rec.itemId)}</p>
                <p className="text-xs text-gray-500 mt-1">{rec.reason}</p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex items-center">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="ml-1 text-sm font-medium">
                    {rec.score.toFixed(2)}
                  </span>
                </div>
                <div className="text-xs text-gray-400">
                  #{index + 1}
                </div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );

  const tabs = [
    { id: 'hybrid', label: 'Hybrid', icon: TrendingUp, color: 'bg-purple-500' },
    { id: 'user', label: 'User-Based', icon: Users, color: 'bg-blue-500' },
    { id: 'item', label: 'Item-Based', icon: Target, color: 'bg-green-500' }
  ] as const;

  return (
    <div className="bg-gray-50 rounded-xl p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-6">Recommendations</h3>
      
      <div className="flex space-x-1 mb-6 bg-gray-200 rounded-lg p-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center space-x-2 py-2 px-3 rounded-md transition-all ${
                activeTab === tab.id
                  ? `${tab.color} text-white shadow-sm`
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-sm font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>

      <div className="max-h-96 overflow-y-auto">
        {activeTab === 'hybrid' && renderRecommendations(recommendations.hybrid)}
        {activeTab === 'user' && renderRecommendations(recommendations.userBased)}
        {activeTab === 'item' && renderRecommendations(recommendations.itemBased)}
      </div>
    </div>
  );
};