                TikTok Shop
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Synced Products</h3>
                  <p className="text-sm text-muted-foreground">
                    {status.products.length} products • {status.stats.activeProducts} active
                  </p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleSync('products')}
                  disabled={isSyncing}
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
                  Refresh Products
                </Button>
              </div>

              <div className="space-y-3">
                {status.products.map((product) => (
                  <div key={product.id} className="p-4 border rounded-lg space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{product.name}</div>
                        <div className="text-sm text-muted-foreground">
                          SKU: {product.sku} • £{product.price.toFixed(2)}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={
                          product.status === 'active' ? 'bg-green-100 text-green-800' :
                          product.status === 'out_of_stock' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }>
                          {product.status === 'active' ? 'In Stock' :
                           product.status === 'out_of_stock' ? 'Out of Stock' : 'Draft'}
                        </Badge>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleUpdateProduct(product.id, { stock: product.stock + 10 })}
                        >
                          Restock
                        </Button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Stock:</span>
                        <div className="font-medium">{product.stock} units</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Last Synced:</span>
                        <div>{new Date(product.lastSynced).toLocaleDateString()}</div>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        Edit
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        View Analytics
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <Separator />

              <div className="space-y-2">
                <h4 className="font-medium">Product Sync Features</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Automatic inventory sync
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Price synchronization
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Product image sync
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Variant management
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Bulk product updates
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Real-time stock updates
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
                <BarChart className="h-5 w-5 mr-2" />
                Performance Metrics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Tag className="h-4 w-4 mr-2 text-blue-500" />
                    <span>Total Products</span>
                  </div>
                  <span className="font-bold">{status.stats.totalProducts}</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <ShoppingBag className="h-4 w-4 mr-2 text-green-500" />
                    <span>Active Products</span>
                  </div>
                  <span className="font-bold">{status.stats.activeProducts}</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <TrendingUp className="h-4 w-4 mr-2 text-purple-500" />
                    <span>Total Orders</span>
                  </div>
                  <span className="font-bold">{status.stats.totalOrders}</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <DollarSign className="h-4 w-4 mr-2 text-amber-500" />
                    <span>Total Revenue</span>
                  </div>
                  <span className="font-bold">£{status.stats.totalRevenue.toLocaleString()}</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-2 text-pink-500" />
                    <span>Audience Reach</span>
                  </div>
                  <span className="font-bold">{status.stats.audienceReach.toLocaleString()}</span>
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
                <Tag className="h-4 w-4 mr-2" />
                Add New Product
              </Button>
              <Button variant="outline" className="w-full justify-start" disabled={!status.isConnected}>
                <ShoppingBag className="h-4 w-4 mr-2" />
                View Orders
              </Button>
              <Button variant="outline" className="w-full justify-start" disabled={!status.isConnected}>
                <BarChart className="h-4 w-4 mr-2" />
                Analytics Dashboard
              </Button>
              <Button variant="outline" className="w-full justify-start" disabled={!status.isConnected}>
                <Settings className="h-4 w-4 mr-2" />
                Sync Settings
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Smartphone className="h-5 w-5 mr-2" />
                Social Commerce
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-medium">Platform Features</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Live Shopping:</span>
                    <span>Supported</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Video Integration:</span>
                    <span>Enabled</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Creator Commerce:</span>
                    <span>Available</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Region:</span>
                    <span>United Kingdom</span>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <h4 className="font-medium">UK Compliance</h4>
                <p className="text-sm text-muted-foreground">
                  All TikTok Shop transactions are automatically processed with UK VAT rates and tax compliance.
                </p>
              </div>

              <Alert>
                <Video className="h-4 w-4" />
                <AlertTitle>TikTok Shop API</AlertTitle>
                <AlertDescription className="text-sm">
                  This integration uses the official TikTok Shop API for secure and reliable data synchronization.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}