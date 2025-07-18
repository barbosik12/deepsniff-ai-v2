"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  AlertTriangle, 
  Crown, 
  Zap, 
  ArrowRight,
  Clock
} from 'lucide-react';
import { 
  getUsageData, 
  getRemainingAnalyses, 
  hasReachedLimit,
  FREE_ANALYSIS_LIMIT
} from '@/lib/usage-tracker';

interface UsageLimitBannerProps {
  onUpgradeClick?: () => void;
  className?: string;
}

export function UsageLimitBanner({ onUpgradeClick, className = '' }: UsageLimitBannerProps) {
  const [remaining, setRemaining] = useState(FREE_ANALYSIS_LIMIT);
  const [isLimitReached, setIsLimitReached] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    const updateUsageState = () => {
      const remainingCount = getRemainingAnalyses();
      const limitReached = hasReachedLimit();
      
      setRemaining(remainingCount);
      setIsLimitReached(limitReached);
    };

    updateUsageState();

    // Listen for storage changes (in case user opens multiple tabs)
    const handleStorageChange = () => {
      updateUsageState();
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Also check periodically for updates
    const interval = setInterval(updateUsageState, 5000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, [mounted]);

  const scrollToProPlan = () => {
    const proPlanElement = document.querySelector('[data-pro-plan]');
    if (proPlanElement) {
      proPlanElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    onUpgradeClick?.();
  };

  if (!mounted) {
    return (
      <Card className="card-cosmic">
        <CardContent className="p-4">
          <div className="animate-pulse">
            <div className="h-4 bg-primary/20 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-primary/20 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Show limit reached warning
  if (isLimitReached) {
    return (
      <Card className={`card-cosmic border-red-500/30 bg-red-500/5 ${className}`}>
        <CardContent className="p-6">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 rounded-full bg-red-500/20 border border-red-500/30 flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-6 h-6 text-red-400" />
            </div>
            
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-foreground mb-2 flex items-center gap-2">
                🚫 Free Limit Reached
              </h3>
              <p className="text-muted-foreground mb-4 leading-relaxed">
                You&apos;ve used all {FREE_ANALYSIS_LIMIT} free deepfake analyses. Upgrade to Pro Plan to continue analyzing images and videos with unlimited access.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={scrollToProPlan}
                  className="btn-cosmic-primary font-semibold group flex-1 sm:flex-none"
                >
                  <Crown className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                  Upgrade to Pro Plan
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
                
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>Resets daily at midnight</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Show remaining analyses
  return (
    <Card className={`card-cosmic border-primary/30 bg-primary/5 ${className}`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center">
              <Zap className="w-5 h-5 text-primary" />
            </div>
            
            <div>
              <div className="flex items-center space-x-2">
                <h4 className="font-semibold text-foreground">Free Analyses</h4>
                <Badge className="badge-cosmic">
                  {remaining} left
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {remaining === 1 ? 'Last free analysis remaining' : `${remaining} free scans remaining today`}
              </p>
            </div>
          </div>

          {remaining <= 1 && (
            <Button
              onClick={scrollToProPlan}
              variant="outline"
              size="sm"
              className="hover:bg-primary/10 hover:border-primary/50 group"
            >
              <Crown className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
              Upgrade
            </Button>
          )}
        </div>

        {/* Progress bar */}
        <div className="mt-4">
          <div className="flex justify-between text-xs text-muted-foreground mb-2">
            <span>Usage Today</span>
            <span>{FREE_ANALYSIS_LIMIT - remaining}/{FREE_ANALYSIS_LIMIT}</span>
          </div>
          <div className="w-full bg-muted/30 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-500 ${
                remaining <= 1 ? 'bg-red-400' : remaining <= 2 ? 'bg-yellow-400' : 'bg-primary'
              }`}
              style={{ width: `${((FREE_ANALYSIS_LIMIT - remaining) / FREE_ANALYSIS_LIMIT) * 100}%` }}
            />
          </div>
        </div>

        {/* Warning for low remaining */}
        {remaining <= 1 && (
          <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-yellow-400" />
              <p className="text-sm text-yellow-300">
                {remaining === 0 
                  ? 'No free analyses left. Upgrade to continue.' 
                  : 'Only 1 free analysis remaining today.'
                }
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}