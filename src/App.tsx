import React, { useState } from 'react';
import { RecommendationPanel } from './components/RecommendationPanel';
import { ForecastingPanel } from './components/ForecastingPanel';
import { DataUploader } from './components/DataUploader';
import { sampleUsers, sampleItems, sampleRatings, sampleTimeSeriesData } from './data/sampleData';
import { Brain, TrendingUp, Users, Database } from 'lucide-react';

function App() {
  const [selectedUserId, setSelectedUserId] = useState(sampleUsers[0]?.id || '');
  const [timeSeriesData, setTimeSeriesData] = useState<number[]>(sampleTimeSeriesData);
  const [activeTab, setActiveTab] = useState<'recommendations' | 'forecasting'>('recommendations');

  const handleDataUpload = (data: number[]) => {
    setTimeSeriesData(data);
    setActiveTab('forecasting');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Brain className="w-8 h-8 text-blue-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">
                AI Recommendation & Forecasting System
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                <Database className="w-4 h-4 inline mr-1" />
                {sampleUsers.length} Users • {sampleItems.length} Items
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('recommendations')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'recommendations'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Users className="w-4 h-4 inline mr-2" />
              Collaborative Filtering
            </button>
            <button
              onClick={() => setActiveTab('forecasting')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'forecasting'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <TrendingUp className="w-4 h-4 inline mr-2" />
              ARIMA Forecasting
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'recommendations' && (
          <div className="space-y-8">
            {/* User Selection */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Select User</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                {sampleUsers.map((user) => (
                  <button
                    key={user.id}
                    onClick={() => setSelectedUserId(user.id)}
                    className={`p-3 rounded-lg border-2 transition-all text-left ${
                      selectedUserId === user.id
                        ? 'border-blue-500 bg-blue-50 text-blue-900'
                        : 'border-gray-200 hover:border-gray-300 text-gray-700'
                    }`}
                  >
                    <div className="font-medium">{user.name}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {Object.keys(user.preferences).length} preferences
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Recommendations */}
            <RecommendationPanel
              users={sampleUsers}
              items={sampleItems}
              ratings={sampleRatings}
              selectedUserId={selectedUserId}
            />
          </div>
        )}

        {activeTab === 'forecasting' && (
          <div className="space-y-8">
            {/* Data Upload */}
            <DataUploader
              onDataUpload={handleDataUpload}
              currentData={timeSeriesData}
            />

            {/* Forecasting */}
            <ForecastingPanel data={timeSeriesData} />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p className="text-sm">
              Advanced AI-powered recommendation system with hybrid collaborative filtering and ARIMA time series forecasting
            </p>
            <p className="text-xs mt-2 text-gray-500">
              Built with React, TypeScript, and modern machine learning algorithms
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;