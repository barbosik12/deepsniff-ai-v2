// Usage tracking utilities for deepfake analysis limits
export interface UsageData {
  count: number;
  lastReset: string;
}

export const FREE_ANALYSIS_LIMIT = 3;

// Get storage key for anonymous usage
export function getStorageKey(): string {
  return 'deepsniff_usage_anonymous';
}

// Get current usage data
export function getUsageData(): UsageData {
  if (typeof window === 'undefined') {
    return { count: 0, lastReset: new Date().toISOString() };
  }

  const storageKey = getStorageKey();
  const stored = localStorage.getItem(storageKey);
  
  if (!stored) {
    const newData: UsageData = {
      count: 0,
      lastReset: new Date().toISOString()
    };
    localStorage.setItem(storageKey, JSON.stringify(newData));
    return newData;
  }

  try {
    const data: UsageData = JSON.parse(stored);
    
    // Check if we need to reset (daily reset for demo purposes)
    const lastReset = new Date(data.lastReset);
    const now = new Date();
    const daysDiff = Math.floor((now.getTime() - lastReset.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysDiff >= 1) {
      const resetData: UsageData = {
        count: 0,
        lastReset: now.toISOString()
      };
      localStorage.setItem(storageKey, JSON.stringify(resetData));
      return resetData;
    }
    
    return data;
  } catch (error) {
    console.error('Error parsing usage data:', error);
    const newData: UsageData = {
      count: 0,
      lastReset: new Date().toISOString()
    };
    localStorage.setItem(storageKey, JSON.stringify(newData));
    return newData;
  }
}

// Increment usage count
export function incrementUsage(): UsageData {
  if (typeof window === 'undefined') {
    return { count: 0, lastReset: new Date().toISOString() };
  }

  const currentData = getUsageData();
  const newData: UsageData = {
    ...currentData,
    count: currentData.count + 1
  };
  
  const storageKey = getStorageKey();
  localStorage.setItem(storageKey, JSON.stringify(newData));
  
  return newData;
}

// Check if user has reached the limit
export function hasReachedLimit(): boolean {
  const data = getUsageData();
  return data.count >= FREE_ANALYSIS_LIMIT;
}

// Get remaining analyses
export function getRemainingAnalyses(): number {
  const data = getUsageData();
  return Math.max(0, FREE_ANALYSIS_LIMIT - data.count);
}

// Reset usage (for testing or admin purposes)
export function resetUsage(): void {
  if (typeof window === 'undefined') return;
  
  const storageKey = getStorageKey();
  const resetData: UsageData = {
    count: 0,
    lastReset: new Date().toISOString()
  };
  localStorage.setItem(storageKey, JSON.stringify(resetData));
}