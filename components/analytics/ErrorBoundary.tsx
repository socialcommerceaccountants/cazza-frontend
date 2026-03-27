"use client";

import { Component, ErrorInfo, ReactNode } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class AnalyticsErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Analytics Error Boundary caught an error:", error, errorInfo);
    
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
    });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Card className="w-full border-destructive/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              Something went wrong
            </CardTitle>
            <CardDescription>
              An error occurred while loading analytics data
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-muted rounded-lg p-4">
                <p className="font-medium mb-2">Error Details:</p>
                <code className="text-sm text-muted-foreground block whitespace-pre-wrap break-words">
                  {this.state.error?.message || "Unknown error"}
                </code>
              </div>
              
              <div className="flex items-center gap-3">
                <Button onClick={this.handleReset}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Try Again
                </Button>
                <Button variant="outline" onClick={() => window.location.reload()}>
                  Reload Page
                </Button>
              </div>

              <div className="text-sm text-muted-foreground">
                <p className="mb-1">If the problem persists:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Check your internet connection</li>
                  <li>Clear your browser cache</li>
                  <li>Contact support if the issue continues</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      );
    }

    return this.props.children;
  }
}

// Hook for error handling in functional components
export function useErrorHandler() {
  const handleError = (error: Error, context?: string) => {
    console.error(`Error in ${context || 'analytics component'}:`, error);
    
    // In a real app, you might want to send this to an error tracking service
    // Sentry.captureException(error, { tags: { context } });
    
    return {
      message: error.message,
      timestamp: Date.now(),
      context,
    };
  };

  return { handleError };
}