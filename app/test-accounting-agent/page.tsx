import CategorisationTest from '@/components/accounting/CategorisationTest';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function TestAccountingAgentPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">AI Accounting Agent Test</h1>
          <p className="text-gray-600 mt-2">
            Test the core AI accounting intelligence that makes Cazza unique
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <CategorisationTest />
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">How It Works</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-sm text-gray-700">Personalized AI Agent</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Each client gets their own AI agent that learns their unique accounting preferences.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-gray-700">Federated Learning</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Agents share anonymized patterns to improve suggestions for all clients.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-gray-700">UK Compliance</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Built-in UK accounting rules for VAT, corporation tax, and compliance.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Example Transactions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <button
                  className="text-left p-3 hover:bg-gray-50 rounded-md border border-gray-200 w-full"
                  onClick={() => window.location.href = '/test-accounting-agent?example=1'}
                >
                  <p className="font-medium text-sm">Shopify Income</p>
                  <p className="text-xs text-gray-500">"Shopify payment - Order #12345"</p>
                </button>
                <button
                  className="text-left p-3 hover:bg-gray-50 rounded-md border border-gray-200 w-full"
                  onClick={() => window.location.href = '/test-accounting-agent?example=2'}
                >
                  <p className="font-medium text-sm">AWS Expense</p>
                  <p className="text-xs text-gray-500">"AWS Invoice - EC2 instances"</p>
                </button>
                <button
                  className="text-left p-3 hover:bg-gray-50 rounded-md border border-gray-200 w-full"
                  onClick={() => window.location.href = '/test-accounting-agent?example=3'}
                >
                  <p className="font-medium text-sm">Google Ads</p>
                  <p className="text-xs text-gray-500">"Google Ads - March campaign"</p>
                </button>
              </CardContent>
            </Card>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Technical Implementation</CardTitle>
            <CardDescription>
              Core AI accounting agent services built in the backend
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-blue-800">ClientAgent Service</h3>
                <p className="text-sm text-blue-600 mt-1">
                  AI that learns each client's accounting preferences and applies UK rules
                </p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <h3 className="font-semibold text-purple-800">CentralKnowledge</h3>
                <p className="text-sm text-purple-600 mt-1">
                  Aggregates anonymized patterns from all clients for shared learning
                </p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <h3 className="font-semibold text-green-800">UKAccountingRules</h3>
                <p className="text-sm text-green-600 mt-1">
                  Hard-coded UK VAT rates, tax calculations, and compliance rules
                </p>
              </div>
              <div className="p-4 bg-orange-50 rounded-lg">
                <h3 className="font-semibold text-orange-800">Xero Integration</h3>
                <p className="text-sm text-orange-600 mt-1">
                  OAuth authentication and API integration with Xero accounting
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}