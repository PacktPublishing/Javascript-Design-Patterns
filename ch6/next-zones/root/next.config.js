/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/search/:path*',
        destination: 'http://localhost:3001/search/:path*',
      },
      {
        source: '/checkout/:path*',
        destination: 'http://localhost:3002/checkout/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
