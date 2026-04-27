import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  basePath: process.env.GITHUB_PAGES ? '/demos/kmong-225834-demo' : '',
  images: { unoptimized: true },
};

export default nextConfig;
