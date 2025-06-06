import React, { useState } from 'react';
import { Upload, FileText, X, Check } from 'lucide-react';

interface DataUploaderProps {
  onDataUpload: (data: number[]) => void;
  currentData: number[];
}

export const DataUploader: React.FC<DataUploaderProps> = ({ onDataUpload, currentData }) => {
  const [inputText, setInputText] = useState('');
  const [dragActive, setDragActive] = useState(false);

  const parseData = (text: string): number[] => {
    const lines = text.split('\n').filter(line => line.trim());
    const numbers: number[] = [];
    
    for (const line of lines) {
      const values = line.split(/[,\s\t]+/).filter(val => val.trim());
      for (const val of values) {
        const num = parseFloat(val.trim());
        if (!isNaN(num)) {
          numbers.push(num);
        }
      }
    }
    
    return numbers;
  };

  const handleTextSubmit = () => {
    if (inputText.trim()) {
      const data = parseData(inputText);
      if (data.length > 0) {
        onDataUpload(data);
        setInputText('');
      }
    }
  };

  const handleFileUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const data = parseData(text);
      if (data.length > 0) {
        onDataUpload(data);
      }
    };
    reader.readAsText(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const generateSampleData = () => {
    const sampleData = Array.from({ length: 30 }, (_, i) => {
      const trend = i * 2;
      const seasonal = Math.sin(i * 0.5) * 10;
      const noise = (Math.random() - 0.5) * 5;
      return Math.max(0, 50 + trend + seasonal + noise);
    });
    onDataUpload(sampleData);
  };

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <Upload className="w-5 h-5 mr-2 text-blue-500" />
        Data Input
      </h3>

      <div className="space-y-4">
        {/* File Upload Area */}
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            dragActive
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <FileText className="w-8 h-8 mx-auto mb-2 text-gray-400" />
          <p className="text-sm text-gray-600 mb-2">
            Drag and drop a CSV/TXT file here, or click to select
          </p>
          <input
            type="file"
            accept=".csv,.txt"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleFileUpload(e.target.files[0]);
              }
            }}
            className="hidden"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className="inline-block bg-blue-500 text-white px-4 py-2 rounded-md text-sm cursor-pointer hover:bg-blue-600 transition-colors"
          >
            Choose File
          </label>
        </div>

        {/* Text Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Or paste your data (comma or space separated):
          </label>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Enter numbers separated by commas, spaces, or new lines..."
            className="w-full h-24 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
          <button
            onClick={handleTextSubmit}
            disabled={!inputText.trim()}
            className="mt-2 bg-green-500 text-white px-4 py-2 rounded-md text-sm hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Check className="w-4 h-4 inline mr-1" />
            Submit Data
          </button>
        </div>

        {/* Sample Data Button */}
        <div className="border-t pt-4">
          <button
            onClick={generateSampleData}
            className="w-full bg-purple-500 text-white py-2 px-4 rounded-md hover:bg-purple-600 transition-colors"
          >
            Generate Sample Data
          </button>
        </div>

        {/* Current Data Info */}
        {currentData.length > 0 && (
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-sm text-gray-600">
              <strong>Current dataset:</strong> {currentData.length} data points
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Range: {Math.min(...currentData).toFixed(2)} - {Math.max(...currentData).toFixed(2)}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};