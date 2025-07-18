"use client";

import { useState, useRef, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Upload, 
  Image as ImageIcon, 
  Loader2,
  FileImage,
  X,
  Eye,
  Download,
  Zap,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

interface UploadedFile {
  file: File;
  preview: string;
}

export function GradCamUploadForm() {
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [heatmapImage, setHeatmapImage] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

    // Check if it's an image
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file (PNG, JPG, JPEG, WebP)');
      return;
    }

    // Check file size (maximum 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('File too large. Maximum size: 10MB');
      return;
    }

    // Clear previous results and errors
    setError(null);
    setHeatmapImage(null);

    // Create preview
    const preview = URL.createObjectURL(file);
    
    setUploadedFile({
      file,
      preview
    });
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  const analyzeImage = async () => {
    if (!uploadedFile) return;

    setIsAnalyzing(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('image', uploadedFile.file);

      const response = await fetch('https://your-domain.com/predict/image/visual', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Check if response is an image
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.startsWith('image/')) {
        throw new Error('Expected image response from server');
      }

      // Convert response to blob and create object URL
      const blob = await response.blob();
      const imageUrl = URL.createObjectURL(blob);
      
      setHeatmapImage(imageUrl);

    } catch (error) {
      console.error('Analysis failed:', error);
      setError(error instanceof Error ? error.message : 'Analysis failed. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const clearFile = () => {
    if (uploadedFile) {
      URL.revokeObjectURL(uploadedFile.preview);
    }
    if (heatmapImage) {
      URL.revokeObjectURL(heatmapImage);
    }
    setUploadedFile(null);
    setHeatmapImage(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const downloadHeatmap = () => {
    if (!heatmapImage) return;
    
    const link = document.createElement('a');
    link.href = heatmapImage;
    link.download = `gradcam-heatmap-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl sm:text-4xl font-bold mb-4 heading-cosmic">
          🔥 Grad-CAM Visual Analysis
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Upload an image to generate a Grad-CAM heatmap showing which regions the AI model focuses on for deepfake detection.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Upload Section */}
        <Card className="card-cosmic">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Upload className="w-5 h-5 text-primary" />
              📤 Upload Image
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Upload an image to generate a Grad-CAM heatmap visualization
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!uploadedFile ? (
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
                      Drop your image here
                    </p>
                    <p className="text-sm text-muted-foreground mb-4">
                      or click to browse
                    </p>
                    <div className="flex items-center justify-center space-x-2 text-xs text-muted-foreground">
                      <FileImage className="w-4 h-4" />
                      <span>PNG, JPG, JPEG, WebP (max 10MB)</span>
                    </div>
                  </div>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileInputChange}
                />
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
                  
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted flex items-center justify-center">
                      <img 
                        src={uploadedFile.preview} 
                        alt="Preview" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{uploadedFile.file.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {(uploadedFile.file.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                      <Badge className="badge-cosmic mt-1">
                        Image
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Analysis Button */}
                <Button
                  onClick={analyzeImage}
                  disabled={isAnalyzing}
                  className="w-full btn-cosmic-primary font-semibold py-6"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Generating Grad-CAM...
                    </>
                  ) : (
                    <>
                      <Zap className="mr-2 h-5 w-5" />
                      Generate Heatmap
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
              🔥 Grad-CAM Heatmap
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Visual representation of AI model attention regions
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!heatmapImage ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                  <ImageIcon className="w-8 h-8 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground mb-2">
                  Upload an image and generate heatmap
                </p>
                <p className="text-xs text-muted-foreground">
                  The heatmap will show which areas the AI focuses on
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Heatmap Display */}
                <div className="relative group">
                  <div className="rounded-lg overflow-hidden shadow-2xl border border-border/30 bg-card/20 p-2">
                    <img
                      src={heatmapImage}
                      alt="Grad-CAM Heatmap"
                      className="w-full h-auto rounded-md transition-all duration-500 opacity-0 animate-fade-in-up"
                      style={{ 
                        filter: 'drop-shadow(0 0 20px rgba(125, 211, 252, 0.3))',
                        animation: 'fadeIn 0.8s ease-out forwards'
                      }}
                      onLoad={(e) => {
                        (e.target as HTMLImageElement).style.opacity = '1';
                      }}
                    />
                  </div>
                  
                  {/* Overlay info */}
                  <div className="absolute top-4 left-4 bg-background/90 backdrop-blur-sm rounded-lg px-3 py-2 border border-border/50">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-sm font-medium text-foreground">Grad-CAM Generated</span>
                    </div>
                  </div>
                </div>

                {/* Heatmap Legend */}
                <div className="bg-card/30 p-4 rounded-lg border border-border/30">
                  <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    🎨 Heatmap Legend
                  </h4>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div className="text-center">
                      <div className="w-8 h-8 mx-auto mb-2 rounded-full bg-gradient-to-r from-blue-500 to-blue-600"></div>
                      <p className="text-blue-400 font-medium">Low Attention</p>
                      <p className="text-xs text-muted-foreground">Background areas</p>
                    </div>
                    <div className="text-center">
                      <div className="w-8 h-8 mx-auto mb-2 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500"></div>
                      <p className="text-yellow-400 font-medium">Medium Attention</p>
                      <p className="text-xs text-muted-foreground">Relevant features</p>
                    </div>
                    <div className="text-center">
                      <div className="w-8 h-8 mx-auto mb-2 rounded-full bg-gradient-to-r from-red-500 to-red-600"></div>
                      <p className="text-red-400 font-medium">High Attention</p>
                      <p className="text-xs text-muted-foreground">Critical regions</p>
                    </div>
                  </div>
                </div>

                {/* Success Message */}
                <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <p className="text-green-400 font-medium">Analysis Complete</p>
                  </div>
                  <p className="text-sm text-green-300">
                    The heatmap shows which regions the AI model considers most important for deepfake detection.
                    Red areas indicate high attention, while blue areas show low attention.
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Button 
                    onClick={downloadHeatmap}
                    className="flex-1 btn-cosmic-primary group"
                  >
                    <Download className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                    Download Heatmap
                  </Button>
                  <Button 
                    onClick={clearFile}
                    className="flex-1 btn-cosmic-secondary group"
                  >
                    <Upload className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                    New Analysis
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Info Section */}
      <Card className="card-cosmic">
        <CardContent className="p-6">
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-4 text-foreground">🧠 About Grad-CAM</h3>
            <p className="text-muted-foreground leading-relaxed max-w-3xl mx-auto">
              Gradient-weighted Class Activation Mapping (Grad-CAM) is a technique that produces visual explanations 
              for decisions from CNN-based models. It highlights the important regions in the image that the model 
              uses to make its deepfake detection decision, helping you understand what the AI is "looking at."
            </p>
          </div>
        </CardContent>
      </Card>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}