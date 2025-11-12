/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
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

  // --- ADD THIS LINE to fix the new build error ---
  turbopack: false, 
}

export default nextConfig