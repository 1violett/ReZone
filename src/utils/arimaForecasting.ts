import { regression } from 'simple-statistics';
import { ForecastData, ARIMAParams } from '../types';

export class ARIMAForecaster {
  private data: number[];
  private params: ARIMAParams;

  constructor(data: number[], params: ARIMAParams = { p: 1, d: 1, q: 1 }) {
    this.data = [...data];
    this.params = params;
  }

  private difference(series: number[], order: number): number[] {
    let result = [...series];
    for (let i = 0; i < order; i++) {
      const newResult: number[] = [];
      for (let j = 1; j < result.length; j++) {
        newResult.push(result[j] - result[j - 1]);
      }
      result = newResult;
    }
    return result;
  }

  private autoregression(series: number[], order: number): number[] {
    if (series.length <= order) return [];
    
    const predictions: number[] = [];
    
    for (let i = order; i < series.length; i++) {
      let prediction = 0;
      for (let j = 1; j <= order; j++) {
        prediction += series[i - j] * (0.5 / j); // Simple AR coefficients
      }
      predictions.push(prediction);
    }
    
    return predictions;
  }

  private movingAverage(series: number[], order: number): number[] {
    if (series.length <= order) return [];
    
    const predictions: number[] = [];
    
    for (let i = order; i < series.length; i++) {
      let sum = 0;
      for (let j = 1; j <= order; j++) {
        sum += series[i - j];
      }
      predictions.push(sum / order);
    }
    
    return predictions;
  }

  public forecast(steps: number): ForecastData[] {
    // Simplified ARIMA implementation
    const { p, d, q } = this.params;
    
    // Apply differencing
    let processedData = this.difference(this.data, d);
    
    // Generate AR component
    const arPredictions = this.autoregression(processedData, p);
    
    // Generate MA component
    const maPredictions = this.movingAverage(processedData, q);
    
    // Combine AR and MA components
    const combinedLength = Math.min(arPredictions.length, maPredictions.length);
    const combined: number[] = [];
    
    for (let i = 0; i < combinedLength; i++) {
      combined.push((arPredictions[i] + maPredictions[i]) / 2);
    }
    
    // Generate future predictions
    const predictions: number[] = [];
    const lastValue = this.data[this.data.length - 1];
    
    for (let i = 0; i < steps; i++) {
      // Simple trend-based prediction with some randomness
      const trend = combined.length > 0 ? combined[combined.length - 1] : 0;
      const prediction = lastValue + trend * (i + 1) + (Math.random() - 0.5) * 2;
      predictions.push(prediction);
    }
    
    // Convert to ForecastData format
    const baseTimestamp = Date.now();
    const result: ForecastData[] = [];
    
    // Add historical data
    this.data.forEach((value, index) => {
      result.push({
        timestamp: baseTimestamp - (this.data.length - index) * 24 * 60 * 60 * 1000,
        value,
        predicted: false
      });
    });
    
    // Add predictions
    predictions.forEach((value, index) => {
      result.push({
        timestamp: baseTimestamp + (index + 1) * 24 * 60 * 60 * 1000,
        value,
        predicted: true
      });
    });
    
    return result;
  }

  public calculateAccuracy(testData: number[]): number {
    const predictions = this.forecast(testData.length);
    const predictedValues = predictions
      .filter(p => p.predicted)
      .map(p => p.value)
      .slice(0, testData.length);
    
    if (predictedValues.length === 0) return 0;
    
    let totalError = 0;
    for (let i = 0; i < Math.min(predictedValues.length, testData.length); i++) {
      totalError += Math.abs(predictedValues[i] - testData[i]);
    }
    
    const meanActual = testData.reduce((sum, val) => sum + val, 0) / testData.length;
    const mape = (totalError / testData.length) / meanActual;
    
    return Math.max(0, 1 - mape);
  }
}