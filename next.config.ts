/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Important pour Firebase
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true, // Optionnel, si vous avez des erreurs TypeScript
  },
};

module.exports = nextConfig;