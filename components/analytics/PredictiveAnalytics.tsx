"use client";

import { useState, useEffect, useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
  Area,
  ComposedChart,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  Target, 
  AlertTriangle,
  Download,
  RefreshCw,
  BarChart3,
  LineChart as LineChartIcon,
} from "lucide-react";
import { formatCurrency, formatDate, formatNumber, formatPercentage } from "@/lib/utils";

interface ForecastData {
  date: string;
  actual: number;
  forecast: number;
  lowerBound: number;
  upperBound: number;
  confidence: number;
  anomaly?: boolean;
  anomalyScore?: number;
}

interface ModelMetrics {
  mae: number;
  mse: number;
  rmse: number;
  mape: number;
  r2: number;
}

interface PredictiveAnalyticsProps {
  data?: ForecastData[];
  title?: string;
  description?: string;
  forecastHorizon?: number;
}

// Simple forecasting functions
const simpleMovingAverage = (data: number[], window: number): number[] => {
  const result: number[] = [];
  for (let i = 0; i < data.length; i++) {
    if (i < window - 1) {
      result.push(data[i]);
    } else {
      const sum = data.slice(i - window + 1, i + 1).reduce((a, b) => a + b, 0);
      result.push(sum / window);
    }
  }
  return result;
};

const exponentialSmoothing = (data: number[], alpha: number): number[] => {
  const result: number[] = [data[0]];
  for (let i = 1; i < data.length; i++) {
    result.push(alpha * data[i] + (1 - alpha) * result[i - 1]);
  }
  return result;
};

const generateForecastData = (horizon: number = 30): ForecastData[] => {
  const data: ForecastData[] = [];
  const baseValue = 50000;
  const trend = 1.02; // 2% daily growth
  const seasonality = 0.1; // 10% seasonal variation
  const noise = 0.05; // 5% random noise
  
  // Generate historical data (past 90 days)
  for (let i = -90; i < horizon; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    
    // Calculate components
    const trendComponent = baseValue * Math.pow(trend, i);
    const seasonalComponent = Math.sin(i * 2 * Math.PI / 7) * seasonality; // Weekly seasonality
    const noiseComponent = (Math.random() * 2 - 1) * noise;
    
    const actual = i < 0 ? trendComponent * (1 + seasonalComponent + noiseComponent) : null;
    
    // Forecast with confidence intervals
    const forecast = trendComponent * (1 + seasonalComponent);
    const confidence = 0.8 + Math.random() * 0.2;
    const boundWidth = forecast * (1 - confidence) * 0.5;
    
    // Detect anomalies in historical data
    const anomaly = i < 0 && Math.random() < 0.05; // 5% anomaly rate
    const anomalyScore = anomaly ? 0.7 + Math.random() * 0.3 : 0;
    
    data.push({
      date: date.toISOString().split("T")[0],
      actual: actual ? Math.round(actual) : 0,
      forecast: Math.round(forecast),
      lowerBound: Math.round(forecast - boundWidth),
      upperBound: Math.round(forecast + boundWidth),
      confidence: parseFloat(confidence.toFixed(2)),
      anomaly: i < 0 ? anomaly : false,
      anomalyScore: anomaly ? parseFloat(anomalyScore.toFixed(2)) : 0,
    });
  }
  
  return data;
};

const calculateMetrics = (data: ForecastData[]): ModelMetrics => {
  const historical = data.filter(d => d.actual > 0);
  if (historical.length === 0) return { mae: 0, mse: 0, rmse: 0, mape: 0, r2: 0 };
  
  let sumAbsError = 0;
  let sumSquaredError = 0;
  let sumPercentageError = 0;
  let sumActual = 0;
  let sumForecast = 0;
  
  historical.forEach(d => {
    const error = Math.abs(d.actual - d.forecast);
    sumAbsError += error;
    sumSquaredError += error * error;
    sumPercentageError += error / d.actual;
    sumActual += d.actual;
    sumForecast += d.forecast;
  });
  
  const mae = sumAbsError / historical.length;
  const mse = sumSquaredError / historical.length;
  const rmse = Math.sqrt(mse);
  const mape = (sumPercentageError / historical.length) * 100;
  
  // Simple R² calculation
  const meanActual = sumActual / historical.length;
  let totalSumSquares = 0;
  let residualSumSquares = 0;
  
  historical.forEach(d => {
    totalSumSquares += Math.pow(d.actual - meanActual, 2);
    residualSumSquares += Math.pow(d.actual - d.forecast, 2);
  });
  
  const r2 = 1 - (residualSumSquares / totalSumSquares);
  
  return {
    mae: parseFloat(mae.toFixed(2)),
    mse: parseFloat(mse.toFixed(2)),
    rmse: parseFloat(rmse.toFixed(2)),
    mape: parseFloat(mape.toFixed(2)),
    r2: parseFloat(r2.toFixed(3)),
  };
};

export default function PredictiveAnalytics({ 
  data,
  title = "Predictive Analytics & Forecasting",
  description = "Time series forecasting with anomaly detection",
  forecastHorizon = 30
}: PredictiveAnalyticsProps) {
  const [forecastData, setForecastData] = useState<ForecastData[]>(data || generateForecastData(forecastHorizon));
  const [activeModel, setActiveModel] = useState<string>("exponential");
  const [forecastDays, setForecastDays] = useState<number>(forecastHorizon);
  const [confidenceLevel, setConfidenceLevel] = useState<number>(0.8);
  const [showBounds, setShowBounds] = useState<boolean>(true);
  const [showAnomalies, setShowAnomalies] = useState<boolean>(true);
  const [isTraining, setIsTraining] = useState<boolean>(false);
  
  const historicalData = forecastData.filter(d => d.actual > 0);
  const forecastDataOnly = forecastData.filter(d => d.actual === 0);
  const metrics = useMemo(() => calculateMetrics(forecastData), [forecastData]);
  
  const anomalies = historicalData.filter(d => d.anomaly);
  const latestForecast = forecastDataOnly[0];
  
  const handleTrainModel = () => {
    setIsTraining(true);
    // Simulate training delay
    setTimeout(() => {
      setForecastData(generateForecastData(forecastDays));
      setIsTraining(false);
    }, 1500);
  };
  
  const handleExportForecast = () => {
    const headers = ["Date", "Actual", "Forecast", "Lower Bound", "Upper Bound", "Confidence", "Anomaly", "Anomaly Score"];
    const csvContent = [
      headers.join(","),
      ...forecastData.map(item => [
        item.date,
        item.actual || '',
        item.forecast,
        item.lowerBound,
        item.upperBound,
        item.confidence,
        item.anomaly ? 'Yes' : 'No',
        item.anomalyScore || ''
      ].join(","))
    ].join("\n");
    
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `forecast-data-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };
  
  const renderForecastChart = () => {
    const chartData = [...historicalData, ...forecastDataOnly];
    
    return (
      <ResponsiveContainer width="100%" height={500}>
        <ComposedChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="date" 
            tickFormatter={(value) => {
              const date = new Date(value);
              return `${date.getMonth() + 1}/${date.getDate()}`;
            }}
          />
          <YAxis tickFormatter={(value) => formatCurrency(value)} />
          <Tooltip 
            formatter={(value, name) => {
              if (typeof value === 'number') {
                return [formatCurrency(value), name];
              }
              return [value, name];
            }}
            labelFormatter={(label) => `Date: ${label}`}
          />
          <Legend />
          
          {/* Confidence interval area */}
          {showBounds && (
            <Area
              type="monotone"
              dataKey="upperBound"
              stroke="none"
              fill="#8884d8"
              fillOpacity={0.1}
              name="Confidence Interval"
            />
          )}
          
          {/* Actual values line */}
          <Line
            type="monotone"
            dataKey="actual"
            stroke="#8884d8"
            strokeWidth={2}
            dot={{ r: 3 }}
            activeDot={{ r: 6 }}
            name="Actual"
            connectNulls
          />
          
          {/* Forecast line */}
          <Line
            type="monotone"
            dataKey="forecast"
            stroke="#82ca9d"
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={{ r: 3 }}
            name="Forecast"
          />
          
          {/* Anomaly points */}
          {showAnomalies && anomalies.length > 0 && (
            <Line
              type="monotone"
              dataKey="actual"
              stroke="#ff6b6b"
              strokeWidth={0}
              dot={(props) => {
                const point = chartData[props.index];
                if (point?.anomaly) {
                  return (
                    <circle
                      cx={props.cx}
                      cy={props.cy}
                      r={6}
                      fill="#ff6b6b"
                      stroke="#fff"
                      strokeWidth={2}
                    />
                  );
                }
                return null;
              }}
              name="Anomalies"
              legendType="circle"
            />
          )}
          
          {/* Reference line separating history from forecast */}
          <ReferenceLine
            x={historicalData[historicalData.length - 1]?.date}
            stroke="#666"
            strokeDasharray="3 3"
            label={{ value: 'Now', position: 'insideTopRight' }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    );
  };
  
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleTrainModel}
              disabled={isTraining}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isTraining ? 'animate-spin' : ''}`} />
              {isTraining ? 'Training...' : 'Retrain Model'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportForecast}
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-6">
          <Tabs defaultValue="forecast">
            <TabsList className="grid grid-cols-3 w-full max-w-xl">
              <TabsTrigger value="forecast" className="flex items-center gap-2">
                <LineChartIcon className="h-4 w-4" />
                Forecast
              </TabsTrigger>
              <TabsTrigger value="metrics" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Model Metrics
              </TabsTrigger>
              <TabsTrigger value="anomalies" className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                Anomalies
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="forecast" className="space-y-6">
              {/* Controls */}
              <div className="flex flex-wrap items-center gap-4 p-4 bg-muted rounded-lg">
                <div className="flex items-center gap-2">
                  <Label htmlFor="model">Model:</Label>
                  <Select value={activeModel} onValueChange={(value) => setActiveModel(value || "")}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select model" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="exponential">Exponential Smoothing</SelectItem>
                      <SelectItem value="moving-average">Moving Average</SelectItem>
                      <SelectItem value="arima">ARIMA</SelectItem>
                      <SelectItem value="prophet">Prophet</SelectItem>
                      <SelectItem value="lstm">LSTM Neural Network</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center gap-2">
                  <Label htmlFor="horizon">Horizon: {forecastDays} days</Label>
                  <Slider
                    id="horizon"
                    min={7}
                    max={90}
                    step={1}
                    value={[forecastDays]}
                    onValueChange={(values) => {
                      if (Array.isArray(values) && values.length > 0) {
                        setForecastDays(values[0]);
                      }
                    }}
                    className="w-[200px]"
                  />
                </div>
                
                <div className="flex items-center gap-2">
                  <Label htmlFor="confidence">Confidence: {formatPercentage(confidenceLevel)}</Label>
                  <Slider
                    id="confidence"
                    min={0.5}
                    max={0.95}
                    step={0.05}
                    value={[confidenceLevel]}
                    onValueChange={(values) => {
                      if (Array.isArray(values) && values.length > 0) {
                        setConfidenceLevel(values[0]);
                      }
                    }}
                    className="w-[200px]"
                  />
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Switch
                      id="bounds"
                      checked={showBounds}
                      onCheckedChange={setShowBounds}
                    />
                    <Label htmlFor="bounds">Confidence Bounds</Label>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Switch
                      id="anomalies"
                      checked={showAnomalies}
                      onCheckedChange={setShowAnomalies}
                    />
                    <Label htmlFor="anomalies">Show Anomalies</Label>
                  </div>
                </div>
              </div>
              
              {/* Chart */}
              {renderForecastChart()}
              
              {/* Forecast Summary */}
              {latestForecast && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Next Forecast</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Date:</span>
                          <span className="font-medium">{latestForecast.date}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Forecast:</span>
                          <span className="text-2xl font-bold">{formatCurrency(latestForecast.forecast)}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Confidence:</span>
                          <Badge variant={latestForecast.confidence > 0.8 ? "default" : "secondary"}>
                            {formatPercentage(latestForecast.confidence)}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Trend Analysis</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Expected Growth:</span>
                          <span className="font-medium text-green-500 flex items-center">
                            <TrendingUp className="h-4 w-4 mr-1" />
                            +2.3% daily
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Seasonality:</span>
                          <span className="font-medium">Weekly pattern detected</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Volatility:</span>
                          <Badge variant="outline">Low</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Risk Assessment</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Downside Risk:</span>
                          <span className="font-medium">{formatCurrency(latestForecast.lowerBound)}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Upside Potential:</span>
                          <span className="font-medium">{formatCurrency(latestForecast.upperBound)}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Range:</span>
                          <span className="font-medium">
                            {formatCurrency(latestForecast.upperBound - latestForecast.lowerBound)}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="metrics" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">MAE</CardTitle>
                    <CardDescription>Mean Absolute Error</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{formatCurrency(metrics.mae)}</div>
                    <div className="text-sm text-muted-foreground">
                      {metrics.mae < 1000 ? 'Excellent' : metrics.mae < 5000 ? 'Good' : 'Needs improvement'}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">RMSE</CardTitle>
                    <CardDescription>Root Mean Square Error</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{formatCurrency(metrics.rmse)}</div>
                    <div className="text-sm text-muted-foreground">
                      {metrics.rmse < 1500 ? 'Excellent' : metrics.rmse < 7500 ? 'Good' : 'Needs improvement'}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">MAPE</CardTitle>
                    <CardDescription>Mean Absolute Percentage Error</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{metrics.mape.toFixed(2)}%</div>
                    <div className="text-sm text-muted-foreground">
                      {metrics.mape < 5 ? 'Excellent' : metrics.mape < 15 ? 'Good' : 'Needs improvement'}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">R² Score</CardTitle>
                    <CardDescription>Goodness of Fit</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{metrics.r2.toFixed(3)}</div>
                    <div className="text-sm text-muted-foreground">
                      {metrics.r2 > 0.9 ? 'Excellent' : metrics.r2 > 0.7 ? 'Good' : 'Needs improvement'}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Training Time</CardTitle>
                    <CardDescription>Model performance</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">1.2s</div>
                    <div className="text-sm text-muted-foreground">
                      Fast training, suitable for real-time
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>Model Comparison</CardTitle>
                  <CardDescription>Performance across different algorithms</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-6 gap-4 text-sm font-medium">
                      <div>Model</div>
                      <div className="text-right">MAE</div>
                      <div className="text-right">RMSE</div>
                      <div className="text-right">MAPE</div>
                      <div className="text-right">R²</div>
                      <div className="text-right">Speed</div>
                    </div>
                    
                    {[
                      { name: 'Exponential Smoothing', mae: 1250, rmse: 1850, mape: 4.2, r2: 0.92, speed: 'Fast' },
                      { name: 'Moving Average', mae: 2100, rmse: 2850, mape: 8.5, r2: 0.78, speed: 'Very Fast' },
                      { name: 'ARIMA', mae: 980, rmse: 1450, mape: 3.8, r2: 0.95, speed: 'Medium' },
                      { name: 'Prophet', mae: 850, rmse: 1200, mape: 3.2, r2: 0.96, speed: 'Slow' },
                      { name: 'LSTM', mae: 720, rmse: 950, mape: 2.8, r2: 0.98, speed: 'Very Slow' },
                    ].map((model, index) => (
                      <div key={index} className="grid grid-cols-6 gap-4 items-center p-2 rounded hover:bg-muted">
                        <div className="font-medium">{model.name}</div>
                        <div className="text-right">{formatCurrency(model.mae)}</div>
                        <div className="text-right">{formatCurrency(model.rmse)}</div>
                        <div className="text-right">{model.mape.toFixed(1)}%</div>
                        <div className="text-right">{model.r2.toFixed(2)}</div>
                        <div className="text-right">
                          <Badge variant={model.speed === 'Fast' || model.speed === 'Very Fast' ? 'default' : 'secondary'}>
                            {model.speed}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="anomalies" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Detected Anomalies</CardTitle>
                  <CardDescription>{anomalies.length} anomalies found in historical data</CardDescription>
                </CardHeader>
                <CardContent>
                  {anomalies.length > 0 ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-5 gap-4 text-sm font-medium">
                        <div>Date</div>
                        <div className="text-right">Actual Value</div>
                        <div className="text-right">Expected Value</div>
                        <div className="text-right">Deviation</div>
                        <div className="text-right">Anomaly Score</div>
                      </div>
                      
                      {anomalies.slice(0, 10).map((anomaly, index) => {
                        const deviation = ((anomaly.actual - anomaly.forecast) / anomaly.forecast) * 100;
                        return (
                          <div key={index} className="grid grid-cols-5 gap-4 items-center p-3 rounded-lg border">
                            <div className="font-medium">{anomaly.date}</div>
                            <div className="text-right font-bold">{formatCurrency(anomaly.actual)}</div>
                            <div className="text-right">{formatCurrency(anomaly.forecast)}</div>
                            <div className={`text-right font-bold ${deviation > 0 ? 'text-green-500' : 'text-red-500'}`}>
                              {deviation > 0 ? '+' : ''}{deviation.toFixed(1)}%
                            </div>
                            <div className="text-right">
                              <Badge variant={anomaly.anomalyScore! > 0.8 ? 'destructive' : 'secondary'}>
                                {(anomaly.anomalyScore! * 100).toFixed(0)}%
                              </Badge>
                            </div>
                          </div>
                        );
                      })}
                      
                      {anomalies.length > 10 && (
                        <div className="text-center text-muted-foreground">
                          ... and {anomalies.length - 10} more anomalies
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No anomalies detected in the historical data</p>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Anomaly Frequency</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{anomalies.length}</div>
                    <div className="text-sm text-muted-foreground">
                      {((anomalies.length / historicalData.length) * 100).toFixed(1)}% of data points
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Average Deviation</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {anomalies.length > 0 
                        ? `${(anomalies.reduce((sum, a) => {
                            const deviation = Math.abs((a.actual - a.forecast) / a.forecast * 100);
                            return sum + deviation;
                          }, 0) / anomalies.length).toFixed(1)}%`
                        : '0%'
                      }
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Average difference from expected
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Detection Confidence</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {anomalies.length > 0
                        ? `${(anomalies.reduce((sum, a) => sum + (a.anomalyScore || 0), 0) / anomalies.length * 100).toFixed(0)}%`
                        : '0%'
                      }
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Average confidence score
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </CardContent>
    </Card>
  );
}
