/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },

  turbopack: {},
  
  experimental: {
    serverActions: {
      bodySizeLimit: '5mb',
    },
  },

  // --- This is the fix for the jsdom error ---
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        'jsdom': false,
      };
    }
    return config;
  },
}

export default nextConfig
