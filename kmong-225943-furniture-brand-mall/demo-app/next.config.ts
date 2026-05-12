import type { NextConfig } from 'next'

const isPages = process.env.GITHUB_PAGES === 'true'
const basePath = isPages ? '/demos/kmong-225943-demo' : ''

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  basePath,
  images: { unoptimized: true },
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
}

export default nextConfig
