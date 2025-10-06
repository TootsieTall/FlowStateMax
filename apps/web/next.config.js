/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@flowstate/ui', '@flowstate/core'],
  experimental: {
    serverActions: true,
  },
}

module.exports = nextConfig
