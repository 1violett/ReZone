import React, { useState } from 'react';
import { DataUploader } from './components/DataUploader';
import { ForecastingPanel } from './components/ForecastingPanel';
import { RecommendationPanel } from './components/RecommendationPanel';
import { InventoryDashboard } from './components/InventoryDashboard';
import { ProductAnalysis } from './components/ProductAnalysis';
import { EnhancedGeoAIPanel } from './components/EnhancedGeoAIPanel';
import { AIRecommendationPanel } from './components/AIRecommendationPanel';
import { sampleUsers, sampleItems, sampleRatings, sampleInventoryData } from './data/sampleData';
import { TrendingUp, Users, Package, BarChart3, Globe, Brain } from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState<'forecasting' | 'recommendations' | 'inventory' | 'analysis' | 'geoai' | 'ai-recs'>('geoai');
  const [forecastData, setForecastData] = useState<number[]>([]);
  const [selectedUserId, setSelectedUserId] = useState(sampleUsers[0]?.id || '');

  const tabs = [
    { id: 'geoai', label: 'GeoAI Analytics', icon: Globe },
    { id: 'ai-recs', label: 'AI Recommendations', icon: Brain },
    { id: 'forecasting', label: 'Demand Forecasting', icon: TrendingUp },
    { id: 'recommendations', label: 'Recommendations', icon: Users },
    { id: 'inventory', label: 'Inventory Management', icon: Package },
    { id: 'analysis', label: 'Product Analysis', icon: BarChart3 }
  ] as const;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            ReZone Analytics
          </h1>
          <p className="text-lg text-gray-600">
            Advanced GeoAI & Transformer-Powered Recommendation System
          </p>
          <div className="mt-4 flex items-center justify-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <Globe className="w-4 h-4" />
              <span>Location Intelligence</span>
            </div>
            <div className="flex items-center space-x-1">
              <Brain className="w-4 h-4" />
              <span>AI-Powered</span>
            </div>
            <div className="flex items-center space-x-1">
              <TrendingUp className="w-4 h-4" />
              <span>Real-time Analytics</span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-xl p-1 shadow-lg border border-gray-200">
            <div className="flex space-x-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition-all duration-200 ${
                      activeTab === tab.id
                        ? 'bg-blue-500 text-white shadow-md'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium text-sm">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* User Selection */}
        {(activeTab === 'recommendations' || activeTab === 'ai-recs') && (
          <div className="max-w-md mx-auto mb-6">
            <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-200">
              <label className="block text-sm font-medium text-gray-700 mb-2">Select User</label>
              <select
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {sampleUsers.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name} - {user.demographics?.location || 'Unknown Location'}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="max-w-7xl mx-auto">
          {activeTab === 'geoai' && (
            <EnhancedGeoAIPanel
              users={sampleUsers}
              items={sampleItems}
              ratings={sampleRatings}
              selectedUserId={selectedUserId}
            />
          )}

          {activeTab === 'ai-recs' && (
            <AIRecommendationPanel
              users={sampleUsers}
              items={sampleItems}
              ratings={sampleRatings}
              selectedUserId={selectedUserId}
            />
          )}

          {activeTab === 'forecasting' && (
            <div className="space-y-6">
              <DataUploader onDataLoaded={setForecastData} />
              {forecastData.length > 0 && (
                <ForecastingPanel data={forecastData} />
              )}
            </div>
          )}

          {activeTab === 'recommendations' && (
            <RecommendationPanel
              users={sampleUsers}
              items={sampleItems}
              ratings={sampleRatings}
              selectedUserId={selectedUserId}
            />
          )}

          {activeTab === 'inventory' && (
            <InventoryDashboard inventoryData={sampleInventoryData} />
          )}

          {activeTab === 'analysis' && (
            <ProductAnalysis
              products={sampleItems}
              ratings={sampleRatings}
              users={sampleUsers}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;