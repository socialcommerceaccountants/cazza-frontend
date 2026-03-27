"use client";

import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calculator, TrendingUp, TrendingDown, Target, Users } from "lucide-react";
import { formatCurrency, formatNumber } from "@/lib/utils";

interface CACData {
  channel: string;
  spend: number;
  customers: number;
  cac: number;
  ltv: number;
  roi: number;
}

interface CACCalculatorProps {
  initialData?: CACData[];
}

const generateMockData = (): CACData[] => [
  {
    channel: "Google Ads",
    spend: 12500,
    customers: 250,
    cac: 50,
    ltv: 300,
    roi: 500,
  },
  {
    channel: "Facebook",
    spend: 8500,
    customers: 200,
    cac: 42.5,
    ltv: 280,
    roi: 559,
  },
  {
    channel: "LinkedIn",
    spend: 6000,
    customers: 75,
    cac: 80,
    ltv: 450,
    roi: 463,
  },
  {
    channel: "Email",
    spend: 2000,
    customers: 150,
    cac: 13.33,
    ltv: 200,
    roi: 1400,
  },
  {
    channel: "Organic",
    spend: 1000,
    customers: 100,
    cac: 10,
    ltv: 180,
    roi: 1700,
  },
];

export default function CACCalculator({ initialData }: CACCalculatorProps) {
  const [data, setData] = useState<CACData[]>(initialData || generateMockData());
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<CACData>>({});
  const [totalSpend, setTotalSpend] = useState(30000);
  const [totalCustomers, setTotalCustomers] = useState(775);
  const [targetCAC, setTargetCAC] = useState(40);

  useEffect(() => {
    recalculateMetrics();
  }, [data]);

  const recalculateMetrics = () => {
    const newTotalSpend = data.reduce((sum, item) => sum + item.spend, 0);
    const newTotalCustomers = data.reduce((sum, item) => sum + item.customers, 0);
    setTotalSpend(newTotalSpend);
    setTotalCustomers(newTotalCustomers);
  };

  const handleEdit = (index: number) => {
    setEditingIndex(index);
    setFormData(data[index]);
  };

  const handleSave = () => {
    if (editingIndex !== null) {
      const newData = [...data];
      const updatedItem = {
        ...newData[editingIndex],
        ...formData,
        cac: formData.spend && formData.customers ? formData.spend / formData.customers : newData[editingIndex].cac,
        roi: formData.cac && formData.ltv ? ((formData.ltv - formData.cac) / formData.cac) * 100 : newData[editingIndex].roi,
      };
      newData[editingIndex] = updatedItem;
      setData(newData);
      setEditingIndex(null);
      setFormData({});
    }
  };

  const handleAddChannel = () => {
    const newChannel: CACData = {
      channel: `Channel ${data.length + 1}`,
      spend: 0,
      customers: 0,
      cac: 0,
      ltv: 0,
      roi: 0,
    };
    setData([...data, newChannel]);
    setEditingIndex(data.length);
    setFormData(newChannel);
  };

  const handleDeleteChannel = (index: number) => {
    const newData = data.filter((_, i) => i !== index);
    setData(newData);
    if (editingIndex === index) {
      setEditingIndex(null);
      setFormData({});
    }
  };

  const overallCAC = totalCustomers > 0 ? totalSpend / totalCustomers : 0;
  const avgLTV = data.length > 0 ? data.reduce((sum, item) => sum + item.ltv, 0) / data.length : 0;
  const avgROI = data.length > 0 ? data.reduce((sum, item) => sum + item.roi, 0) / data.length : 0;
  const cacHealth = overallCAC <= targetCAC ? "healthy" : "needs_attention";

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const item = data.find(d => d.channel === label);
      return (
        <div className="bg-background border rounded-lg shadow-lg p-4">
          <p className="font-medium text-foreground">{label}</p>
          <p className="text-sm">Spend: {formatCurrency(item?.spend || 0)}</p>
          <p className="text-sm">Customers: {item?.customers}</p>
          <p className="text-sm">CAC: {formatCurrency(item?.cac || 0)}</p>
          <p className="text-sm">LTV: {formatCurrency(item?.ltv || 0)}</p>
          <p className="text-sm">ROI: {item?.roi?.toFixed(1)}%</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              CAC Calculator
            </CardTitle>
            <CardDescription>
              Calculate Customer Acquisition Cost across marketing channels
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleAddChannel}>
              Add Channel
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-muted rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Overall CAC</p>
                <p className={`text-2xl font-bold ${overallCAC <= targetCAC ? "text-green-500" : "text-red-500"}`}>
                  {formatCurrency(overallCAC)}
                </p>
              </div>
              <Target className="h-5 w-5" />
            </div>
            <div className="mt-2">
              <div className="flex items-center justify-between text-xs">
                <span>Target: {formatCurrency(targetCAC)}</span>
                <span className={cacHealth === "healthy" ? "text-green-500" : "text-red-500"}>
                  {cacHealth === "healthy" ? "✓ Healthy" : "⚠ Needs Attention"}
                </span>
              </div>
              <Slider
                value={[targetCAC]}
                onValueChange={(values) => {
                  if (Array.isArray(values) && values.length > 0) {
                    setTargetCAC(values[0]);
                  }
                }}
                min={10}
                max={100}
                step={5}
                className="mt-2"
              />
            </div>
          </div>
          <div className="bg-muted rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Spend</p>
                <p className="text-2xl font-bold">{formatCurrency(totalSpend)}</p>
              </div>
              <TrendingDown className="h-5 w-5 text-blue-500" />
            </div>
          </div>
          <div className="bg-muted rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Customers</p>
                <p className="text-2xl font-bold">{formatNumber(totalCustomers)}</p>
              </div>
              <Users className="h-5 w-5 text-green-500" />
            </div>
          </div>
          <div className="bg-muted rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg. ROI</p>
                <p className="text-2xl font-bold text-green-500">{avgROI.toFixed(1)}%</p>
              </div>
              <TrendingUp className="h-5 w-5 text-green-500" />
            </div>
          </div>
        </div>

        <Tabs defaultValue="chart" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="chart">Visualization</TabsTrigger>
            <TabsTrigger value="table">Data Table</TabsTrigger>
          </TabsList>
          <TabsContent value="chart" className="mt-4">
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted-foreground))" />
                  <XAxis 
                    dataKey="channel" 
                    stroke="hsl(var(--foreground))"
                  />
                  <YAxis 
                    stroke="hsl(var(--foreground))"
                    tickFormatter={(value) => formatCurrency(value, true)}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar dataKey="cac" fill="hsl(var(--chart-1))" name="CAC">
                    {data.map((entry, index) => (
                      <Cell 
                        key={`cac-${index}`} 
                        fill={entry.cac <= targetCAC ? "hsl(var(--chart-1))" : "hsl(var(--destructive))"}
                      />
                    ))}
                  </Bar>
                  <Bar dataKey="ltv" fill="hsl(var(--chart-2))" name="LTV">
                    {data.map((entry, index) => (
                      <Cell key={`ltv-${index}`} fill="hsl(var(--chart-2))" />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
          <TabsContent value="table" className="mt-4">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Channel</th>
                    <th className="text-left py-3 px-4">Spend</th>
                    <th className="text-left py-3 px-4">Customers</th>
                    <th className="text-left py-3 px-4">CAC</th>
                    <th className="text-left py-3 px-4">LTV</th>
                    <th className="text-left py-3 px-4">ROI</th>
                    <th className="text-left py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((item, index) => (
                    <tr key={index} className="border-b hover:bg-muted/50">
                      {editingIndex === index ? (
                        <>
                          <td className="py-3 px-4">
                            <Input
                              value={formData.channel || ""}
                              onChange={(e) => setFormData({ ...formData, channel: e.target.value })}
                              className="w-full"
                            />
                          </td>
                          <td className="py-3 px-4">
                            <Input
                              type="number"
                              value={formData.spend || ""}
                              onChange={(e) => setFormData({ ...formData, spend: parseFloat(e.target.value) })}
                              className="w-full"
                            />
                          </td>
                          <td className="py-3 px-4">
                            <Input
                              type="number"
                              value={formData.customers || ""}
                              onChange={(e) => setFormData({ ...formData, customers: parseInt(e.target.value) })}
                              className="w-full"
                            />
                          </td>
                          <td className="py-3 px-4">
                            <Input
                              type="number"
                              value={formData.cac || ""}
                              onChange={(e) => setFormData({ ...formData, cac: parseFloat(e.target.value) })}
                              className="w-full"
                            />
                          </td>
                          <td className="py-3 px-4">
                            <Input
                              type="number"
                              value={formData.ltv || ""}
                              onChange={(e) => setFormData({ ...formData, ltv: parseFloat(e.target.value) })}
                              className="w-full"
                            />
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <Button size="sm" onClick={handleSave}>Save</Button>
                              <Button size="sm" variant="outline" onClick={() => setEditingIndex(null)}>
                                Cancel
                              </Button>
                            </div>
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="py-3 px-4 font-medium">{item.channel}</td>
                          <td className="py-3 px-4">{formatCurrency(item.spend)}</td>
                          <td className="py-3 px-4">{formatNumber(item.customers)}</td>
                          <td className={`py-3 px-4 font-medium ${item.cac <= targetCAC ? "text-green-500" : "text-red-500"}`}>
                            {formatCurrency(item.cac)}
                          </td>
                          <td className="py-3 px-4">{formatCurrency(item.ltv)}</td>
                          <td className="py-3 px-4">
                            <span className={`font-medium ${item.roi >= 100 ? "text-green-500" : "text-yellow-500"}`}>
                              {item.roi.toFixed(1)}%
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <Button size="sm" variant="outline" onClick={() => handleEdit(index)}>
                                Edit
                              </Button>
                              <Button 
                                size="sm" 
                                variant="destructive" 
                                onClick={() => handleDeleteChannel(index)}
                              >
                                Delete
                              </Button>
                            </div>
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-6 p-4 bg-muted rounded-lg">
          <h4 className="font-medium mb-2">CAC Health Guidelines</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• <span className="text-green-500">Healthy:</span> CAC ≤ LTV/3 (ROI ≥ 200%)</li>
            <li>• <span className="text-yellow-500">Moderate:</span> CAC ≤ LTV/2 (ROI ≥ 100%)</li>
            <li>• <span className="text-red-500">Concerning:</span> CAC ≥ LTV (ROI ≤ 0%)</li>
            <li>• Ideal LTV:CAC ratio is 3:1 or higher</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}