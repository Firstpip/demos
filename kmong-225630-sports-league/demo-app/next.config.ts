import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: process.env.GITHUB_PAGES ? '/demos/kmong-225630-demo' : '',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
