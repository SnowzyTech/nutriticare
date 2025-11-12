/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },

  // --- ADD THIS PART TO FIX THE BUILD ERROR ---
  webpack: (config, { isServer }) => {
    // This is the fix:
    // We tell webpack to treat 'jsdom' as an empty module on the server
    // to prevent it from being bundled into your API routes.
    if (isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        'jsdom': false,
      };
    }

    return config;
  },
  // --- END OF FIX ---
}

export default nextConfig