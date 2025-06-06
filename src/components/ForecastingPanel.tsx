import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ARIMAForecaster } from '../utils/arimaForecasting';
import { ForecastData, ARIMAParams } from '../types';
import { TrendingUp, Settings, Play, BarChart3 } from 'lucide-react';

interface ForecastingPanelProps {
  data: number[];
}

export const ForecastingPanel: React.FC<ForecastingPanelProps> = ({ data }) => {
  const [forecastData, setForecastData] = useState<ForecastData[]>([]);
  const [params, setParams] = useState<ARIMAParams>({ p: 1, d: 1, q: 1 });
  const [forecastSteps, setForecastSteps] = useState(10);
  const [accuracy, setAccuracy] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);

  const runForecast = async () => {
    setIsLoading(true);
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const forecaster = new ARIMAForecaster(data, params);
    const forecast = forecaster.forecast(forecastSteps);
    
    // Calculate accuracy using last 20% of data as test set
    const testSize = Math.floor(data.length * 0.2);
    const trainData = data.slice(0, -testSize);
    const testData = data.slice(-testSize);
    
    if (testData.length > 0) {
      const testForecaster = new ARIMAForecaster(trainData, params);
      const testAccuracy = testForecaster.calculateAccuracy(testData);
      setAccuracy(testAccuracy);
    }
    
    setForecastData(forecast);
    setIsLoading(false);
  };

  useEffect(() => {
    if (data.length > 0) {
      runForecast();
    }
  }, [data]);

  const chartData = forecastData.map((point, index) => ({
    index,
    timestamp: new Date(point.timestamp).toLocaleDateString(),
    actual: point.predicted ? null : point.value,
    predicted: point.predicted ? point.value : null,
    value: point.value
  }));

  return (
    <div className="bg-gray-50 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900 flex items-center">
          <TrendingUp className="w-6 h-6 mr-2 text-blue-500" />
          ARIMA Forecasting
        </h3>
        <div className="flex items-center space-x-2">
          <div className="text-sm text-gray-600">
            Accuracy: <span className="font-semibold text-green-600">
              {(accuracy * 100).toFixed(1)}%
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
              <Settings className="w-4 h-4 mr-2" />
              ARIMA Parameters
            </h4>
            
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  AR Order (p)
                </label>
                <input
                  type="number"
                  min="0"
                  max="5"
                  value={params.p}
                  onChange={(e) => setParams({ ...params, p: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Differencing (d)
                </label>
                <input
                  type="number"
                  min="0"
                  max="3"
                  value={params.d}
                  onChange={(e) => setParams({ ...params, d: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  MA Order (q)
                </label>
                <input
                  type="number"
                  min="0"
                  max="5"
                  value={params.q}
                  onChange={(e) => setParams({ ...params, q: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Forecast Steps
                </label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={forecastSteps}
                  onChange={(e) => setForecastSteps(parseInt(e.target.value) || 1)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <button
              onClick={runForecast}
              disabled={isLoading}
              className="w-full mt-4 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Run Forecast
                </>
              )}
            </button>
          </div>

          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
              <BarChart3 className="w-4 h-4 mr-2" />
              Statistics
            </h4>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Data Points:</span>
                <span className="font-medium">{data.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Mean:</span>
                <span className="font-medium">
                  {(data.reduce((a, b) => a + b, 0) / data.length).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Std Dev:</span>
                <span className="font-medium">
                  {Math.sqrt(
                    data.reduce((acc, val) => {
                      const mean = data.reduce((a, b) => a + b, 0) / data.length;
                      return acc + Math.pow(val - mean, 2);
                    }, 0) / data.length
                  ).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Predictions:</span>
                <span className="font-medium text-blue-600">{forecastSteps}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg p-4 border border-gray-200 h-96">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="index" 
                  stroke="#666"
                  fontSize={12}
                />
                <YAxis stroke="#666" fontSize={12} />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="actual"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ fill: '#3b82f6', strokeWidth: 2, r: 3 }}
                  name="Actual Data"
                  connectNulls={false}
                />
                <Line
                  type="monotone"
                  dataKey="predicted"
                  stroke="#ef4444"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={{ fill: '#ef4444', strokeWidth: 2, r: 3 }}
                  name="Predicted Data"
                  connectNulls={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};