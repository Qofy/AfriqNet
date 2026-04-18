import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    // Allow loading images from Unsplash (used by your movie posters)
    domains: ["images.unsplash.com", "i.ytimg.com"],
    // Alternatively you can use `remotePatterns` for more control:
     remotePatterns: [
      {hostname:"res.cloudinary.com"}
     ]
  },
};

export default nextConfig;
