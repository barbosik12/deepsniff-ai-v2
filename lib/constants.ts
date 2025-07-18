// Application constants

export const APP_CONFIG = {
  name: 'DeepSniff',
  description: 'AI-Powered System for Exposing Deepfakes',
  url: process.env.NEXT_PUBLIC_APP_URL || 'https://deepsniff.ai',
  version: '1.0.0',
  author: 'DeepSniff Team',
  keywords: [
    'deepfake detection',
    'AI security',
    'media forensics',
    'neural network',
    'video verification',
    'fake media detection'
  ]
} as const;

export const API_CONFIG = {
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.deepsniff.ai',
  timeout: 30000, // 30 seconds
  retryAttempts: 3,
  retryDelay: 1000 // 1 second
} as const;

export const FILE_LIMITS = {
  image: {
    maxSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'],
    allowedExtensions: ['.png', '.jpg', '.jpeg', '.webp']
  },
  video: {
    maxSize: 50 * 1024 * 1024, // 50MB
    allowedTypes: ['video/mp4', 'video/mov', 'video/avi', 'video/webm'],
    allowedExtensions: ['.mp4', '.mov', '.avi', '.webm']
  }
} as const;

export const ANALYSIS_CONFIG = {
  freeLimit: 3,
  processingTimeout: 60000, // 60 seconds
  confidenceThreshold: 0.5,
  minConfidenceForDeepfake: 0.7
} as const;

export const UI_CONFIG = {
  animationDuration: 300,
  toastDuration: 5000,
  debounceDelay: 300,
  loadingDelay: 200
} as const;

export const ROUTES = {
  home: '/',
  dashboard: '/dashboard',
  supabaseTest: '/supabase-test',
  gradcam: '/gradcam'
} as const;

export const EXTERNAL_LINKS = {
  github: 'https://github.com/deepsniff',
  twitter: 'https://twitter.com/deepsniff',
  linkedin: 'https://linkedin.com/company/deepsniff',
  documentation: 'https://docs.deepsniff.ai',
  support: 'mailto:support@deepsniff.ai',
  business: 'mailto:business@deepsniff.ai'
} as const;

export const SAMPLE_VIDEOS = [
  {
    id: 'viral-kangaroo',
    title: 'Viral Animal Support Kangaroo',
    description: 'Viral video covering a Kangaroo as animal support.',
    duration: '0:45',
    thumbnail: 'https://i.postimg.cc/ZKWFpf8X/Screenshot-2025-07-02-at-13-09-41-App-Deep-Guard.png',
    type: 'video' as const
  },
  {
    id: 'trump-un-speech',
    title: 'Trump UN Speech 2018',
    description: 'News video covering Trump\'s speech.',
    duration: '2:14',
    thumbnail: 'https://i.postimg.cc/LXY2zYTt/Screenshot-2025-07-02-at-13-09-26-App-Deep-Guard.png',
    type: 'video' as const
  },
  {
    id: 'obama-whitehouse',
    title: 'Obama at the White House – Speech',
    description: 'Obama\'s public statement at the White House.',
    duration: '1:32',
    thumbnail: 'https://i.postimg.cc/pVBRKHQ1/Screenshot-2025-07-02-at-13-09-34-App-Deep-Guard.png',
    type: 'video' as const
  }
] as const;

export const TESTIMONIALS = [
  {
    id: 1,
    quote: "I tried DeepSniff on a few viral clips, and it instantly gave me clarity. It's fast, simple, and honestly something everyone should have in their digital toolbox.",
    name: "Dumitru Boaghe",
    position: "CEO at MI Moldova",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face&auto=format&q=80"
  },
  {
    id: 2,
    quote: "You come here to know if it's fake or not — that's it. DeepSniff delivers exactly that: a simple, clean tool that gives users instant clarity by analyzing videos and revealing the truth.",
    name: "Andrey Vinitsky",
    position: "CEO at Graphy.app",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face&auto=format&q=80"
  },
  {
    id: 3,
    quote: "As someone who's spent years defending democracies from disinformation, I see DeepSniff as a frontline ally. It's the kind of precision tool I wish we had during high-stakes campaigns and election monitoring.",
    name: "James Holtum",
    position: "Director Strategy at SADF",
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face&auto=format&q=80&sat=-100"
  }
] as const;