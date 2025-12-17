import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: ["10.238.234.104"],
  // Allow images from localhost
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "1337",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "10.238.234.104",
        port: "1337",
        pathname: "/**",
      }
    ],
    unoptimized: true,
  },
};

export default nextConfig;
