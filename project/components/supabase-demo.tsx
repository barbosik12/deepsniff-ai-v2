"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Database, 
  CheckCircle, 
  AlertTriangle, 
  Loader2, 
  Play,
  Upload,
  BarChart3,
  Zap
} from 'lucide-react';
import { supabase, checkSupabaseConnection, supabaseHelpers } from '@/lib/supabase';
import { testSupabaseConnection, createSampleAnalysis, getDemoUserStats } from '@/lib/supabase-demo';

export function SupabaseDemo() {
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'testing' | 'connected' | 'error'>('idle');
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [demoResults, setDemoResults] = useState<any[]>([]);

  // Test connection on component mount
  useEffect(() => {
    testConnection();
  }, []);

  const testConnection = async () => {
    setConnectionStatus('testing');
    setConnectionError(null);
    
    try {
      const result = await checkSupabaseConnection();
      
      if (result.status === 'connected') {
        setConnectionStatus('connected');
      } else {
        setConnectionStatus('error');
        setConnectionError(result.error || 'Unknown connection error');
      }
    } catch (error) {
      setConnectionStatus('error');
      setConnectionError(error instanceof Error ? error.message : 'Connection test failed');
    }
  };

  const runDemo = async (demoName: string, demoFunction: () => Promise<any>) => {
    setIsLoading(true);
    
    try {
      const result = await demoFunction();
      setDemoResults(prev => [...prev, {
        name: demoName,
        status: 'success',
        result,
        timestamp: new Date().toISOString()
      }]);
    } catch (error) {
      setDemoResults(prev => [...prev, {
        name: demoName,
        status: 'error',
        error: error instanceof Error ? error.message : 'Demo failed',
        timestamp: new Date().toISOString()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearResults = () => {
    setDemoResults([]);
  };

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      <Card className="card-cosmic">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Database className="w-5 h-5 text-primary" />
            🗄️ Supabase Connection Status
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Real-time connection status to your Supabase database
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {connectionStatus === 'testing' && (
                <Loader2 className="w-5 h-5 animate-spin text-primary" />
              )}
              {connectionStatus === 'connected' && (
                <CheckCircle className="w-5 h-5 text-green-400" />
              )}
              {connectionStatus === 'error' && (
                <AlertTriangle className="w-5 h-5 text-red-400" />
              )}
              
              <div>
                <p className="font-medium text-foreground">
                  {connectionStatus === 'idle' && 'Not tested'}
                  {connectionStatus === 'testing' && 'Testing connection...'}
                  {connectionStatus === 'connected' && 'Connected successfully'}
                  {connectionStatus === 'error' && 'Connection failed'}
                </p>
                {connectionError && (
                  <p className="text-sm text-red-400">{connectionError}</p>
                )}
              </div>
            </div>
            
            <Button
              onClick={testConnection}
              disabled={connectionStatus === 'testing'}
              className="btn-cosmic-secondary"
            >
              {connectionStatus === 'testing' ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Database className="mr-2 h-4 w-4" />
              )}
              Test Connection
            </Button>
          </div>

          {connectionStatus === 'connected' && (
            <div className="mt-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
              <p className="text-sm text-green-300">
                ✅ Supabase is connected and ready to use! You can now perform database operations.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Demo Controls */}
      <Card className="card-cosmic">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Play className="w-5 h-5 text-primary" />
            🧪 Supabase API Demos
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Test various Supabase features and operations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button
              onClick={() => runDemo('Connection Test', testSupabaseConnection)}
              disabled={isLoading}
              className="btn-cosmic-primary"
            >
              <Database className="mr-2 h-4 w-4" />
              Test API
            </Button>
            
            <Button
              onClick={() => runDemo('Create Analysis', () => createSampleAnalysis('demo-user-123'))}
              disabled={isLoading}
              className="btn-cosmic-primary"
            >
              <Upload className="mr-2 h-4 w-4" />
              Create Data
            </Button>
            
            <Button
              onClick={() => runDemo('Get Statistics', () => getDemoUserStats('demo-user-123'))}
              disabled={isLoading}
              className="btn-cosmic-primary"
            >
              <BarChart3 className="mr-2 h-4 w-4" />
              Get Stats
            </Button>
            
            <Button
              onClick={() => runDemo('Real-time Test', async () => {
                const subscription = supabase
                  .channel('demo-test')
                  .on('postgres_changes', { event: '*', schema: 'public', table: 'analyses' }, 
                    (payload) => console.log('Real-time:', payload))
                  .subscribe();
                
                setTimeout(() => subscription.unsubscribe(), 2000);
                return { message: 'Real-time subscription tested' };
              })}
              disabled={isLoading}
              className="btn-cosmic-primary"
            >
              <Zap className="mr-2 h-4 w-4" />
              Real-time
            </Button>
          </div>

          <div className="mt-4 flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              {isLoading ? 'Running demo...' : 'Click any button to test Supabase features'}
            </p>
            {demoResults.length > 0 && (
              <Button
                onClick={clearResults}
                variant="outline"
                size="sm"
                className="hover:bg-destructive/10"
              >
                Clear Results
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Demo Results */}
      {demoResults.length > 0 && (
        <Card className="card-cosmic">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <BarChart3 className="w-5 h-5 text-primary" />
              📊 Demo Results
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Results from your Supabase API tests
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {demoResults.map((result, index) => (
                <div
                  key={index}
                  className="p-4 bg-card/50 rounded-lg border border-border/50"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      {result.status === 'success' ? (
                        <CheckCircle className="w-4 h-4 text-green-400" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-red-400" />
                      )}
                      <span className="font-medium text-foreground">{result.name}</span>
                    </div>
                    <Badge className={result.status === 'success' ? "badge-cosmic" : "badge-cosmic-destructive"}>
                      {result.status}
                    </Badge>
                  </div>
                  
                  {result.status === 'success' && result.result && (
                    <div className="mt-2 p-3 bg-muted/30 rounded border border-border/30">
                      <pre className="text-xs text-muted-foreground overflow-x-auto">
                        {JSON.stringify(result.result, null, 2)}
                      </pre>
                    </div>
                  )}
                  
                  {result.status === 'error' && (
                    <p className="text-sm text-red-400 mt-2">{result.error}</p>
                  )}
                  
                  <p className="text-xs text-muted-foreground mt-2">
                    {new Date(result.timestamp).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Configuration Info */}
      <Card className="card-cosmic">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Database className="w-5 h-5 text-primary" />
            ⚙️ Configuration
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Current Supabase configuration details
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-foreground">Supabase URL:</span>
              <code className="text-xs text-primary bg-muted/30 px-2 py-1 rounded">
                https://yiyjsxwqntpbophcvpcn.supabase.co
              </code>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-foreground">API Key:</span>
              <code className="text-xs text-muted-foreground bg-muted/30 px-2 py-1 rounded">
                eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
              </code>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-foreground">Client Library:</span>
              <Badge className="badge-cosmic">@supabase/supabase-js v2.39.0</Badge>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
            <h4 className="font-medium text-blue-400 mb-2">💡 Next Steps:</h4>
            <ul className="text-sm text-blue-300 space-y-1">
              <li>• Create database tables in your Supabase dashboard</li>
              <li>• Set up Row Level Security (RLS) policies</li>
              <li>• Configure storage buckets for file uploads</li>
              <li>• Move credentials to environment variables</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}