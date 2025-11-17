/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.david-tec.com',
      },
      {
        protocol: 'http',
        hostname: 'www.david-tec.com',
      },
      {
        protocol: 'https',
        hostname: 'www.pingidentity.com',
      },
    ],
  },
}

export default nextConfig
