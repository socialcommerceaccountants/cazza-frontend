                    Making Tax Digital (MTD) ready
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Automatic bank feed reconciliation
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                Security & Permissions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-medium">Access Scope</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Read accounting transactions
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Read organisation settings
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Read contacts and invoices
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Read bank transactions
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <h4 className="font-medium">Data Protection</h4>
                <p className="text-sm text-muted-foreground">
                  All Xero credentials are encrypted and stored securely. 
                  We only request read-only access to your accounting data.
                </p>
              </div>

              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Important</AlertTitle>
                <AlertDescription className="text-sm">
                  Disconnecting will remove access to your Xero data. 
                  Historical data already synced will be retained according to your data retention settings.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start" disabled={!status.isConnected}>
                <FileText className="h-4 w-4 mr-2" />
                Export Transactions
              </Button>
              <Button variant="outline" className="w-full justify-start" disabled={!status.isConnected}>
                <Settings className="h-4 w-4 mr-2" />
                Configure Sync Rules
              </Button>
              <Button variant="outline" className="w-full justify-start" disabled={!status.isConnected}>
                <AlertTriangle className="h-4 w-4 mr-2" />
                View Sync Errors
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <ExternalLink className="h-4 w-4 mr-2" />
                Xero Developer Portal
              </Button>
            </CardContent>
          </Card>

          {status.isConnected && status.lastSync && (
            <Card>
              <CardHeader>
                <CardTitle>Sync Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Last Successful Sync:</span>
                    <span className="font-medium">
                      {new Date(status.lastSync).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Status:</span>
                    <Badge className={
                      status.syncStatus === 'success' ? 'bg-green-100 text-green-800' :
                      status.syncStatus === 'failed' ? 'bg-red-100 text-red-800' :
                      status.syncStatus === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }>
                      {status.syncStatus === 'success' ? 'Up to date' :
                       status.syncStatus === 'failed' ? 'Sync failed' :
                       status.syncStatus === 'in_progress' ? 'Syncing...' : 'Ready'}
                    </Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Connected Tenants:</span>
                    <span className="font-medium">{status.tenants.length}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}