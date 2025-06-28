import React, { useState } from 'react';
import { Upload, FileText, TrendingUp } from 'lucide-react';

interface DataUploaderProps {
  onDataLoaded: (data: number[]) => void;
}

export const DataUploader: React.FC<DataUploaderProps> = ({ onDataLoaded }) => {
  const [isDragging, setIsDragging] = useState(false);

  const generateSampleData = () => {
    // Generate sample demand data with trend and seasonality
    const data: number[] = [];
    const baseValue = 100;
    
    for (let i = 0; i < 50; i++) {
      const trend = i * 0.5;
      const seasonal = 10 * Math.sin((i * 2 * Math.PI) / 12);
      const noise = (Math.random() - 0.5) * 10;
      const value = Math.max(0, baseValue + trend + seasonal + noise);
      data.push(Math.round(value));
    }
    
    onDataLoaded(data);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const text = e.target?.result as string;
          const lines = text.split('\n').filter(line => line.trim());
          const data = lines.map(line => {
            const value = parseFloat(line.trim());
            return isNaN(value) ? 0 : value;
          }).filter(value => value > 0);
          
          if (data.length > 0) {
            onDataLoaded(data);
          }
        } catch (error) {
          console.error('Error parsing file:', error);
        }
      };
      reader.readAsText(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const text = event.target?.result as string;
          const lines = text.split('\n').filter(line => line.trim());
          const data = lines.map(line => {
            const value = parseFloat(line.trim());
            return isNaN(value) ? 0 : value;
          }).filter(value => value > 0);
          
          if (data.length > 0) {
            onDataLoaded(data);
          }
        } catch (error) {
          console.error('Error parsing file:', error);
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
      <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
        <Upload className="w-6 h-6 mr-2 text-blue-500" />
        Data Input
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* File Upload */}
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            isDragging
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <FileText className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <h4 className="text-lg font-semibold text-gray-900 mb-2">Upload Data File</h4>
          <p className="text-gray-600 mb-4">
            Drag and drop a CSV file or click to browse
          </p>
          <input
            type="file"
            accept=".csv,.txt"
            onChange={handleFileUpload}
            className="hidden"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 cursor-pointer transition-colors"
          >
            <Upload className="w-4 h-4 mr-2" />
            Choose File
          </label>
        </div>

        {/* Sample Data */}
        <div className="border-2 border-gray-200 rounded-lg p-6 text-center">
          <TrendingUp className="w-12 h-12 mx-auto mb-4 text-green-500" />
          <h4 className="text-lg font-semibold text-gray-900 mb-2">Use Sample Data</h4>
          <p className="text-gray-600 mb-4">
            Generate sample demand data with trends and seasonality
          </p>
          <button
            onClick={generateSampleData}
            className="inline-flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            <TrendingUp className="w-4 h-4 mr-2" />
            Generate Sample
          </button>
        </div>
      </div>
    </div>
  );
};