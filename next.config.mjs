const nextConfig = {
  experimental: {
    inlineCss: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    qualities: [75, 80, 85, 90],
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
};

export default nextConfig;
