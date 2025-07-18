import './globals.css';
import type { Metadata } from 'next';
import { AuthProvider } from '@/components/auth/auth-provider';

export const metadata: Metadata = {
  title: 'DeepSniff - AI-Powered System for Exposing Deepfakes | See the Truth',
  description: 'Advanced neural network technology for real-time deepfake detection. Built for security, journalism, and trust. Detect manipulated media with industry-leading accuracy.',
  keywords: 'deepfake detection, AI security, media forensics, neural network, video verification, fake media detection',
  authors: [{ name: 'DeepSniff Team' }],
  creator: 'DeepSniff',
  publisher: 'DeepSniff',
  openGraph: {
    title: 'DeepSniff - AI-Powered System for Exposing Deepfakes',
    description: 'Advanced neural network technology for real-time deepfake detection. See the truth with DeepSniff.',
    url: 'https://deepsniff.ai',
    siteName: 'DeepSniff',
    type: 'website',
    images: [
      {
        url: 'https://i.postimg.cc/BZysvynP/5f8bba9b-e5c5-4b6f-b53f-e399fb6d8b88.png',
        width: 1200,
        height: 630,
        alt: 'DeepSniff - AI-Powered System for Exposing Deepfakes',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DeepSniff - AI-Powered System for Exposing Deepfakes',
    description: 'Advanced neural network technology for real-time deepfake detection. See the truth with DeepSniff.',
    images: ['https://i.postimg.cc/BZysvynP/5f8bba9b-e5c5-4b6f-b53f-e399fb6d8b88.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}