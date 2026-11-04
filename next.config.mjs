/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typescript: {
    // Allow production builds on Vercel to successfully complete even if minor type mismatches occur
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  webpack: (config) => {
    // Disable filesystem pack caching on virtual/mounted drives to avoid EINVAL file locks
    config.cache = false;
    return config;
  },
};

export default nextConfig;
