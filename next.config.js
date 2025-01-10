/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  transpilePackages: ['@shopify/polaris', '@shopify/app-bridge-react'],
  images: {
    unoptimized: true,
    domains: ['res.cloudinary.com']
  },
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false
    };
    return config;
  }
};

module.exports = nextConfig; 