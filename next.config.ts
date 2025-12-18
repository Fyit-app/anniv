import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
    qualities: [75, 80, 90],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "100mb", // Permet l'upload de vidéos jusqu'à 100MB
    },
  },
};

export default nextConfig;
