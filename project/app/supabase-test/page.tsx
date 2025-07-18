"use client";

import { useState, useEffect } from 'react';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { AuthForm } from '@/components/auth/auth-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Database, 
  CheckCircle, 
  AlertTriangle, 
  Loader2, 
  Play,
  Users,
  FileText,
  Settings,
  RefreshCw,
  LogOut,
  User
} from 'lucide-react';
import { supabase, auth, db, config } from '@/lib/supabase';
import { useAuth } from '@/components/auth/auth-provider';

export default function SupabaseTestPage() {
  const { user, loading: authLoading, signOut } = useAuth();
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'testing' | 'connected' | 'error'>('idle');
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [testResults, setTestResults] = useState<any[]>([]);

  useEffect(() => {
    if (!authLoading) {
      testConnection();
    }
  }, [authLoading]);

  const testConnection = async () => {
    setConnectionStatus('testing');
    setConnectionError(null);
    
    try {
      const result = await db.testConnection();
      
      if (result.success) {
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

  const runTest = async (testName: string, testFunction: () => Promise<any>) => {
    setIsLoading(true);
    
    try {
      const result = await testFunction();
      setTestResults(prev => [...prev, {
        name: testName,
        status: 'success',
        result,
        timestamp: new Date().toISOString()
      }]);
    } catch (error) {
      setTestResults(prev => [...prev, {
        name: testName,
        status: 'error',
        error: error instanceof Error ? error.message : 'Test failed',
        timestamp: new Date().toISOString()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearResults = () => {
    setTestResults([]);
  };

  // Test functions
  const testSelectUsers = async () => {
    const { data, error } = await supabase.from('users').select('*').limit(5);
    if (error) throw error;
    return { message: `Found ${data.length} users`, data };
  };

  const testCreateUser = async () => {
    if (!user) throw new Error('User not authenticated');
    
    const userData = {
      id: user.id,
      email: user.email || 'test@example.com'
    };
    return await db.createUser(userData);
  };

  const testCreateAnalysis = async () => {
    if (!user) throw new Error('User not authenticated');

    const analysisData = {
      user_id: user.id,
      input: 'Sample deepfake video analysis',
      output: '{"isDeepfake": true, "confidence": 0.95}'
    };
    
    return await db.createAnalysis(analysisData);
  };

  if (authLoading) {
    return (
      <main className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-20 pb-12 flex items-center justify-center">
          <div className="flex items-center space-x-3">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
            <span className="text-foreground">Loading...</span>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-background">
        <Navbar />
        
        <div className="pt-20 pb-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
              {/* Header */}
              <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-foreground mb-2 heading-cosmic">
                  🗄️ Supabase Test
                </h1>
                <p className="text-xl text-muted-foreground">
                  Sign in to test Supabase integration and database functionality
                </p>
              </div>

              {/* Auth Form */}
              <div className="flex justify-center">
                <AuthForm 
                  onAuthSuccess={(user) => {
                    console.log('User authenticated:', user);
                  }}
                />
              </div>

              {/* Info */}
              <div className="mt-8">
                <Alert className="border-blue-500/30 bg-blue-500/10">
                  <Database className="h-4 w-4 text-blue-400" />
                  <AlertDescription className="text-blue-300">
                    Sign in with your email and password to access the Supabase test interface. 
                    You can create a new account if you don't have one.
                  </AlertDescription>
                </Alert>
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-20 pb-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-4xl font-bold text-foreground mb-2 heading-cosmic">
                    🗄️ Supabase Integration Test
                  </h1>
                  <p className="text-xl text-muted-foreground">
                    Test and verify your Supabase database connection and functionality
                  </p>
                </div>
                
                {/* User Info */}
                <Card className="card-cosmic">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <User className="w-5 h-5 text-primary" />
                      <div>
                        <p className="font-medium text-foreground">{user.email}</p>
                        <p className="text-xs text-muted-foreground">Authenticated</p>
                      </div>
                      <Button
                        onClick={signOut}
                        variant="outline"
                        size="sm"
                        className="hover:bg-destructive/10"
                      >
                        <LogOut className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Main Testing Area */}
              <div className="lg:col-span-2 space-y-8">
                {/* Connection Status */}
                <Card className="card-cosmic">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-foreground">
                      <Database className="w-5 h-5 text-primary" />
                      🔗 Connection Status
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
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Test Connection
                      </Button>
                    </div>

                    {connectionStatus === 'connected' && (
                      <div className="mt-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                        <p className="text-sm text-green-300">
                          ✅ Supabase is connected and ready! You can now test database operations.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Database Tests */}
                <Card className="card-cosmic">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-foreground">
                      <Play className="w-5 h-5 text-primary" />
                      🧪 Database Tests
                    </CardTitle>
                    <CardDescription className="text-muted-foreground">
                      Test database operations with your authenticated user
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid sm:grid-cols-3 gap-4 mb-6">
                      <Button
                        onClick={() => runTest('Select Users', testSelectUsers)}
                        disabled={isLoading}
                        className="btn-cosmic-primary"
                      >
                        <Users className="mr-2 h-4 w-4" />
                        Select Users
                      </Button>
                      
                      <Button
                        onClick={() => runTest('Create User', testCreateUser)}
                        disabled={isLoading}
                        className="btn-cosmic-primary"
                      >
                        <Users className="mr-2 h-4 w-4" />
                        Create User
                      </Button>
                      
                      <Button
                        onClick={() => runTest('Create Analysis', testCreateAnalysis)}
                        disabled={isLoading}
                        className="btn-cosmic-primary"
                      >
                        <FileText className="mr-2 h-4 w-4" />
                        Create Analysis
                      </Button>
                    </div>

                    <div className="flex justify-between items-center">
                      <p className="text-sm text-muted-foreground">
                        {isLoading ? 'Running test...' : 'Click any button to test database operations'}
                      </p>
                      {testResults.length > 0 && (
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

                {/* Test Results */}
                {testResults.length > 0 && (
                  <Card className="card-cosmic">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-foreground">
                        <CheckCircle className="w-5 h-5 text-primary" />
                        📊 Test Results
                      </CardTitle>
                      <CardDescription className="text-muted-foreground">
                        Results from your database and API tests
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3 max-h-96 overflow-y-auto">
                        {testResults.map((result, index) => (
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
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Configuration */}
                <Card className="card-cosmic">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-foreground">
                      <Settings className="w-5 h-5 text-primary" />
                      ⚙️ Configuration
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-foreground">URL:</span>
                        <Badge className={config.hasUrl ? "badge-cosmic" : "badge-cosmic-destructive"}>
                          {config.hasUrl ? 'Set' : 'Missing'}
                        </Badge>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-foreground">API Key:</span>
                        <Badge className={config.hasKey ? "badge-cosmic" : "badge-cosmic-destructive"}>
                          {config.hasKey ? 'Set' : 'Missing'}
                        </Badge>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-foreground">Status:</span>
                        <Badge className={config.isConfigured ? "badge-cosmic" : "badge-cosmic-destructive"}>
                          {config.isConfigured ? 'Configured' : 'Incomplete'}
                        </Badge>
                      </div>

                      {config.url && (
                        <div className="mt-4 p-3 bg-muted/30 rounded border border-border/30">
                          <p className="text-xs text-muted-foreground break-all">
                            {config.url}
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* User Info */}
                <Card className="card-cosmic">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-foreground">
                      <User className="w-5 h-5 text-primary" />
                      👤 Current User
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm font-medium text-foreground">Email:</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium text-foreground">User ID:</p>
                        <p className="text-xs text-muted-foreground font-mono break-all">
                          {user.id}
                        </p>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium text-foreground">Created:</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(user.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Setup Instructions */}
                <Card className="card-cosmic">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-foreground">
                      <Database className="w-5 h-5 text-primary" />
                      📋 Setup Guide
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 text-sm">
                      <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                        <h4 className="font-medium text-blue-400 mb-2">🗄️ Required Tables:</h4>
                        <ul className="text-blue-300 space-y-1 text-xs">
                          <li>• users (id, email, created_at)</li>
                          <li>• analyses (id, user_id, input, output, created_at)</li>
                        </ul>
                      </div>

                      <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                        <h4 className="font-medium text-yellow-400 mb-2">🔒 RLS Policies:</h4>
                        <ul className="text-yellow-300 space-y-1 text-xs">
                          <li>• Enable RLS on both tables</li>
                          <li>• Users can read/write own data</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}