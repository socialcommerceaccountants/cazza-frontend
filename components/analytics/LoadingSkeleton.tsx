"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface LoadingSkeletonProps {
  type?: "chart" | "metric" | "table" | "full";
  count?: number;
}

export default function LoadingSkeleton({ type = "full", count = 1 }: LoadingSkeletonProps) {
  if (type === "metric") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-muted rounded-lg p-4 animate-pulse">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="h-4 bg-muted-foreground/20 rounded w-24"></div>
                <div className="h-8 bg-muted-foreground/20 rounded w-32"></div>
              </div>
              <div className="h-10 w-10 bg-muted-foreground/20 rounded-full"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === "chart") {
    return (
      <Card className="w-full">
        <CardHeader>
          <div className="space-y-2">
            <div className="h-6 bg-muted-foreground/20 rounded w-48"></div>
            <div className="h-4 bg-muted-foreground/20 rounded w-64"></div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] bg-muted rounded-lg animate-pulse"></div>
        </CardContent>
      </Card>
    );
  }

  if (type === "table") {
    return (
      <div className="overflow-x-auto">
        <div className="min-w-full">
          <div className="border-b">
            <div className="grid grid-cols-6 gap-4 py-3 px-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-4 bg-muted-foreground/20 rounded"></div>
              ))}
            </div>
          </div>
          {Array.from({ length: 5 }).map((_, rowIndex) => (
            <div key={rowIndex} className="border-b">
              <div className="grid grid-cols-6 gap-4 py-3 px-4">
                {Array.from({ length: 6 }).map((_, colIndex) => (
                  <div key={colIndex} className="h-6 bg-muted-foreground/20 rounded animate-pulse"></div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Full page skeleton
  return (
    <div className="space-y-8">
      {/* Metrics row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-muted rounded-lg p-4 animate-pulse">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="h-4 bg-muted-foreground/20 rounded w-24"></div>
                <div className="h-8 bg-muted-foreground/20 rounded w-32"></div>
              </div>
              <div className="h-10 w-10 bg-muted-foreground/20 rounded-full"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Chart skeletons */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {Array.from({ length: 2 }).map((_, i) => (
          <Card key={i} className="w-full">
            <CardHeader>
              <div className="space-y-2">
                <div className="h-6 bg-muted-foreground/20 rounded w-48"></div>
                <div className="h-4 bg-muted-foreground/20 rounded w-64"></div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] bg-muted rounded-lg animate-pulse"></div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Table skeleton */}
      <Card className="w-full">
        <CardHeader>
          <div className="space-y-2">
            <div className="h-6 bg-muted-foreground/20 rounded w-48"></div>
            <div className="h-4 bg-muted-foreground/20 rounded w-64"></div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <div className="min-w-full">
              <div className="border-b">
                <div className="grid grid-cols-6 gap-4 py-3 px-4">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="h-4 bg-muted-foreground/20 rounded"></div>
                  ))}
                </div>
              </div>
              {Array.from({ length: 5 }).map((_, rowIndex) => (
                <div key={rowIndex} className="border-b">
                  <div className="grid grid-cols-6 gap-4 py-3 px-4">
                    {Array.from({ length: 6 }).map((_, colIndex) => (
                      <div key={colIndex} className="h-6 bg-muted-foreground/20 rounded animate-pulse"></div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Individual skeleton components for more granular control
export function MetricSkeleton() {
  return (
    <div className="bg-muted rounded-lg p-4 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-4 bg-muted-foreground/20 rounded w-24"></div>
          <div className="h-8 bg-muted-foreground/20 rounded w-32"></div>
        </div>
        <div className="h-10 w-10 bg-muted-foreground/20 rounded-full"></div>
      </div>
    </div>
  );
}

export function ChartSkeleton({ height = 400 }: { height?: number }) {
  return (
    <div className="w-full">
      <div className="space-y-2 mb-4">
        <div className="h-6 bg-muted-foreground/20 rounded w-48"></div>
        <div className="h-4 bg-muted-foreground/20 rounded w-64"></div>
      </div>
      <div 
        className="bg-muted rounded-lg animate-pulse" 
        style={{ height: `${height}px` }}
      ></div>
    </div>
  );
}

export function TableSkeleton({ rows = 5, columns = 6 }: { rows?: number; columns?: number }) {
  return (
    <div className="overflow-x-auto">
      <div className="min-w-full">
        <div className="border-b">
          <div className="grid gap-4 py-3 px-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
            {Array.from({ length: columns }).map((_, i) => (
              <div key={i} className="h-4 bg-muted-foreground/20 rounded"></div>
            ))}
          </div>
        </div>
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="border-b">
            <div className="grid gap-4 py-3 px-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
              {Array.from({ length: columns }).map((_, colIndex) => (
                <div key={colIndex} className="h-6 bg-muted-foreground/20 rounded animate-pulse"></div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}