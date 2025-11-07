/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: { serverActions: {} },
  typescript: { ignoreBuildErrors: true },
};
module.exports = nextConfig;
