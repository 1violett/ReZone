import React, { useState, useEffect } from 'react';
import { MapPin, Users, TrendingUp, Globe, Layers, Target } from 'lucide-react';
import { GeoAIEngine } from '../utils/geoAI';
import { GeoCluster, RegionalTrend, UserGeoProfile } from '../types/geo';
import { User, Item, Rating } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

interface GeoAIPanelProps {
  users: User[];
  items: Item[];
  ratings: Rating[];
  selectedUserId: string;
}

export const GeoAIPanel: React.FC<GeoAIPanelProps> = ({ users, items, ratings, selectedUserId }) => {
  const [geoEngine] = useState(() => new GeoAIEngine(users, items, ratings));
  const [clusters, setClusters] = useState<GeoCluster[]>([]);
  const [regionalTrends, setRegionalTrends] = useState<RegionalTrend[]>([]);
  const [userGeoProfile, setUserGeoProfile] = useState<UserGeoProfile | null>(null);
  const [activeView, setActiveView] = useState<'clusters' | 'trends' | 'profile'>('clusters');

  useEffect(() => {
    const loadGeoData = async () => {
      const clustersData = geoEngine.clusterUsersByLocation();
      const trendsData = geoEngine.analyzeRegionalTrends();
      const profileData = geoEngine.getUserGeoProfile(selectedUserId);

      setClusters(clustersData);
      setRegionalTrends(trendsData);
      setUserGeoProfile(profileData || null);
    };

    loadGeoData();
  }, [geoEngine, selectedUserId]);

  const clusterData = clusters.map(cluster => ({
    name: cluster.id.replace('cluster_', 'Region '),
    users: cluster.userCount,
    spending: cluster.averageSpending,
    categories: cluster.dominantCategories.length
  }));

  const trendData = regionalTrends
    .filter(trend => trend.category === 'Electronics')
    .map(trend => ({
      region: trend.region,
      score: trend.trendScore,
      growth: trend.growthRate * 100
    }));

  const mobilityData = [
    { type: 'Local', count: users.filter(u => geoEngine.getUserGeoProfile(u.id)?.mobilityPattern === 'local').length },
    { type: 'Commuter', count: users.filter(u => geoEngine.getUserGeoProfile(u.id)?.mobilityPattern === 'commuter').length },
    { type: 'Traveler', count: users.filter(u => geoEngine.getUserGeoProfile(u.id)?.mobilityPattern === 'traveler').length },
    { type: 'Nomad', count: users.filter(u => geoEngine.getUserGeoProfile(u.id)?.mobilityPattern === 'nomad').length }
  ];

  const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b'];

  const views = [
    { id: 'clusters', label: 'Geo Clusters', icon: Layers },
    { id: 'trends', label: 'Regional Trends', icon: TrendingUp },
    { id: 'profile', label: 'User Profile', icon: Target }
  ] as const;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-gray-900 flex items-center">
            <Globe className="w-6 h-6 mr-2 text-blue-500" />
            GeoAI Analytics
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
              <p className="text-sm font-medium text-gray-600">Active Clusters</p>
              <p className="text-2xl font-bold text-blue-600">{clusters.length}</p>
            </div>
            <Layers className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-green-600">
                {clusters.reduce((sum, cluster) => sum + cluster.userCount, 0)}
              </p>
            </div>
            <Users className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Spending</p>
              <p className="text-2xl font-bold text-purple-600">
                ${Math.round(clusters.reduce((sum, cluster) => sum + cluster.averageSpending, 0) / clusters.length || 0)}
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-purple-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Regions</p>
              <p className="text-2xl font-bold text-orange-600">
                {new Set(regionalTrends.map(t => t.region)).size}
              </p>
            </div>
            <MapPin className="w-8 h-8 text-orange-500" />
          </div>
        </div>
      </div>

      {/* Content based on active view */}
      {activeView === 'clusters' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Cluster Analysis */}
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

          {/* Mobility Patterns */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Mobility Patterns</h4>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={mobilityData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {mobilityData.map((entry, index) => (
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
          {/* Regional Trends */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Electronics Trends by Region</h4>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="region" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip />
                  <Bar dataKey="score" fill="#3b82f6" name="Trend Score" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Growth Rates */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Growth Rates</h4>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="region" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip />
                  <Line type="monotone" dataKey="growth" stroke="#10b981" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {activeView === 'profile' && userGeoProfile && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* User Location Profile */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Location Profile</h4>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Country</span>
                <span className="text-sm text-gray-900">{userGeoProfile.country}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Region</span>
                <span className="text-sm text-gray-900">{userGeoProfile.region}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">City</span>
                <span className="text-sm text-gray-900">{userGeoProfile.city}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Mobility Pattern</span>
                <span className="text-sm text-gray-900 capitalize">{userGeoProfile.mobilityPattern}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Tracked Locations</span>
                <span className="text-sm text-gray-900">{userGeoProfile.locations.length}</span>
              </div>
            </div>
          </div>

          {/* Location Insights */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Location Insights</h4>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h5 className="font-medium text-blue-900 mb-2">Home Location</h5>
                <p className="text-sm text-blue-700">
                  Lat: {userGeoProfile.homeLocation?.latitude.toFixed(4)}, 
                  Lng: {userGeoProfile.homeLocation?.longitude.toFixed(4)}
                </p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <h5 className="font-medium text-green-900 mb-2">Work Location</h5>
                <p className="text-sm text-green-700">
                  Lat: {userGeoProfile.workLocation?.latitude.toFixed(4)}, 
                  Lng: {userGeoProfile.workLocation?.longitude.toFixed(4)}
                </p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                <h5 className="font-medium text-purple-900 mb-2">Frequent Areas</h5>
                <p className="text-sm text-purple-700">
                  {userGeoProfile.frequentAreas.length} identified clusters
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cluster Details Table */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h4 className="text-lg font-semibold text-gray-900">Cluster Details</h4>
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
                  Dominant Categories
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Avg Spending
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {clusters.map((cluster) => (
                <tr key={cluster.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {cluster.id.replace('cluster_', 'Region ')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {cluster.userCount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-wrap gap-1">
                      {cluster.dominantCategories.map((category, index) => (
                        <span
                          key={index}
                          className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800"
                        >
                          {category}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${cluster.averageSpending.toFixed(0)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {cluster.centroid.latitude.toFixed(3)}, {cluster.centroid.longitude.toFixed(3)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};