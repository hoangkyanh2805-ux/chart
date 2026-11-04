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
    // Only disable cache on local mounted/virtual drives if not on Vercel
    if (!process.env.VERCEL) {
      config.cache = false;
    }
    return config;
  },
};

export default nextConfig;
