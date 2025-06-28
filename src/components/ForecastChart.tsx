import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ForecastData } from '../types';

interface ForecastChartProps {
  data: ForecastData[];
  title?: string;
}

export const ForecastChart: React.FC<ForecastChartProps> = ({ data, title = "Forecast Chart" }) => {
  const chartData = data.map((point, index) => ({
    index,
    timestamp: new Date(point.timestamp).toLocaleDateString(),
    actual: point.predicted ? null : point.value,
    predicted: point.predicted ? point.value : null,
    value: point.value
  }));

  return (
    <div className="bg-white rounded-lg p-6 shadow-lg border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="h-80">
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
  );
};