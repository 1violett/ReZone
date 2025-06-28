import React, { useState, useEffect } from 'react';
import { MapPin, Users, TrendingUp, Globe, Layers, Target, BarChart3 } from 'lucide-react';
import { EnhancedGeoAIEngine } from '../utils/enhancedGeoAI';
import { GeoCluster, RegionalTrend, UserGeoProfile } from '../types/geo';
import { User, Item, Rating } from '../types';
import { GeoRegion, geoRegions, generateUserProfilesForRegion, generateUsersForRegion } from '../data/geoSampleData';
import { GeoLocationSelector } from './GeoLocationSelector';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

interface EnhancedGeoAIPanelProps {
  users: User[];
  items: Item[];
  ratings: Rating[];
  selectedUserId: string;
}

export const EnhancedGeoAIPanel: React.FC<EnhancedGeoAIPanelProps> = ({ 
  users: initialUsers, 
  items, 
  ratings: initialRatings, 
  selectedUserId 
}) => {
  const [selectedRegion, setSelectedRegion] = useState<GeoRegion | null>(null);
  const [geoEngine, setGeoEngine] = useState<EnhancedGeoAIEngine | null>(null);
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [ratings, setRatings] = useState<Rating[]>(initialRatings);
  const [clusters, setClusters] = useState<GeoCluster[]>([]);
  const [regionalTrends, setRegionalTrends] = useState<RegionalTrend[]>([]);
  const [userGeoProfile, setUserGeoProfile] = useState<UserGeoProfile | null>(null);
  const [activeView, setActiveView] = useState<'overview' | 'clusters' | 'trends' | 'demographics'>('overview');
  const [isGenerating, setIsGenerating] = useState(false);
  const [regionInsights, setRegionInsights] = useState<any>(null);

  useEffect(() => {
    if (selectedRegion && geoEngine) {
      loadGeoData();
    }
  }, [selectedRegion, geoEngine, selectedUserId]);

  const handleRegionSelect = (region: GeoRegion) => {
    setSelectedRegion(region);
    const engine = new EnhancedGeoAIEngine(users, items, ratings);
    engine.setRegion(region);
    setGeoEngine(engine);
  };

  const generateSampleData = async () => {
    if (!selectedRegion) return;

    setIsGenerating(true);
    
    try {
      // Generate users and profiles for the selected region
      const regionUsers = generateUsersForRegion(selectedRegion, 25);
      const regionProfiles = generateUserProfilesForRegion(selectedRegion, 25);
      
      // Generate sample ratings
      const regionRatings: Rating[] = [];
      regionUsers.forEach(user => {
        const numRatings = Math.floor(Math.random() * 8) + 3; // 3-10 ratings per user
        const ratedItems = items.sort(() => 0.5 - Math.random()).slice(0, numRatings);
        
        ratedItems.forEach(item => {
          regionRatings.push({
            userId: user.id,
            itemId: item.id,
            rating: Math.floor(Math.random() * 3) + 3, // 3-5 stars
            timestamp: Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000 // Last 90 days
          });
        });
      });

      // Update state with new data
      setUsers(regionUsers);
      setRatings(regionRatings);

      // Create new engine with region data
      const engine = new EnhancedGeoAIEngine(regionUsers, items, regionRatings);
      engine.setRegion(selectedRegion);
      engine.setGeoProfiles(regionProfiles);
      setGeoEngine(engine);

      // Load geo data
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate processing time
      
    } catch (error) {
      console.error('Error generating sample data:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const loadGeoData = async () => {
    if (!geoEngine) return;

    const clustersData = geoEngine.clusterUsersByLocation();
    const trendsData = geoEngine.analyzeRegionalTrends();
    const insights = geoEngine.getRegionInsights();
    
    // Find a user profile for the selected user or first available
    const profileUserId = users.find(u => u.id === selectedUserId)?.id || users[0]?.id;
    const profileData = profileUserId ? geoEngine.getUserGeoProfile(profileUserId) : null;

    setClusters(clustersData);
    setRegionalTrends(trendsData);
    setUserGeoProfile(profileData);
    setRegionInsights(insights);
  };

  const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];

  const views = [
    { id: 'overview', label: 'Overview', icon: Globe },
    { id: 'clusters', label: 'Clusters', icon: Layers },
    { id: 'trends', label: 'Trends', icon: TrendingUp },
    { id: 'demographics', label: 'Demographics', icon: BarChart3 }
  ] as const;

  // Prepare chart data
  const clusterData = clusters.map((cluster, index) => ({
    name: `Cluster ${index + 1}`,
    users: cluster.userCount,
    spending: Math.round(cluster.averageSpending),
    categories: cluster.dominantCategories.length
  }));

  const trendData = regionalTrends.map(trend => ({
    category: trend.category,
    score: Math.round(trend.trendScore),
    growth: Math.round(trend.growthRate * 100)
  }));

  const demographicsData = selectedRegion ? 
    Object.entries(selectedRegion.demographics.ageDistribution).map(([age, percentage]) => ({
      age: age.replace('-', ' to '),
      percentage: Math.round(percentage * 100),
      count: Math.round(percentage * selectedRegion.demographics.population / 1000)
    })) : [];

  const interestsData = selectedRegion ?
    Object.entries(selectedRegion.demographics.interests).map(([interest, score]) => ({
      interest: interest.charAt(0).toUpperCase() + interest.slice(1),
      score: Math.round(score * 100)
    })) : [];

  return (
    <div className="space-y-6">
      {/* Region Selector */}
      <GeoLocationSelector
        selectedRegion={selectedRegion}
        onRegionSelect={handleRegionSelect}
        onGenerateData={generateSampleData}
        isGenerating={isGenerating}
      />

      {selectedRegion && (
        <>
          {/* Header */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900 flex items-center">
                <Globe className="w-6 h-6 mr-2 text-blue-500" />
                GeoAI Analytics - {selectedRegion.name}
              </h3>
              <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
                {views.map((view) => {
                  const Icon = view.icon;
                  return (
                    <button
                      key={view.id}
                      onClick={() => setActiveView(view.id)}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all ${
                        activeView === view.id
                          ? 'bg-blue-500 text-white shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-sm font-medium">{view.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Users</p>
                  <p className="text-2xl font-bold text-blue-600">{users.length}</p>
                </div>
                <Users className="w-8 h-8 text-blue-500" />
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Geo Clusters</p>
                  <p className="text-2xl font-bold text-green-600">{clusters.length}</p>
                </div>
                <Layers className="w-8 h-8 text-green-500" />
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg Spending</p>
                  <p className="text-2xl font-bold text-purple-600">
                    ${regionInsights?.region?.businessData?.avgSpending || 0}
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-purple-500" />
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Population</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {selectedRegion ? (selectedRegion.demographics.population / 1000000).toFixed(1) : 0}M
                  </p>
                </div>
                <MapPin className="w-8 h-8 text-orange-500" />
              </div>
            </div>
          </div>

          {/* Content based on active view */}
          {activeView === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Regional Interests</h4>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={interestsData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="interest" />
                      <PolarRadiusAxis angle={90} domain={[0, 100]} />
                      <Radar
                        name="Interest Level"
                        dataKey="score"
                        stroke="#3b82f6"
                        fill="#3b82f6"
                        fillOpacity={0.3}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Category Performance</h4>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={trendData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="category" fontSize={12} />
                      <YAxis fontSize={12} />
                      <Tooltip />
                      <Bar dataKey="score" fill="#10b981" name="Trend Score" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {activeView === 'clusters' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Cluster Distribution</h4>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={clusterData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" fontSize={12} />
                      <YAxis fontSize={12} />
                      <Tooltip />
                      <Bar dataKey="users" fill="#3b82f6" name="Users" />
                      <Bar dataKey="spending" fill="#10b981" name="Avg Spending" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Cluster Spending</h4>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={clusterData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, spending }) => `${name}: $${spending}`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="spending"
                      >
                        {clusterData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {activeView === 'trends' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Category Trends</h4>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={trendData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="category" fontSize={12} />
                      <YAxis fontSize={12} />
                      <Tooltip />
                      <Line type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={2} name="Trend Score" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Growth Rates</h4>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={trendData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="category" fontSize={12} />
                      <YAxis fontSize={12} />
                      <Tooltip />
                      <Bar dataKey="growth" fill="#ef4444" name="Growth %" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {activeView === 'demographics' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Age Distribution</h4>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={demographicsData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ age, percentage }) => `${age}: ${percentage}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="percentage"
                      >
                        {demographicsData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Population by Age Group</h4>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={demographicsData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="age" fontSize={12} />
                      <YAxis fontSize={12} />
                      <Tooltip />
                      <Bar dataKey="count" fill="#8b5cf6" name="Population (K)" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {/* Detailed Tables */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h4 className="text-lg font-semibold text-gray-900">Cluster Analysis</h4>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cluster
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Users
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Categories
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Avg Spending
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Radius
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {clusters.map((cluster, index) => (
                    <tr key={cluster.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          Cluster {index + 1}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {cluster.userCount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-wrap gap-1">
                          {cluster.dominantCategories.map((category, idx) => (
                            <span
                              key={idx}
                              className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800"
                            >
                              {category}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${Math.round(cluster.averageSpending)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {(cluster.radius / 1000).toFixed(1)}km
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};