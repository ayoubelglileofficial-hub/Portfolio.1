import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    // disable built-in optimization so arbitrary external URLs are allowed
    unoptimized: true,
  },
};

export default nextConfig;
