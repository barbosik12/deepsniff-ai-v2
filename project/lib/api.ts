// API configuration and utilities
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.example.com';
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

// API response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface DeepfakeAnalysisResult {
  id: string;
  confidence: number;
  isDeepfake: boolean;
  analysisTime: number;
  details: {
    faceDetection: boolean;
    temporalConsistency: number;
    artifactScore: number;
  };
  timestamp: string;
}

// Enhanced face detection interface
export interface FaceDetection {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  confidence: number;
  deepfakeScore: number;
  anomalies: {
    structural: number;
    textural: number;
    temporal: number;
    metadata: number;
  };
  details: {
    blinkingPattern: number;
    eyeMovement: number;
    lipSync: number;
    skinTexture: number;
    shadowConsistency: number;
    edgeArtifacts: number;
  };
}

// Enhanced analysis result
export interface EnhancedAnalysisResult extends DeepfakeAnalysisResult {
  faces: FaceDetection[];
  heatmapData: number[][];
  overallVerdict: string;
  technicalSummary: string;
}

// Generic API request function
export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  if (!API_KEY) {
    return {
      success: false,
      error: 'API key not configured'
    };
  }

  try {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
        'X-API-Key': API_KEY,
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    return {
      success: true,
      data,
      message: 'Request successful'
    };
  } catch (error) {
    console.error('API request failed:', error);
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

// Specific API functions for DeepSniff
export async function analyzeVideo(videoFile: File): Promise<ApiResponse<DeepfakeAnalysisResult>> {
  const formData = new FormData();
  formData.append('video', videoFile);
  formData.append('analysis_type', 'deepfake_detection');

  return apiRequest<DeepfakeAnalysisResult>('/analyze/video', {
    method: 'POST',
    body: formData,
    headers: {
      // Remove Content-Type to let browser set it with boundary for FormData
    }
  });
}

export async function getAnalysisHistory(): Promise<ApiResponse<DeepfakeAnalysisResult[]>> {
  return apiRequest<DeepfakeAnalysisResult[]>('/analysis/history');
}

export async function getApiStatus(): Promise<ApiResponse<{ status: string; version: string }>> {
  return apiRequest('/status');
}

// Mock data for demonstration (when real API is not available)
export function getMockAnalysisResult(): DeepfakeAnalysisResult {
  const isDeepfake = Math.random() > 0.6; // 40% chance of being deepfake
  const confidence = isDeepfake 
    ? Math.random() * 0.3 + 0.7  // 70-100% if deepfake
    : Math.random() * 0.4 + 0.1; // 10-50% if real

  return {
    id: `analysis_${Date.now()}`,
    confidence,
    isDeepfake,
    analysisTime: Math.random() * 3000 + 1000, // 1-4 seconds
    details: {
      faceDetection: Math.random() > 0.1, // 90% chance of face detection
      temporalConsistency: Math.random() * 0.3 + 0.7, // 70-100%
      artifactScore: isDeepfake ? Math.random() * 0.5 + 0.3 : Math.random() * 0.3, // Higher if deepfake
    },
    timestamp: new Date().toISOString()
  };
}

// Generate mock face detection data
export function generateMockFaces(numFaces: number = 1): FaceDetection[] {
  const faces: FaceDetection[] = [];

  for (let i = 0; i < numFaces; i++) {
    const deepfakeScore = Math.random();
    faces.push({
      id: `face_${i + 1}`,
      x: Math.random() * 60 + 10, // 10-70% from left
      y: Math.random() * 40 + 10, // 10-50% from top
      width: Math.random() * 20 + 15, // 15-35% width
      height: Math.random() * 25 + 20, // 20-45% height
      confidence: Math.random() * 0.3 + 0.7, // 70-100% detection confidence
      deepfakeScore,
      anomalies: {
        structural: Math.random() * 0.4 + (deepfakeScore > 0.5 ? 0.3 : 0),
        textural: Math.random() * 0.5 + (deepfakeScore > 0.6 ? 0.2 : 0),
        temporal: Math.random() * 0.6 + (deepfakeScore > 0.7 ? 0.3 : 0),
        metadata: Math.random() * 0.3
      },
      details: {
        blinkingPattern: Math.random() * 0.8 + (deepfakeScore > 0.6 ? 0.2 : 0),
        eyeMovement: Math.random() * 0.7 + (deepfakeScore > 0.5 ? 0.3 : 0),
        lipSync: Math.random() * 0.9 + (deepfakeScore > 0.7 ? 0.1 : 0),
        skinTexture: Math.random() * 0.6 + (deepfakeScore > 0.4 ? 0.4 : 0),
        shadowConsistency: Math.random() * 0.5 + (deepfakeScore > 0.6 ? 0.3 : 0),
        edgeArtifacts: Math.random() * 0.7 + (deepfakeScore > 0.5 ? 0.3 : 0)
      }
    });
  }

  return faces;
}

// Generate mock heatmap data
export function generateMockHeatmap(): number[][] {
  const heatmap: number[][] = [];
  for (let i = 0; i < 20; i++) {
    const row: number[] = [];
    for (let j = 0; j < 30; j++) {
      // Create some patterns in the heatmap
      const centerX = 15;
      const centerY = 10;
      const distance = Math.sqrt((j - centerX) ** 2 + (i - centerY) ** 2);
      const baseValue = Math.max(0, 1 - distance / 15);
      row.push(Math.min(1, baseValue + Math.random() * 0.3));
    }
    heatmap.push(row);
  }
  return heatmap;
}