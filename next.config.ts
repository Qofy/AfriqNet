import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    // Allow loading images from Unsplash (used by your movie posters)
    domains: ["images.unsplash.com"],
    // Alternatively you can use `remotePatterns` for more control:
    // remotePatterns: [
    //   { protocol: 'https', hostname: 'images.unsplash.com', pathname: '/**' }
    // ]
  },
};

export default nextConfig;
