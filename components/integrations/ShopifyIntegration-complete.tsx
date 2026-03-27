                        'bg-green-100 text-green-800' :
                        webhook.status === 'failed' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }>
                        {webhook.status === 'active' ? 'Active' :
                         webhook.status === 'failed' ? 'Failed' : 'Pending'}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleWebhookToggle(webhook.id, webhook.status !== 'active')}
                      >
                        {webhook.status === 'active' ? 'Disable' : 'Enable'}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <Separator />

              <div className="space-y-2">
                <h4 className="font-medium">Available Webhook Topics</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    orders/create
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    orders/updated
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    products/create
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    products/update
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    customers/create
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    customers/update
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <DollarSign className="h-5 w-5 mr-2" />
                Store Statistics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Package className="h-4 w-4 mr-2 text-blue-500" />
                    <span>Total Orders</span>
                  </div>
                  <span className="font-bold">{status.stats.totalOrders.toLocaleString()}</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <ShoppingCart className="h-4 w-4 mr-2 text-green-500" />
                    <span>Total Products</span>
                  </div>
                  <span className="font-bold">{status.stats.totalProducts.toLocaleString()}</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-2 text-purple-500" />
                    <span>Total Customers</span>
                  </div>
                  <span className="font-bold">{status.stats.totalCustomers.toLocaleString()}</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <DollarSign className="h-4 w-4 mr-2 text-amber-500" />
                    <span>Total Revenue</span>
                  </div>
                  <span className="font-bold">£{status.stats.revenue.toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start" disabled={!status.isConnected}>
                <Package className="h-4 w-4 mr-2" />
                Export Orders
              </Button>
              <Button variant="outline" className="w-full justify-start" disabled={!status.isConnected}>
                <ShoppingCart className="h-4 w-4 mr-2" />
                Export Products
              </Button>
              <Button variant="outline" className="w-full justify-start" disabled={!status.isConnected}>
                <Users className="h-4 w-4 mr-2" />
                Export Customers
              </Button>
              <Button variant="outline" className="w-full justify-start" disabled={!status.isConnected}>
                <Settings className="h-4 w-4 mr-2" />
                Configure Webhooks
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Globe className="h-5 w-5 mr-2" />
                App Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-medium">Sync Configuration</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Auto-sync interval:</span>
                    <span>Every 1 hour</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sync historical data:</span>
                    <span>90 days</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Currency conversion:</span>
                    <span>Enabled</span>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <h4 className="font-medium">Data Mapping</h4>
                <p className="text-sm text-muted-foreground">
                  Shopify data is automatically mapped to UK accounting standards including VAT calculation and tax handling.
                </p>
              </div>

              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Shopify App Required</AlertTitle>
                <AlertDescription className="text-sm">
                  This integration requires the Cazza.ai app to be installed from the Shopify App Store.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}