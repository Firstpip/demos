import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: process.env.GITHUB_PAGES ? "/demos/kmong-225469-demo" : "",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
