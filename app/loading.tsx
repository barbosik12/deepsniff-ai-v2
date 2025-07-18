"use client";

import { Loader2, Brain } from 'lucide-react';

export default function Loading() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        {/* Animated logo */}
        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-r from-primary to-accent p-4 lunar-glow animate-pulse">
          <Brain className="w-8 h-8 text-background" />
        </div>
        
        {/* Loading spinner */}
        <div className="flex items-center justify-center space-x-3 mb-4">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
          <span className="text-lg font-medium text-foreground">Loading DeepSniff...</span>
        </div>
        
        {/* Loading message */}
        <p className="text-sm text-muted-foreground max-w-md mx-auto">
          Initializing AI-powered deepfake detection system
        </p>
        
        {/* Progress indicator */}
        <div className="mt-6 w-64 mx-auto">
          <div className="h-1 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-primary to-accent rounded-full animate-pulse" 
                 style={{ width: '60%' }} />
          </div>
        </div>
      </div>
    </div>
  );
}