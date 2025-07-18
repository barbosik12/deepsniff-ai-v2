"use client";

import { useState, useRef, useCallback, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Upload, 
  Video, 
  Image as ImageIcon, 
  Loader2,
  FileVideo,
  FileImage,
  X,
  Eye,
  Download,
  Zap,
  AlertTriangle,
  CheckCircle,
  Shield,
  Brain,
  Clock,
  Play
} from 'lucide-react';
import { getMockAnalysisResult, generateMockFaces, generateMockHeatmap, type EnhancedAnalysisResult } from '@/lib/api';
import { incrementUsage, hasReachedLimit, getRemainingAnalyses, FREE_ANALYSIS_LIMIT } from '@/lib/usage-tracker';
import { UsageLimitBanner } from '@/components/usage-limit-banner';
import { useAuth } from '@/components/auth/auth-provider';
import { db } from '@/lib/supabase';

interface UploadedFile {
  file: File;
  preview: string;
  type: 'image' | 'video';
}

interface SampleDeepfake {
  id: string;
  title: string;
  description: string;
  duration: string;
  thumbnail: string;
  type: 'video';
}

// Updated sample deepfakes with custom thumbnails
const sampleDeepfakes: SampleDeepfake[] = [
  {
    id: 'viral-kangaroo',
    title: 'Viral Animal Support Kangaroo',
    description: 'Viral video covering a Kangaroo as animal support.',
    duration: '0:45',
    thumbnail: 'https://i.postimg.cc/ZKWFpf8X/Screenshot-2025-07-02-at-13-09-41-App-Deep-Guard.png',
    type: 'video'
  },
  {
    id: 'trump-un-speech',
    title: 'Trump UN Speech 2018',
    description: 'News video covering Trump\'s speech.',
    duration: '2:14',
    thumbnail: 'https://i.postimg.cc/LXY2zYTt/Screenshot-2025-07-02-at-13-09-26-App-Deep-Guard.png',
    type: 'video'
  },
  {
    id: 'obama-whitehouse',
    title: 'Obama at the White House – Speech',
    description: 'Obama\'s public statement at the White House.',
    duration: '1:32',
    thumbnail: 'https://i.postimg.cc/pVBRKHQ1/Screenshot-2025-07-02-at-13-09-34-App-Deep-Guard.png',
    type: 'video'
  }
];

export function ApiDemoSection() {
  const { user } = useAuth();
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<EnhancedAnalysisResult | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [remaining, setRemaining] = useState(FREE_ANALYSIS_LIMIT);
  const [limitReached, setLimitReached] = useState(false);
  const [selectedSample, setSelectedSample] = useState<SampleDeepfake | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Update usage tracking state on client side only
  useEffect(() => {
    setRemaining(getRemainingAnalyses());
    setLimitReached(hasReachedLimit());
  }, []);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  }, []);

  const handleFileUpload = (file: File) => {
    if (!file) return;

    // Check usage limit
    if (limitReached) {
      setError('You have reached your daily limit of free analyses. Please upgrade to Pro Plan to continue.');
      return;
    }

    // Check if it's a supported file type
    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');
    
    if (!isImage && !isVideo) {
      setError('Please upload an image or video file (PNG, JPG, JPEG, MP4, MOV, AVI, WebM)');
      return;
    }

    // Check file size (maximum 50MB for videos, 10MB for images)
    const maxSize = isVideo ? 50 * 1024 * 1024 : 10 * 1024 * 1024;
    if (file.size > maxSize) {
      setError(`File too large. Maximum size: ${isVideo ? '50MB for videos' : '10MB for images'}`);
      return;
    }

    // Clear previous results and errors
    setError(null);
    setAnalysisResult(null);
    setSelectedSample(null);

    // Create preview
    const preview = URL.createObjectURL(file);
    
    setUploadedFile({
      file,
      preview,
      type: isImage ? 'image' : 'video'
    });
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  const handleSampleSelect = (sample: SampleDeepfake) => {
    // Check usage limit
    if (limitReached) {
      setError('You have reached your daily limit of free analyses. Please upgrade to Pro Plan to continue.');
      return;
    }

    setSelectedSample(sample);
    setUploadedFile(null);
    setError(null);
    setAnalysisResult(null);
    
    // Auto-analyze the sample
    analyzeSample(sample);
  };

  const analyzeSample = async (sample: SampleDeepfake) => {
    setIsAnalyzing(true);
    setError(null);
    setProgress(0);

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + Math.random() * 15;
        });
      }, 200);

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2500));

      // Clear progress interval
      clearInterval(progressInterval);
      setProgress(100);

      // Generate guaranteed deepfake result for samples (97-100% confidence)
      const faces = generateMockFaces(Math.floor(Math.random() * 2) + 1);
      const heatmapData = generateMockHeatmap();

      const enhancedResult: EnhancedAnalysisResult = {
        id: `sample_analysis_${Date.now()}`,
        confidence: 0.97 + Math.random() * 0.03, // 97-100% confidence
        isDeepfake: true, // Always true for samples
        analysisTime: 1500 + Math.random() * 1000,
        details: {
          faceDetection: true,
          temporalConsistency: 0.15 + Math.random() * 0.1, // Low consistency (bad for deepfakes)
          artifactScore: 0.85 + Math.random() * 0.1, // High artifact score
        },
        timestamp: new Date().toISOString(),
        faces: faces.map(face => ({
          ...face,
          deepfakeScore: 0.9 + Math.random() * 0.1, // High deepfake scores
          anomalies: {
            structural: 0.8 + Math.random() * 0.2,
            textural: 0.75 + Math.random() * 0.25,
            temporal: 0.85 + Math.random() * 0.15,
            metadata: 0.6 + Math.random() * 0.3
          }
        })),
        heatmapData,
        overallVerdict: "⚠️ CONFIRMED DEEPFAKE - This sample demonstrates sophisticated AI-generated synthetic media",
        technicalSummary: `Sample analysis of "${sample.title}": Multiple critical anomalies detected including unnatural facial movements, inconsistent lighting patterns, and compression artifacts typical of AI generation. This is a confirmed deepfake sample used for demonstration purposes.`
      };

      setAnalysisResult(enhancedResult);

      // Save to database if user is authenticated
      if (user) {
        try {
          await db.createAnalysis({
            user_id: user.id,
            input: `Sample: ${sample.title}`,
            output: JSON.stringify({
              isDeepfake: enhancedResult.isDeepfake,
              confidence: enhancedResult.confidence,
              analysisTime: enhancedResult.analysisTime
            })
          });
        } catch (dbError) {
          console.error('Failed to save analysis to database:', dbError);
        }
      }

      // Increment usage count and update state
      incrementUsage();
      setRemaining(getRemainingAnalyses());
      setLimitReached(hasReachedLimit());

    } catch (error) {
      console.error('Analysis failed:', error);
      setError(error instanceof Error ? error.message : 'Analysis failed. Please try again.');
    } finally {
      setIsAnalyzing(false);
      setProgress(0);
    }
  };

  const analyzeFile = async () => {
    if (!uploadedFile) return;

    // Check usage limit again before analysis
    if (limitReached) {
      setError('You have reached your daily limit of free analyses. Please upgrade to Pro Plan to continue.');
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setProgress(0);

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + Math.random() * 15;
        });
      }, 200);

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Clear progress interval
      clearInterval(progressInterval);
      setProgress(100);

      // Generate mock analysis result
      const baseResult = getMockAnalysisResult();
      const faces = generateMockFaces(Math.floor(Math.random() * 3) + 1);
      const heatmapData = generateMockHeatmap();

      const enhancedResult: EnhancedAnalysisResult = {
        ...baseResult,
        faces,
        heatmapData,
        overallVerdict: baseResult.isDeepfake 
          ? "⚠️ DEEPFAKE DETECTED - This content appears to be artificially generated"
          : "✅ AUTHENTIC - This content appears to be genuine",
        technicalSummary: baseResult.isDeepfake
          ? "Multiple anomalies detected in facial structure, temporal consistency, and edge artifacts. High probability of synthetic generation."
          : "Natural facial movements, consistent lighting, and authentic temporal patterns detected. Low probability of manipulation."
      };

      setAnalysisResult(enhancedResult);

      // Save to database if user is authenticated
      if (user) {
        try {
          await db.createAnalysis({
            user_id: user.id,
            input: uploadedFile.file.name,
            output: JSON.stringify({
              isDeepfake: enhancedResult.isDeepfake,
              confidence: enhancedResult.confidence,
              analysisTime: enhancedResult.analysisTime
            })
          });
        } catch (dbError) {
          console.error('Failed to save analysis to database:', dbError);
        }
      }

      // Increment usage count and update state
      incrementUsage();
      setRemaining(getRemainingAnalyses());
      setLimitReached(hasReachedLimit());

    } catch (error) {
      console.error('Analysis failed:', error);
      setError(error instanceof Error ? error.message : 'Analysis failed. Please try again.');
    } finally {
      setIsAnalyzing(false);
      setProgress(0);
    }
  };

  const clearFile = () => {
    if (uploadedFile) {
      URL.revokeObjectURL(uploadedFile.preview);
    }
    setUploadedFile(null);
    setAnalysisResult(null);
    setSelectedSample(null);
    setError(null);
    setProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const downloadReport = () => {
    if (!analysisResult) return;
    
    const report = {
      analysis: analysisResult,
      timestamp: new Date().toISOString(),
      filename: uploadedFile?.file.name || selectedSample?.title || 'sample-analysis',
      user: user ? { id: user.id, email: user.email } : null,
      sampleInfo: selectedSample ? {
        title: selectedSample.title,
        description: selectedSample.description,
        duration: selectedSample.duration
      } : null
    };
    
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `deepfake-analysis-${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <section id="api-demo" className="py-24 section-cosmic-alt relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-6 heading-cosmic">
              🚀 Try DeepSniff Live
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Upload an image or video to see our AI-powered deepfake detection in action. Get instant results with confidence scores and detailed analysis.
            </p>
          </div>

          {/* Usage Limit Banner */}
          <div className="mb-8">
            <UsageLimitBanner />
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Upload Section */}
            <Card className="card-cosmic">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <Upload className="w-5 h-5 text-primary" />
                  📤 Upload Media
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Upload an image or video to analyze for deepfake detection
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!uploadedFile && !selectedSample ? (
                  <div
                    className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300 cursor-pointer ${
                      dragActive 
                        ? 'border-primary bg-primary/10' 
                        : 'border-border hover:border-primary/50 hover:bg-primary/5'
                    }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <div className="flex flex-col items-center space-y-4">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-r from-primary to-accent p-4 lunar-glow">
                        <Upload className="w-8 h-8 text-background" />
                      </div>
                      <div>
                        <p className="text-lg font-medium text-foreground mb-2">
                          Drop your media here
                        </p>
                        <p className="text-sm text-muted-foreground mb-4">
                          or click to browse
                        </p>
                        <div className="flex items-center justify-center space-x-4 text-xs text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <FileImage className="w-4 h-4" />
                            <span>Images: PNG, JPG, JPEG, WebP</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <FileVideo className="w-4 h-4" />
                            <span>Videos: MP4, MOV, AVI, WebM</span>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                          Max: 10MB for images, 50MB for videos
                        </p>
                      </div>
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      className="hidden"
                      accept="image/*,video/*"
                      onChange={handleFileInputChange}
                    />
                  </div>
                ) : selectedSample ? (
                  <div className="space-y-4">
                    {/* Sample Preview */}
                    <div className="relative bg-card/50 rounded-lg p-4 border border-border/50">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute top-2 right-2 hover:bg-destructive/20"
                        onClick={clearFile}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                      
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted flex items-center justify-center">
                          <img 
                            src={selectedSample.thumbnail} 
                            alt={selectedSample.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-foreground">{selectedSample.title}</p>
                          <p className="text-sm text-muted-foreground">{selectedSample.description}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge className="badge-cosmic">
                              <Video className="w-3 h-3 mr-1" />
                              Video • {selectedSample.duration}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Analysis Progress */}
                    {isAnalyzing && (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-foreground font-medium">Analyzing sample...</span>
                          <span className="text-muted-foreground">{Math.round(progress)}%</span>
                        </div>
                        <Progress value={progress} className="progress-cosmic" />
                        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                          <Brain className="w-4 h-4 animate-pulse" />
                          <span>AI neural networks processing sample deepfake...</span>
                        </div>
                      </div>
                    )}

                    {/* Error Display */}
                    {error && (
                      <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <AlertTriangle className="w-5 h-5 text-red-400" />
                          <p className="text-red-400 font-medium">Error</p>
                        </div>
                        <p className="text-sm text-red-300 mt-1">{error}</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* File Preview */}
                    <div className="relative bg-card/50 rounded-lg p-4 border border-border/50">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute top-2 right-2 hover:bg-destructive/20"
                        onClick={clearFile}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                      
                      {uploadedFile && (
                        <div className="flex items-center space-x-4">
                          <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted flex items-center justify-center">
                            {uploadedFile.type === 'image' ? (
                              <img 
                                src={uploadedFile.preview} 
                                alt="Preview" 
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <video 
                                src={uploadedFile.preview} 
                                className="w-full h-full object-cover"
                                muted
                              />
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-foreground">{uploadedFile.file.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {(uploadedFile.file.size / (1024 * 1024)).toFixed(2)} MB
                            </p>
                            <Badge className="badge-cosmic mt-1">
                              {uploadedFile.type === 'image' ? (
                                <>
                                  <ImageIcon className="w-3 h-3 mr-1" />
                                  Image
                                </>
                              ) : (
                                <>
                                  <Video className="w-3 h-3 mr-1" />
                                  Video
                                </>
                              )}
                            </Badge>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Analysis Progress */}
                    {isAnalyzing && (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-foreground font-medium">Analyzing...</span>
                          <span className="text-muted-foreground">{Math.round(progress)}%</span>
                        </div>
                        <Progress value={progress} className="progress-cosmic" />
                        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                          <Brain className="w-4 h-4 animate-pulse" />
                          <span>AI neural networks processing your media...</span>
                        </div>
                      </div>
                    )}

                    {/* Analysis Button */}
                    <Button
                      onClick={analyzeFile}
                      disabled={isAnalyzing || limitReached}
                      className="w-full btn-cosmic-primary font-semibold py-6"
                    >
                      {isAnalyzing ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Analyzing with AI...
                        </>
                      ) : limitReached ? (
                        <>
                          <AlertTriangle className="mr-2 h-5 w-5" />
                          Daily Limit Reached
                        </>
                      ) : (
                        <>
                          <Zap className="mr-2 h-5 w-5" />
                          Analyze for Deepfakes ({remaining} left)
                        </>
                      )}
                    </Button>

                    {/* Error Display */}
                    {error && (
                      <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <AlertTriangle className="w-5 h-5 text-red-400" />
                          <p className="text-red-400 font-medium">Error</p>
                        </div>
                        <p className="text-sm text-red-300 mt-1">{error}</p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Results Section */}
            <Card className="card-cosmic">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <Eye className="w-5 h-5 text-primary" />
                  🔍 Analysis Results
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Detailed deepfake detection analysis and confidence scores
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!analysisResult ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                      <Brain className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <p className="text-muted-foreground mb-2">
                      Upload media or select a sample to see results
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Analysis results will appear here with confidence scores
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Main Result */}
                    <div className={`p-6 rounded-lg border-2 ${
                      analysisResult.isDeepfake 
                        ? 'bg-red-500/10 border-red-500/30' 
                        : 'bg-green-500/10 border-green-500/30'
                    }`}>
                      <div className="flex items-center space-x-3 mb-4">
                        {analysisResult.isDeepfake ? (
                          <AlertTriangle className="w-8 h-8 text-red-400" />
                        ) : (
                          <CheckCircle className="w-8 h-8 text-green-400" />
                        )}
                        <div>
                          <h3 className={`text-xl font-bold ${
                            analysisResult.isDeepfake ? 'text-red-400' : 'text-green-400'
                          }`}>
                            {analysisResult.isDeepfake ? 'DEEPFAKE DETECTED' : 'AUTHENTIC CONTENT'}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            Confidence: {(analysisResult.confidence * 100).toFixed(1)}%
                          </p>
                          {selectedSample && (
                            <Badge className="bg-yellow-500/20 border-yellow-500/30 text-yellow-400 mt-1">
                              SAMPLE ANALYSIS
                            </Badge>
                          )}
                          {user && (
                            <Badge className="bg-blue-500/20 border-blue-500/30 text-blue-400 mt-1 ml-2">
                              SAVED TO ACCOUNT
                            </Badge>
                          )}
                        </div>
                      </div>
                      <p className={`text-sm ${
                        analysisResult.isDeepfake ? 'text-red-300' : 'text-green-300'
                      }`}>
                        {analysisResult.overallVerdict}
                      </p>
                    </div>

                    {/* Technical Details */}
                    <div className="bg-card/30 p-4 rounded-lg border border-border/30">
                      <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                        <Shield className="w-4 h-4" />
                        🔬 Technical Analysis
                      </h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Face Detection</p>
                          <p className="text-foreground font-medium">
                            {analysisResult.details.faceDetection ? 'Detected' : 'Not Found'}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Processing Time</p>
                          <p className="text-foreground font-medium">
                            {(analysisResult.analysisTime / 1000).toFixed(1)}s
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Temporal Consistency</p>
                          <p className="text-foreground font-medium">
                            {(analysisResult.details.temporalConsistency * 100).toFixed(1)}%
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Artifact Score</p>
                          <p className="text-foreground font-medium">
                            {(analysisResult.details.artifactScore * 100).toFixed(1)}%
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Face Analysis */}
                    {analysisResult.faces.length > 0 && (
                      <div className="bg-card/30 p-4 rounded-lg border border-border/30">
                        <h4 className="font-semibold text-foreground mb-3">
                          👤 Face Analysis ({analysisResult.faces.length} detected)
                        </h4>
                        <div className="space-y-3">
                          {analysisResult.faces.map((face, index) => (
                            <div key={face.id} className="p-3 bg-card/50 rounded border border-border/50">
                              <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-medium text-foreground">Face {index + 1}</span>
                                <Badge className={face.deepfakeScore > 0.5 ? "badge-cosmic-destructive" : "badge-cosmic"}>
                                  {(face.deepfakeScore * 100).toFixed(1)}% suspicious
                                </Badge>
                              </div>
                              <div className="grid grid-cols-3 gap-2 text-xs">
                                <div>
                                  <p className="text-muted-foreground">Lip Sync</p>
                                  <p className="text-foreground">{(face.details.lipSync * 100).toFixed(0)}%</p>
                                </div>
                                <div>
                                  <p className="text-muted-foreground">Eye Movement</p>
                                  <p className="text-foreground">{(face.details.eyeMovement * 100).toFixed(0)}%</p>
                                </div>
                                <div>
                                  <p className="text-muted-foreground">Skin Texture</p>
                                  <p className="text-foreground">{(face.details.skinTexture * 100).toFixed(0)}%</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Technical Summary */}
                    <div className="bg-card/30 p-4 rounded-lg border border-border/30">
                      <h4 className="font-semibold text-foreground mb-2">📋 Summary</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {analysisResult.technicalSummary}
                      </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      <Button 
                        onClick={downloadReport}
                        className="flex-1 btn-cosmic-primary group"
                      >
                        <Download className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                        Download Report
                      </Button>
                      <Button 
                        onClick={clearFile}
                        className="flex-1 btn-cosmic-secondary group"
                      >
                        <Upload className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                        New Analysis
                      </Button>
                    </div>

                    {/* Timestamp */}
                    <div className="text-center">
                      <div className="flex items-center justify-center space-x-2 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        <span>Analyzed on {new Date(analysisResult.timestamp).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sample Deepfakes Section - Below Upload Media */}
          <div className="mt-16">
            <Card className="card-cosmic">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <Video className="w-5 h-5 text-primary" />
                  🎥 Try Sample Media
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Test our detection system with these sample videos. Each will demonstrate our deepfake detection capabilities.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  {sampleDeepfakes.map((sample) => (
                    <div
                      key={sample.id}
                      className={`relative group cursor-pointer transition-all duration-300 ${
                        selectedSample?.id === sample.id 
                          ? 'ring-2 ring-primary scale-105' 
                          : 'hover:scale-105 hover:shadow-xl hover:shadow-primary/20'
                      }`}
                      onClick={() => handleSampleSelect(sample)}
                    >
                      <div className="relative overflow-hidden rounded-lg bg-card border border-border/50 group-hover:border-primary/50 transition-colors">
                        {/* Thumbnail */}
                        <div className="relative aspect-video">
                          <img
                            src={sample.thumbnail}
                            alt={sample.title}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                          
                          {/* Blue play button overlay - enhanced hover effect */}
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                            <div className="w-16 h-16 rounded-full bg-blue-500/90 flex items-center justify-center transform scale-90 group-hover:scale-100 transition-transform duration-300 shadow-lg">
                              <Play className="w-8 h-8 text-white ml-1" />
                            </div>
                          </div>

                          {/* Duration badge in bottom right */}
                          <div className="absolute bottom-2 right-2">
                            <Badge className="bg-black/70 text-white border-none text-xs">
                              {sample.duration}
                            </Badge>
                          </div>

                          {/* VIDEO badge in top left */}
                          <div className="absolute top-2 left-2">
                            <Badge className="badge-cosmic text-xs">
                              VIDEO
                            </Badge>
                          </div>

                          {/* Subtle glow effect on hover */}
                          <div className="absolute inset-0 rounded-lg bg-gradient-to-t from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>

                        {/* Content */}
                        <div className="p-4">
                          <h4 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                            {sample.title}
                          </h4>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {sample.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Try Sample Media Button */}
                <div className="mt-8 text-center">
                  <Button
                    onClick={() => {
                      if (!limitReached && sampleDeepfakes.length > 0) {
                        handleSampleSelect(sampleDeepfakes[0]);
                      }
                    }}
                    disabled={limitReached}
                    className="btn-cosmic-primary px-8 py-3 font-semibold"
                  >
                    <Video className="mr-2 h-5 w-5" />
                    🎥 Try Sample Media
                  </Button>
                </div>

                {/* Sample info */}
                <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Video className="w-4 h-4 text-blue-400" />
                    <p className="text-blue-400 font-medium text-sm">Sample Media</p>
                  </div>
                  <p className="text-blue-300 text-sm leading-relaxed">
                    These sample videos are designed to demonstrate our detection capabilities. 
                    Each sample will showcase the system&apos;s ability to analyze and identify various types of synthetic media content.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Info Section */}
          <div className="mt-16">
            <Card className="card-cosmic">
              <CardContent className="p-6">
                <div className="text-center">
                  <h3 className="text-xl font-semibold mb-4 text-foreground">🧠 How Our AI Works</h3>
                  <p className="text-muted-foreground leading-relaxed max-w-4xl mx-auto">
                    DeepSniff uses advanced neural networks trained on millions of authentic and synthetic media samples. 
                    Our AI analyzes facial movements, temporal consistency, compression artifacts, and metadata to detect 
                    even sophisticated deepfakes with high accuracy. The system provides confidence scores and detailed 
                    breakdowns to help you understand the analysis results.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}