/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { 
    unoptimized: true,
    domains: ['images.unsplash.com', 'i.postimg.cc', 'api.qrserver.com']
  },
  
  // Webpack configuration optimized for deployment
  webpack: (config, { isServer }) => {
    // Disable webpack caching to prevent cache-related build errors
    config.cache = false;

    // Handle node modules that might cause issues in the browser
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        stream: false,
        url: false,
        zlib: false,
        http: false,
        https: false,
        assert: false,
        os: false,
        path: false,
      };
    }

    // Handle .mjs files properly
    config.module.rules.push({
      test: /\.mjs$/,
      include: /node_modules/,
      type: 'javascript/auto',
    });

    // Ignore specific modules that cause issues
    config.externals = config.externals || [];
    if (!isServer) {
      config.externals.push({
        'utf-8-validate': 'commonjs utf-8-validate',
        'bufferutil': 'commonjs bufferutil',
      });
    }

    return config;
  },

  // Environment variables configuration
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },

  // Disable strict mode for better compatibility
  reactStrictMode: false,

  // Disable server-side features for static export
  experimental: {
    esmExternals: false,
  },
};

module.exports = nextConfig;