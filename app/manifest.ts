import { MetadataRoute } from 'next';
import { APP_CONFIG } from '@/lib/constants';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: APP_CONFIG.name,
    short_name: 'DeepSniff',
    description: APP_CONFIG.description,
    start_url: '/',
    display: 'standalone',
    background_color: '#0d0d1a',
    theme_color: '#7dd3fc',
    icons: [
      {
        src: '/favicon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/favicon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
    categories: ['productivity', 'security', 'utilities'],
    lang: 'en',
    orientation: 'portrait-primary',
  };
}