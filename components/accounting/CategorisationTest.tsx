"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

interface CategorisationSuggestion {
  category: string;
  account_code: string;
  confidence: number;
  reasoning: string;
  vat_rate?: number;
  vat_amount?: number;
  source: string;
  knowledge_id?: string;
}

export default function CategorisationTest() {
  const [description, setDescription] = useState('Shopify payment for order #12345');
  const [amount, setAmount] = useState('299.99');
  const [merchant, setMerchant] = useState('Shopify');
  const [transactionType, setTransactionType] = useState('income');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CategorisationSuggestion | null>(null);
  const [error, setError] = useState<string | null>(null);

  const testCategorisation = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Note: In production, this would use proper authentication
      // For testing, we're making a direct API call
      const response = await fetch('http://localhost:8000/api/v1/categorise/suggest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          description,
          amount: parseFloat(amount),
          merchant,
          transaction_type: transactionType,
          // In real usage, we'd have a client_id from the user's session
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'bg-green-100 text-green-800';
    if (confidence >= 60) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const getSourceBadge = (source: string) => {
    switch (source) {
      case 'client_knowledge':
        return <Badge className="bg-blue-100 text-blue-800">Client Knowledge</Badge>;
      case 'central_knowledge':
        return <Badge className="bg-purple-100 text-purple-800">Central Knowledge</Badge>;
      case 'rules':
        return <Badge className="bg-gray-100 text-gray-800">Accounting Rules</Badge>;
      default:
        return <Badge>{source}</Badge>;
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>AI Accounting Agent Test</CardTitle>
        <CardDescription>
          Test the AI accounting agent's transaction categorization
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="description">Transaction Description</Label>
              <Input
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g., Shopify payment for order #12345"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">Amount (£)</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="e.g., 299.99"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="merchant">Merchant</Label>
              <Input
                id="merchant"
                value={merchant}
                onChange={(e) => setMerchant(e.target.value)}
                placeholder="e.g., Shopify, AWS, Google"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="transactionType">Transaction Type</Label>
              <Select value={transactionType} onValueChange={(value) => setTransactionType(value || 'income')}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="income">Income</SelectItem>
                  <SelectItem value="expense">Expense</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <Button onClick={testCategorisation} disabled={loading} className="w-full">
          {loading ? 'Categorising...' : 'Test AI Categorisation'}
        </Button>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-700 font-medium">Error</p>
            <p className="text-red-600 text-sm">{error}</p>
            <p className="text-red-500 text-xs mt-2">
              Note: The API requires authentication. This is a test component.
            </p>
          </div>
        )}

        {result && (
          <div className="space-y-4 p-4 bg-gray-50 rounded-md border">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">AI Suggestion</h3>
              <div className="flex items-center gap-2">
                {getSourceBadge(result.source)}
                <Badge className={getConfidenceColor(result.confidence)}>
                  {result.confidence}% confidence
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Category</p>
                <p className="font-medium">{result.category}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Account Code</p>
                <p className="font-medium">{result.account_code}</p>
              </div>
            </div>

            {result.vat_rate !== undefined && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">VAT Rate</p>
                  <p className="font-medium">{result.vat_rate}%</p>
                </div>
                {result.vat_amount !== undefined && (
                  <div>
                    <p className="text-sm text-gray-500">VAT Amount</p>
                    <p className="font-medium">£{result.vat_amount.toFixed(2)}</p>
                  </div>
                )}
              </div>
            )}

            <div>
              <p className="text-sm text-gray-500">Reasoning</p>
              <p className="text-sm">{result.reasoning}</p>
            </div>

            {result.knowledge_id && (
              <div>
                <p className="text-sm text-gray-500">Knowledge ID</p>
                <p className="text-xs font-mono">{result.knowledge_id}</p>
              </div>
            )}
          </div>
        )}

        <div className="text-sm text-gray-500 space-y-2">
          <p className="font-medium">How the AI Agent works:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              <span className="font-medium">Client Knowledge:</span> Checks the client's personal accounting preferences first
            </li>
            <li>
              <span className="font-medium">Central Knowledge:</span> Falls back to anonymized patterns from similar businesses
            </li>
            <li>
              <span className="font-medium">Accounting Rules:</span> Uses UK accounting rules as final fallback
            </li>
            <li>Learns from client overrides to improve future suggestions</li>
            <li>Shares anonymized patterns (with consent) to help all clients</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}