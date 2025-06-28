import React, { useState } from 'react';
import { MapPin, Users, TrendingUp, Globe, ChevronDown } from 'lucide-react';
import { GeoRegion, geoRegions } from '../data/geoSampleData';

interface GeoLocationSelectorProps {
  selectedRegion: GeoRegion | null;
  onRegionSelect: (region: GeoRegion) => void;
  onGenerateData: () => void;
  isGenerating: boolean;
}

export const GeoLocationSelector: React.FC<GeoLocationSelectorProps> = ({
  selectedRegion,
  onRegionSelect,
  onGenerateData,
  isGenerating
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <Globe className="w-5 h-5 mr-2 text-blue-500" />
          Select Geographic Region
        </h3>
        <div className="text-sm text-gray-500">
          {geoRegions.length} regions available
        </div>
      </div>

      {/* Region Selector */}
      <div className="relative mb-4">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <div className="flex items-center">
            <MapPin className="w-4 h-4 mr-2 text-gray-500" />
            <span className="text-gray-900">
              {selectedRegion ? selectedRegion.name : 'Choose a region...'}
            </span>
          </div>
          <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-80 overflow-y-auto">
            {geoRegions.map((region) => (
              <button
                key={region.id}
                onClick={() => {
                  onRegionSelect(region);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 ${
                  selectedRegion?.id === region.id ? 'bg-blue-50 text-blue-700' : 'text-gray-900'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{region.name}</div>
                    <div className="text-sm text-gray-500">{region.country}</div>
                  </div>
                  <div className="text-xs text-gray-400">
                    {(region.demographics.population / 1000000).toFixed(1)}M people
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Selected Region Details */}
      {selectedRegion && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-700">Population</p>
                  <p className="text-lg font-bold text-blue-900">
                    {(selectedRegion.demographics.population / 1000000).toFixed(1)}M
                  </p>
                </div>
                <Users className="w-6 h-6 text-blue-500" />
              </div>
            </div>

            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-700">Avg Income</p>
                  <p className="text-lg font-bold text-green-900">
                    ${(selectedRegion.demographics.averageIncome / 1000).toFixed(0)}K
                  </p>
                </div>
                <TrendingUp className="w-6 h-6 text-green-500" />
              </div>
            </div>

            <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-700">Avg Spending</p>
                  <p className="text-lg font-bold text-purple-900">
                    ${selectedRegion.businessData.avgSpending}
                  </p>
                </div>
                <TrendingUp className="w-6 h-6 text-purple-500" />
              </div>
            </div>
          </div>

          {/* Popular Categories */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Popular Categories</h4>
            <div className="flex flex-wrap gap-2">
              {selectedRegion.businessData.popularCategories.map((category, index) => (
                <span
                  key={index}
                  className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800"
                >
                  {category}
                </span>
              ))}
            </div>
          </div>

          {/* Top Interests */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Regional Interests</h4>
            <div className="space-y-2">
              {Object.entries(selectedRegion.demographics.interests)
                .sort(([,a], [,b]) => b - a)
                .slice(0, 5)
                .map(([interest, score]) => (
                  <div key={interest} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 capitalize">{interest}</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: `${score * 100}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-500">{(score * 100).toFixed(0)}%</span>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Generate Data Button */}
          <button
            onClick={onGenerateData}
            disabled={isGenerating}
            className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Globe className="w-4 h-4" />
            )}
            <span>{isGenerating ? 'Generating Sample Data...' : 'Generate Sample Data for Region'}</span>
          </button>
        </div>
      )}
    </div>
  );
};