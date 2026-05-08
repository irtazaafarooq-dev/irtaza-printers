import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Move it here, to the top level
  // @ts-ignore
  // allowedDevOrigins: ['*.trycloudflare.com'],

  /* other config options */

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.shutterstock.com',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
  
  reactCompiler: true,
};

export default nextConfig;