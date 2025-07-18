"use client";

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="card-cosmic max-w-md w-full">
        <CardHeader className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/20 border border-red-500/30 flex items-center justify-center">
            <AlertTriangle className="w-8 h-8 text-red-400" />
          </div>
          <CardTitle className="text-2xl font-bold text-foreground">
            Something went wrong
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            An unexpected error occurred while loading DeepSniff
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Error details */}
          <div className="bg-card/30 p-4 rounded-lg border border-border/30">
            <h4 className="font-medium text-foreground mb-2">Error Details:</h4>
            <p className="text-sm text-muted-foreground font-mono">
              {error.message || 'Unknown error occurred'}
            </p>
            {error.digest && (
              <p className="text-xs text-muted-foreground mt-2">
                Error ID: {error.digest}
              </p>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={reset}
              className="flex-1 btn-cosmic-primary"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
            
            <Button
              onClick={() => window.location.href = '/'}
              variant="outline"
              className="flex-1"
            >
              <Home className="mr-2 h-4 w-4" />
              Go Home
            </Button>
          </div>

          {/* Help text */}
          <div className="text-center pt-4 border-t border-border/30">
            <p className="text-sm text-muted-foreground">
              If this problem persists, please contact{' '}
              <a 
                href="mailto:support@deepsniff.ai" 
                className="text-primary hover:underline"
              >
                support@deepsniff.ai
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}