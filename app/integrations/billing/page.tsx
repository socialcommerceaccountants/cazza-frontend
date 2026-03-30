                      <div className="mt-4 flex space-x-2">
                        <Button>Generate Report</Button>
                        <Button variant="outline">Export CSV</Button>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-2">Revenue Trends</h3>
                      <div className="h-32 bg-muted rounded-lg flex items-center justify-center">
                        <p className="text-muted-foreground">Revenue chart will appear here</p>
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">
                        Monthly recurring revenue trend over the last 12 months
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
}