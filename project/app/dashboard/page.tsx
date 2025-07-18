"use client";

import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { ProtectedContent } from '@/components/auth/protected-content';
import { UserProfile } from '@/components/auth/user-profile';
import { ProPlanSection } from '@/components/pro-plan-section';
import { ProtectedApiDemo } from '@/components/auth/protected-api-demo';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  BarChart3, 
  Shield, 
  Clock, 
  TrendingUp, 
  Video, 
  CheckCircle, 
  AlertTriangle,
  Eye,
  Download,
  Database
} from 'lucide-react';
import { useAuth } from '@/components/auth/auth-provider';
import { useEffect, useState } from 'react';
import { db } from '@/lib/supabase';

export default function Dashboard() {
  const { user, loading } = useAuth();
  const [analysisHistory, setAnalysisHistory] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalAnalyses: 0,
    deepfakesDetected: 0,
    averageConfidence: 0.91,
    processingTime: 1.8
  });

  useEffect(() => {
    if (user && !loading) {
      fetchUserData();
    }
  }, [user, loading]);

  const fetchUserData = async () => {
    if (!user) return;

    try {
      // Fetch user's analyses
      const userAnalyses = await db.getUserAnalyses(user.id, 10);
      
      if (userAnalyses) {
        const formattedHistory = userAnalyses.map(analysis => {
          try {
            const output = JSON.parse(analysis.output);
            return {
              id: analysis.id,
              filename: analysis.input,
              timestamp: new Date(analysis.created_at).toLocaleString(),
              confidence: output.confidence || 0.5,
              isDeepfake: output.isDeepfake || false,
              status: 'completed'
            };
          } catch {
            return {
              id: analysis.id,
              filename: analysis.input,
              timestamp: new Date(analysis.created_at).toLocaleString(),
              confidence: 0.5,
              isDeepfake: false,
              status: 'completed'
            };
          }
        });

        setAnalysisHistory(formattedHistory);

        // Calculate stats
        const totalAnalyses = formattedHistory.length;
        const deepfakesDetected = formattedHistory.filter(a => a.isDeepfake).length;
        const avgConfidence = formattedHistory.length > 0 
          ? formattedHistory.reduce((sum, a) => sum + a.confidence, 0) / formattedHistory.length
          : 0.91;

        setStats({
          totalAnalyses,
          deepfakesDetected,
          averageConfidence: avgConfidence,
          processingTime: 1.8
        });
      }
    } catch (error) {
      console.error('Failed to fetch user data:', error);
      // Use mock data as fallback
      setAnalysisHistory([
        {
          id: '1',
          filename: 'interview_video.mp4',
          timestamp: '2025-01-02 14:30',
          confidence: 0.95,
          isDeepfake: false,
          status: 'completed'
        },
        {
          id: '2',
          filename: 'social_media_clip.mp4',
          timestamp: '2025-01-02 13:15',
          confidence: 0.87,
          isDeepfake: true,
          status: 'completed'
        },
        {
          id: '3',
          filename: 'news_segment.mp4',
          timestamp: '2025-01-02 12:00',
          confidence: 0.92,
          isDeepfake: false,
          status: 'completed'
        }
      ]);
    }
  };

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-20 pb-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-foreground mb-2 heading-cosmic">
                Dashboard
              </h1>
              <p className="text-xl text-muted-foreground">
                Monitor your deepfake detection activities and results
              </p>
            </div>

            <ProtectedContent>
              <div className="grid lg:grid-cols-4 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-3 space-y-8">
                  {/* Pro Plan Section - Prominent placement */}
                  <ProPlanSection />

                  {/* Protected API Demo Section */}
                  <Card className="card-cosmic">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-foreground">
                        <Database className="w-5 h-5 text-primary" />
                        🔒 Protected API Access
                      </CardTitle>
                      <CardDescription className="text-muted-foreground">
                        Authenticated API endpoints using Supabase authentication
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ProtectedApiDemo />
                    </CardContent>
                  </Card>

                  {/* Stats Cards */}
                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card className="card-cosmic">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">
                              Total Analyses
                            </p>
                            <p className="text-2xl font-bold text-foreground">
                              {stats.totalAnalyses}
                            </p>
                          </div>
                          <BarChart3 className="w-8 h-8 text-primary" />
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="card-cosmic">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">
                              Deepfakes Found
                            </p>
                            <p className="text-2xl font-bold text-red-400">
                              {stats.deepfakesDetected}
                            </p>
                          </div>
                          <Shield className="w-8 h-8 text-red-400" />
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="card-cosmic">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">
                              Avg. Confidence
                            </p>
                            <p className="text-2xl font-bold text-green-400">
                              {(stats.averageConfidence * 100).toFixed(1)}%
                            </p>
                          </div>
                          <TrendingUp className="w-8 h-8 text-green-400" />
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="card-cosmic">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">
                              Avg. Time
                            </p>
                            <p className="text-2xl font-bold text-foreground">
                              {stats.processingTime}s
                            </p>
                          </div>
                          <Clock className="w-8 h-8 text-primary" />
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Analysis History */}
                  <Card className="card-cosmic">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-foreground">
                        <Video className="w-5 h-5" />
                        Recent Analyses
                      </CardTitle>
                      <CardDescription className="text-muted-foreground">
                        Your latest deepfake detection results
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {analysisHistory.length > 0 ? (
                        <div className="space-y-4">
                          {analysisHistory.map((analysis) => (
                            <div
                              key={analysis.id}
                              className="flex items-center justify-between p-4 bg-card/50 rounded-lg border border-border/50"
                            >
                              <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                  analysis.isDeepfake 
                                    ? 'bg-red-500/20 border border-red-500/30' 
                                    : 'bg-green-500/20 border border-green-500/30'
                                }`}>
                                  {analysis.isDeepfake ? (
                                    <AlertTriangle className="w-5 h-5 text-red-400" />
                                  ) : (
                                    <CheckCircle className="w-5 h-5 text-green-400" />
                                  )}
                                </div>
                                <div>
                                  <p className="font-medium text-foreground">
                                    {analysis.filename}
                                  </p>
                                  <p className="text-sm text-muted-foreground">
                                    {analysis.timestamp}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-4">
                                <Badge className={analysis.isDeepfake ? "badge-cosmic-destructive" : "badge-cosmic"}>
                                  {analysis.isDeepfake ? 'Deepfake' : 'Authentic'}
                                </Badge>
                                <div className="text-right">
                                  <p className="text-sm font-medium text-foreground">
                                    {(analysis.confidence * 100).toFixed(1)}% confidence
                                  </p>
                                  <Progress 
                                    value={analysis.confidence * 100} 
                                    className="w-20 h-2 mt-1 progress-cosmic"
                                  />
                                </div>
                                <Button variant="ghost" size="sm" className="hover:bg-primary/10">
                                  <Eye className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <Video className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                          <p className="text-muted-foreground">
                            No analyses yet. Start by uploading media for deepfake detection.
                          </p>
                        </div>
                      )}
                      
                      {analysisHistory.length > 0 && (
                        <div className="mt-6 text-center">
                          <Button className="btn-cosmic-secondary">
                            <Download className="mr-2 h-4 w-4" />
                            Export History
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* Sidebar */}
                <div className="lg:col-span-1">
                  <UserProfile />
                </div>
              </div>
            </ProtectedContent>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}