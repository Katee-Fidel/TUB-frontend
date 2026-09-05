/** @type {import('next').NextConfig} */
const backendUrl = process.env.BACKEND_URL?.replace(/\/$/, "");

const nextConfig = {
  async rewrites() {
    if (!backendUrl) return [];

    return [
      {
        source: "/api/:path*",
        destination: `${backendUrl}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
