import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // Sets the body size limit slightly higher than 50MB to support your files
      bodySizeLimit: "55mb",
    },
  },
};

export default nextConfig;