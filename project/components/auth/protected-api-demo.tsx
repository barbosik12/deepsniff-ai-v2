"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  Loader2, 
  CheckCircle, 
  AlertTriangle, 
  Database,
  Brain,
  Eye,
  Clock
} from 'lucide-react';
import { useAuth } from './auth-provider';
import { db } from '@/lib/supabase';

export function ProtectedApiDemo() {
  const { user, loading: authLoading } = useAuth();
  const [data, setData] = useState<any>(null);
  const [analysisHistory, setAnalysisHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user && !authLoading) {
      fetchProtectedData();
      fetchAnalysisHistory();
    }
  }, [user, authLoading]);

  const fetchProtectedData = async () => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      // Test database connection
      const connectionTest = await db.testConnection();
      
      // Get user analyses
      const userAnalyses = await db.getUserAnalyses(user.id, 5);
      
      setData({
        secret: 'Deepfake report data here.',
        message: 'This is protected deepfake analysis data',
        user: {
          id: user.id,
          email: user.email,
        },
        connection: connectionTest,
        data: {
          analysisHistory: userAnalyses || [],
          userStats: {
            totalAnalyses: userAnalyses?.length || 0,
            deepfakesFound: userAnalyses?.filter(a => {
              try {
                const output = JSON.parse(a.output);
                return output.isDeepfake;
              } catch {
                return false;
              }
            }).length || 0,
            averageConfidence: 0.91,
          }
        },
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      console.error('Failed to fetch protected data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalysisHistory = async () => {
    if (!user) return;

    try {
      const userAnalyses = await db.getUserAnalyses(user.id, 10);
      
      const formattedHistory = userAnalyses?.map(analysis => {
        try {
          const output = JSON.parse(analysis.output);
          return {
            id: analysis.id,
            fileName: analysis.input,
            result: {
              isDeepfake: output.isDeepfake || false,
              confidence: output.confidence || 0.5
            },
            timestamp: analysis.created_at,
          };
        } catch {
          return {
            id: analysis.id,
            fileName: analysis.input,
            result: { isDeepfake: false, confidence: 0.5 },
            timestamp: analysis.created_at,
          };
        }
      }) || [];

      setAnalysisHistory(formattedHistory);
    } catch (err) {
      console.error('Failed to fetch analysis history:', err);
    }
  };

  const runNewAnalysis = async () => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      // Create a new analysis record
      const analysisData = {
        user_id: user.id,
        input: 'test_video.mp4',
        output: JSON.stringify({
          isDeepfake: Math.random() > 0.5,
          confidence: 0.8 + Math.random() * 0.2
        })
      };

      const newAnalysis = await db.createAnalysis(analysisData);
      
      // Add to local state
      const formattedAnalysis = {
        id: newAnalysis.id,
        fileName: newAnalysis.input,
        result: JSON.parse(newAnalysis.output),
        timestamp: newAnalysis.created_at,
      };

      setAnalysisHistory(prev => [formattedAnalysis, ...prev]);
      
      // Update data stats
      if (data) {
        setData((prev: any) => ({
          ...prev,
          data: {
            ...prev.data,
            userStats: {
              ...prev.data.userStats,
              totalAnalyses: prev.data.userStats.totalAnalyses + 1
            }
          }
        }));
      }
    } catch (err) {
      console.error('Failed to run analysis:', err);
      setError(err instanceof Error ? err.message : 'Analysis failed');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <Card className="card-cosmic">
        <CardContent className="p-6">
          <div className="flex items-center space-x-3">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
            <div>
              <h3 className="font-semibold text-foreground">Initializing...</h3>
              <p className="text-sm text-muted-foreground">Setting up authentication</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!user) {
    return (
      <Card className="card-cosmic border-red-500/30 bg-red-500/5">
        <CardContent className="p-6">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="w-6 h-6 text-red-400" />
            <div>
              <h3 className="font-semibold text-red-400">Authentication Required</h3>
              <p className="text-sm text-red-300">Please sign in to access protected API features</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* API Status */}
      <Card className="card-cosmic border-green-500/30 bg-green-500/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Shield className="w-5 h-5 text-green-400" />
            🔒 Protected API Connection
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Authenticated API access using Supabase authentication
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-3">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <span className="text-green-400 font-medium">Connected & Authenticated</span>
            <Badge className="badge-cosmic">Active Session</Badge>
          </div>
          <div className="mt-3 text-sm text-muted-foreground">
            User: {user.email}
          </div>
        </CardContent>
      </Card>

      {/* Protected Data Display */}
      {data && (
        <Card className="card-cosmic">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Database className="w-5 h-5 text-primary" />
              📊 Protected User Data
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Data accessible only with valid Supabase authentication
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-card/30 p-4 rounded-lg border border-border/30">
              <h4 className="font-semibold text-foreground mb-2">User Statistics</h4>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Total Analyses</p>
                  <p className="text-foreground font-medium">{data.data?.userStats?.totalAnalyses}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Deepfakes Found</p>
                  <p className="text-red-400 font-medium">{data.data?.userStats?.deepfakesFound}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Avg. Confidence</p>
                  <p className="text-green-400 font-medium">
                    {(data.data?.userStats?.averageConfidence * 100).toFixed(1)}%
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-card/30 p-4 rounded-lg border border-border/30">
              <h4 className="font-semibold text-foreground mb-2">Database Connection</h4>
              <div className="flex items-center space-x-2">
                {data.connection?.success ? (
                  <CheckCircle className="w-4 h-4 text-green-400" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-red-400" />
                )}
                <p className="text-sm text-muted-foreground">
                  {data.connection?.success ? 'Connected to Supabase' : 'Connection failed'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Analysis Controls */}
      <Card className="card-cosmic">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Brain className="w-5 h-5 text-primary" />
            🧠 Run Protected Analysis
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Test authenticated deepfake analysis with Supabase storage
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={runNewAnalysis}
            disabled={loading}
            className="btn-cosmic-primary font-semibold"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Running Analysis...
              </>
            ) : (
              <>
                <Brain className="mr-2 h-4 w-4" />
                Run New Analysis
              </>
            )}
          </Button>

          {error && (
            <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-red-400" />
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Analysis History */}
      {analysisHistory.length > 0 && (
        <Card className="card-cosmic">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Eye className="w-5 h-5 text-primary" />
              📈 Analysis History
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Your recent deepfake detection results from Supabase
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analysisHistory.slice(0, 5).map((analysis, index) => (
                <div
                  key={analysis.id || index}
                  className="flex items-center justify-between p-3 bg-card/50 rounded-lg border border-border/50"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      analysis.result?.isDeepfake 
                        ? 'bg-red-500/20 border border-red-500/30' 
                        : 'bg-green-500/20 border border-green-500/30'
                    }`}>
                      {analysis.result?.isDeepfake ? (
                        <AlertTriangle className="w-4 h-4 text-red-400" />
                      ) : (
                        <CheckCircle className="w-4 h-4 text-green-400" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-foreground text-sm">
                        {analysis.fileName || 'Unknown File'}
                      </p>
                      <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        <span>{new Date(analysis.timestamp).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className={analysis.result?.isDeepfake ? "badge-cosmic-destructive" : "badge-cosmic"}>
                      {analysis.result?.isDeepfake ? 'Deepfake' : 'Authentic'}
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-1">
                      {(analysis.result?.confidence * 100).toFixed(1)}% confidence
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}